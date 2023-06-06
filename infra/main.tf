resource "random_id" "bucket_prefix" {
  byte_length = 8
}

resource "google_storage_bucket" "tf_state" {
  name          = "${random_id.bucket_prefix.hex}-bucket-tfstate"
  force_destroy = false
  location      = "US"
  storage_class = "STANDARD"
  project       = var.project

  versioning {
    enabled = true
  }
}

data "google_iam_policy" "all_users_viewer" {
  binding {
    role = "roles/storage.objectViewer"
    members = [
      "allUsers",
    ]
  }
}

resource "google_storage_bucket_iam_policy" "policy" {
  bucket      = google_storage_bucket.web_client.name
  policy_data = data.google_iam_policy.all_users_viewer.policy_data
}

resource "google_storage_bucket" "web_client" {
  name          = "the-game.kevinmccartney.dev"
  force_destroy = false
  location      = "US"
  storage_class = "STANDARD"
  project       = var.project

  uniform_bucket_level_access = true

  versioning {
    enabled = false
  }
}
