resource "random_id" "bucket_prefix" {
  byte_length = 8
}

resource "google_storage_bucket" "tf_state" {
  name          = "${random_id.bucket_prefix.hex}-bucket-tfstate"
  force_destroy = false
  location      = "US"
  storage_class = "STANDARD"
  project       = var.project_id

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
  project       = var.project_id

  uniform_bucket_level_access = true

  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }

  versioning {
    enabled = false
  }
}

resource "google_dns_managed_zone" "kevinmccartney_dev" {
  name        = "kevinmccartney-dev"
  dns_name    = "kevinmccartney.dev."
  description = "DNS Zone for kevinmccartney.dev"
  project     = var.project_id
}

resource "google_dns_record_set" "the_game" {
  name = "the-game.${google_dns_managed_zone.kevinmccartney_dev.dns_name}."
  type = "CNAME"
  ttl  = 300

  managed_zone = google_dns_managed_zone.kevinmccartney_dev.name

  rrdatas = ["c.storage.googleapis.com"]
}


