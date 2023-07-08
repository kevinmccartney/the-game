data "google_iam_policy" "all_users_storage_viewer" {
  binding {
    role = "roles/storage.objectViewer"
    members = [
      "allUsers",
    ]
  }
}

resource "google_storage_bucket_iam_policy" "web_client_all_viewer" {
  bucket      = google_storage_bucket.web_client.name
  policy_data = data.google_iam_policy.all_users_storage_viewer.policy_data
}

resource "google_storage_bucket" "web_client" {
  name          = "the-game.kevinmccartney.dev"
  force_destroy = false
  location      = "US"
  storage_class = "STANDARD"
  project       = var.project_id

  uniform_bucket_level_access = true

  website {
    main_page_suffix = "index.html"
    not_found_page   = "404/index.html"
  }

  versioning {
    enabled = false
  }
}
