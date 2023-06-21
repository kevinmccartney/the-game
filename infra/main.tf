locals {
  services_to_activate = toset([
    "cloudasset.googleapis.com",
    "compute.googleapis.com",
    "cloudtrace.googleapis.com",
    "appengine.googleapis.com",
    "cloudapis.googleapis.com",
    "bigquery.googleapis.com",
    "bigquerystorage.googleapis.com",
    "firebasedynamiclinks.googleapis.com",
    "bigquerymigration.googleapis.com",
    "monitoring.googleapis.com",
    "logging.googleapis.com",
    "cloudasset.googleapis.com",
    "fcm.googleapis.com",
    "servicemanagement.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "datastore.googleapis.com",
    "storage-api.googleapis.com",
    "firebaseremoteconfig.googleapis.com",
    "domains.googleapis.com",
    "storage-component.googleapis.com",
    "sql-component.googleapis.com",
    "runtimeconfig.googleapis.com",
    "storage.googleapis.com",
    "testing.googleapis.com",
    "pubsub.googleapis.com",
    "securetoken.googleapis.com",
    "firebaseremoteconfigrealtime.googleapis.com",
    "clouddebugger.googleapis.com",
    "firebase.googleapis.com",
    "dns.googleapis.com",
    "firebaserules.googleapis.com",
    "identitytoolkit.googleapis.com",
    "firebasehosting.googleapis.com",
    "firebaseinstallations.googleapis.com",
    "oslogin.googleapis.com",
    "serviceusage.googleapis.com"
  ])
}

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

resource "google_project_service" "services" {
  for_each = local.services_to_activate

  project = var.project_id
  service = each.value
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
    not_found_page   = "index.html"
  }

  versioning {
    enabled = false
  }
}

resource "google_compute_managed_ssl_certificate" "dev" {
  provider    = google-beta
  name        = "the-game-cert"
  description = "cert for the game (including subdomains)"
  project     = var.project_id

  managed {
    domains = ["the-game.kevinmccartney.dev"]
  }
}

resource "google_compute_global_address" "the_game_frontend_ip" {
  address      = "34.36.250.58"
  address_type = "EXTERNAL"
  description  = "IP for the load balancer serving The Game"
  name         = "the-game-frontend-ip"
  project      = var.project_id
}

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
  default_service = google_compute_backend_bucket.the_game_prod.self_link
  name            = "the-game-lb"
  project         = var.project_id

  host_rule {
    hosts        = [google_storage_bucket.web_client.name]
    path_matcher = "default-matcher"
  }

  path_matcher {
    default_service = google_compute_backend_bucket.the_game_prod.self_link
    name            = "default-matcher"
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

resource "google_compute_backend_bucket" "the_game_prod" {
  bucket_name = google_storage_bucket.web_client.name
  name        = "the-game-prod"
  project     = var.project_id
}

# Google Identity provider
# OAuth 2.0 Client ID
# Enable Identity Toolkit API
