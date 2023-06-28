# TODO: cloud run & artifact registry apis

locals {
  functions = {
    ping : "A ping service for The Game API",
    "user-points-post" : ""
  }
}

resource "google_storage_bucket" "cloud_function_source" {
  name                        = "${var.project_id}-gcf-source"
  location                    = "US"
  uniform_bucket_level_access = true
}

resource "google_storage_bucket_object" "cf_source" {
  for_each = local.functions

  name   = "${each.key}/function_source.zip"
  bucket = google_storage_bucket.cloud_function_source.name
  source = "function_source.zip"
}


resource "google_cloudfunctions2_function" "chatbot-api" {
  # TODO: private/lb ingress
  # TODO: scaling/other stuff?

  for_each = local.functions

  name        = "the-game-${each.key}"
  location    = var.region
  description = each.value

  build_config {
    runtime     = "python39"
    entry_point = "function_handler" # Set the entry point 

    source {
      storage_source {
        bucket = google_storage_bucket.cloud_function_source.name
        object = google_storage_bucket_object.cf_source[each.key].name
      }
    }
  }

  service_config {
    max_instance_count = 1
    available_memory   = "256M"
    timeout_seconds    = 60
  }
}