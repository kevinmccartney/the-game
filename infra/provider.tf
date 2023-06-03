provider "google" {
  project = var.project
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.default_region
}

provider "random" {}
