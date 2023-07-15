resource "google_compute_global_forwarding_rule" "the_game_lb_forwarding_rule_forwarding_rule" {
  ip_address            = "34.36.250.58"
  ip_protocol           = "TCP"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  name                  = "the-game-lb-forwarding-rule-forwarding-rule"
  port_range            = "80-80"
  project               = var.project_id
  target                = google_compute_target_http_proxy.the_game_lb_forwarding_rule_target_proxy.self_link
}

resource "google_compute_global_forwarding_rule" "the_game_lb_forwarding_rule" {
  ip_address            = "34.36.250.58"
  ip_protocol           = "TCP"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  name                  = "the-game-lb-forwarding-rule"
  port_range            = "443-443"
  project               = var.project_id
  target                = google_compute_target_https_proxy.the_game_lb_target_proxy.self_link
}

resource "google_compute_target_https_proxy" "the_game_lb_target_proxy" {
  name             = "the-game-lb-target-proxy"
  project          = var.project_id
  quic_override    = "NONE"
  ssl_certificates = [google_compute_managed_ssl_certificate.dev.self_link]
  url_map          = google_compute_url_map.the_game_lb.self_link
}

resource "google_compute_url_map" "the_game_lb" {
  default_service = google_compute_backend_service.the_game_client.self_link
  name            = "the-game-lb"
  project         = var.project_id

  host_rule {
    hosts        = ["the-game.kevinmccartney.dev"]
    path_matcher = "default-matcher"
  }


  host_rule {
    hosts        = ["api.the-game.kevinmccartney.dev"]
    path_matcher = "api"
  }

  path_matcher {
    default_service = google_compute_backend_service.the_game_client.self_link
    name            = "default-matcher"
  }

  path_matcher {
    name            = "api"
    default_service = google_compute_backend_service.the_game_api.self_link
  }
}

resource "google_compute_url_map" "the_game_lb_forwarding_rule_redirect" {
  default_url_redirect {
    https_redirect         = true
    redirect_response_code = "MOVED_PERMANENTLY_DEFAULT"
    strip_query            = false
  }
  description = "Automatically generated HTTP to HTTPS redirect for the the-game-lb-forwarding-rule forwarding rule"
  name        = "the-game-lb-forwarding-rule-redirect"
  project     = var.project_id
}

resource "google_compute_target_http_proxy" "the_game_lb_forwarding_rule_target_proxy" {
  name    = "the-game-lb-forwarding-rule-target-proxy"
  project = var.project_id
  url_map = google_compute_url_map.the_game_lb_forwarding_rule_redirect.self_link
}

resource "google_compute_backend_service" "the_game_client" {
  name    = "the-game-client"
  project = var.project_id

  load_balancing_scheme = "EXTERNAL_MANAGED"
  backend {
    group       = google_compute_region_network_endpoint_group.the_game_client.id
    description = "The Next.js instance serving The Game client"
  }
}

resource "google_compute_backend_service" "the_game_api" {
  name    = "the-game-api"
  project = var.project_id

  load_balancing_scheme = "EXTERNAL_MANAGED"
  backend {
    group       = google_compute_region_network_endpoint_group.the_game_api.id
    description = "The API Gateway serving The Game"
  }
}

resource "google_compute_region_network_endpoint_group" "the_game_client" {
  provider = google-beta

  name                  = "the-game-client"
  network_endpoint_type = "SERVERLESS"
  region                = var.region
  cloud_run {
    service = google_cloud_run_service.web_app.name
  }
}

resource "google_compute_region_network_endpoint_group" "the_game_api" {
  provider = google-beta

  name                  = "the-game-api-gw"
  network_endpoint_type = "SERVERLESS"
  region                = var.region
  serverless_deployment {
    platform = "apigateway.googleapis.com"
    resource = google_api_gateway_gateway.the_game_api.gateway_id
  }
}
