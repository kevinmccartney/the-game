resource "google_cloud_run_service" "web_app" {
  project  = var.project_id
  name     = "the-game-client"
  location = "us-central1"

  template {
    spec {
      containers {
        image = "us-central1-docker.pkg.dev/the-game-388502/the-game-docker/client:latest"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  metadata {
    annotations = {
      "run.googleapis.com/ingress" = "internal-and-cloud-load-balancing"
    }
  }
}

resource "google_cloud_run_service_iam_member" "run_all_users" {
  service  = google_cloud_run_service.web_app.name
  location = google_cloud_run_service.web_app.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}
