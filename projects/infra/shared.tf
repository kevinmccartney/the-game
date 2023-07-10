resource "google_artifact_registry_repository" "my-repo" {
  project       = var.project_id
  location      = "us-central1"
  repository_id = "the-game-docker"
  description   = "The Game Docker repo"
  format        = "DOCKER"

  docker_config {
    immutable_tags = true
  }
}

