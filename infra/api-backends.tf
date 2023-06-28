####################
# Cloud Function
####################

# TODO: cloud run & artifact registry apis


resource "google_storage_bucket" "cloud_function_source" {
  name                        = "${var.project_id}-gcf-source"
  location                    = "US"
  uniform_bucket_level_access = true
}

resource "google_storage_bucket_object" "ping_source" {
  name   = "ping/function_source.zip"
  bucket = google_storage_bucket.cloud_function_source.name
  source = "function_source.zip" # Add path to the zipped function source code
}

resource "google_cloudfunctions2_function" "ping" {
  # TODO: private/lb ingress
  # TODO: scaling/other stuff?
  name        = "the-game-ping"
  location    = "us-central1"
  description = "A ping service for The Game API"

  build_config {
    runtime     = "python39"
    entry_point = "function_handler" # Set the entry point 

    source {
      storage_source {
        bucket = google_storage_bucket.cloud_function_source.name
        object = google_storage_bucket_object.ping_source.name
      }
    }
  }

  service_config {
    max_instance_count = 1
    available_memory   = "256M"
    timeout_seconds    = 60
  }
}