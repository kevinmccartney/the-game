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

resource "google_storage_bucket" "web_client" {
  name          = "the-game.kevinmccartney.dev"
  force_destroy = false
  location      = "US"
  storage_class = "STANDARD"
  project       = var.project

  versioning {
    enabled = false
  }
}
