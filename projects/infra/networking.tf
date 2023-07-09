data "google_compute_network" "default" {
  name = "default"
}

data "google_compute_subnetwork" "default" {
  name   = "default"
  region = var.region
}

resource "random_id" "ssl_cert" {
  byte_length = 4 # TODO: does this need a dependency to manage regeneration?
}

resource "google_compute_managed_ssl_certificate" "dev" {
  provider    = google-beta
  name        = "the-game-cert-${random_id.ssl_cert.hex}"
  description = "cert for the game (including subdomains)"
  project     = var.project_id

  managed {
    domains = ["the-game.kevinmccartney.dev", "api.the-game.kevinmccartney.dev"]
  }
  lifecycle {
    create_before_destroy = true
  }
}

resource "google_compute_global_address" "the_game_frontend_ip" {
  address      = "34.36.250.58"
  address_type = "EXTERNAL"
  description  = "IP for the load balancer serving The Game"
  name         = "the-game-frontend-ip"
  project      = var.project_id
}