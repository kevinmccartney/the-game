locals {
  identity_functions = toset(["user-creation-handler"])
}

resource "google_storage_bucket_object" "identity_cf_source" {
  for_each = local.identity_functions

  name           = "${each.key}/function_source.zip"
  bucket         = google_storage_bucket.cloud_function_source.name
  source         = "function_source.zip"
  detect_md5hash = ""

  lifecycle {
    ignore_changes = [
      detect_md5hash,
    ]
  }
}


resource "google_cloudfunctions_function" "identity_handlers" {
  # TODO: private/lb ingress
  # TODO: scaling/other stuff?
  for_each = local.identity_functions

  name                  = "the-game-user-creation-handler"
  description           = "Handler for Firebase user creation event"
  runtime               = "python39"
  entry_point           = "function_handler"
  source_archive_bucket = google_storage_bucket.cloud_function_source.name
  source_archive_object = google_storage_bucket_object.identity_cf_source[each.key].name

  event_trigger {
    event_type = "providers/firebase.auth/eventTypes/user.create"
    resource   = var.project_id

    failure_policy {
      retry = true
    }
  }
}
