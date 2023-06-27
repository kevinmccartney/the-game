# Stuff I haven't done
# - Firewalls
# - Project itself
# - Logging sink
# - firebase SAs (googlee-provuded) roles
# - Google Identity provider
# - OAuth 2.0 Client ID
# - Enable Identity Toolkit API

locals {
  services_to_activate = toset([
    "apigateway.googleapis.com",
    "appengine.googleapis.com",
    "bigquery.googleapis.com",
    "bigquerymigration.googleapis.com",
    "bigquerystorage.googleapis.com",
    "cloudapis.googleapis.com",
    "cloudasset.googleapis.com",
    "cloudasset.googleapis.com",
    "cloudbuild.googleapis.com",
    "clouddebugger.googleapis.com",
    "cloudfunctions.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "cloudtrace.googleapis.com",
    "compute.googleapis.com",
    "datastore.googleapis.com",
    "dns.googleapis.com",
    "domains.googleapis.com",
    "fcm.googleapis.com",
    "firebase.googleapis.com",
    "firebasedynamiclinks.googleapis.com",
    "firebasehosting.googleapis.com",
    "firebaseinstallations.googleapis.com",
    "firebaseremoteconfig.googleapis.com",
    "firebaseremoteconfigrealtime.googleapis.com",
    "firebaserules.googleapis.com",
    "iam.googleapis.com",
    "identitytoolkit.googleapis.com",
    "logging.googleapis.com",
    "monitoring.googleapis.com",
    "oslogin.googleapis.com",
    "pubsub.googleapis.com",
    "runtimeconfig.googleapis.com",
    "securetoken.googleapis.com",
    "servicecontrol.googleapis.com",
    "servicemanagement.googleapis.com",
    "serviceusage.googleapis.com",
    "sql-component.googleapis.com",
    "storage-api.googleapis.com",
    "storage-component.googleapis.com",
    "storage.googleapis.com",
    "testing.googleapis.com",
  ])
}

resource "random_id" "bucket_prefix" {
  byte_length = 8 # TODO: change this to less bytes (4?)
}

resource "random_id" "api_config" {
  byte_length = 4
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

# Web bucket
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
########################################
# SSL & Public IP for Load Balancer
########################################
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
####################
# Load balancer
####################
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
  default_service = google_compute_backend_bucket.the_game_client.self_link
  name            = "the-game-lb"
  project         = var.project_id

  host_rule {
    hosts        = [google_storage_bucket.web_client.name]
    path_matcher = "default-matcher"
  }


  host_rule {
    hosts        = ["api.the-game.kevinmccartney.dev"]
    path_matcher = "api"
  }

  path_matcher {
    default_service = google_compute_backend_bucket.the_game_client.self_link
    name            = "default-matcher"
  }

  path_matcher {
    name            = "api"
    default_service = google_compute_backend_service.the_game_api.self_link

    # path_rule {
    #   paths   = ["/home"]
    #   service = google_compute_backend_bucket.static.id
    # }
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

resource "google_compute_backend_bucket" "the_game_client" {
  bucket_name = google_storage_bucket.web_client.name
  name        = "the-game-client"
  project     = var.project_id
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

####################
# Firebase stuff
####################
resource "google_service_account" "firebase_adminsdk" {
  account_id   = "firebase-adminsdk-gb9r0"
  description  = "Firebase Admin SDK Service Agent"
  display_name = "firebase-adminsdk"
  project      = "the-game-388502"
}

resource "google_project_iam_member" "firebase_admin_firebase_sdkAdmin" {
  project = var.project_id
  role    = "roles/firebase.sdkAdminServiceAgent"
  member  = "serviceAccount:${google_service_account.firebase_adminsdk.email}"
}

resource "google_project_iam_member" "firebase_admin_token_creator" {
  project = var.project_id
  role    = "roles/iam.serviceAccountTokenCreator"
  member  = "serviceAccount:${google_service_account.firebase_adminsdk.email}"
}

####################
# Cloud Function
####################

# TODO: cloud run & artifact registry apis


resource "google_storage_bucket" "cloud_function_source" {
  name                        = "${var.project_id}-gcf-source"
  location                    = "US"
  uniform_bucket_level_access = true
}

resource "google_storage_bucket_object" "ping_source" {
  name   = "ping/function_source.zip"
  bucket = google_storage_bucket.cloud_function_source.name
  source = "function_source.zip" # Add path to the zipped function source code
}

resource "google_cloudfunctions2_function" "ping" {
  name        = "the-game-ping"
  location    = "us-central1"
  description = "A ping service for The Game API"

  build_config {
    runtime     = "python39"
    entry_point = "function_handler" # Set the entry point 

    source {
      storage_source {
        bucket = google_storage_bucket.cloud_function_source.name
        object = google_storage_bucket_object.ping_source.name
      }
    }
  }

  service_config {
    max_instance_count = 1
    available_memory   = "256M"
    timeout_seconds    = 60
  }
}

####################
# API Gateway
####################
resource "google_api_gateway_api" "the_game_api" {
  provider     = google-beta
  project      = var.project_id
  api_id       = "the-game-api"
  display_name = "the-game-api"
}

resource "google_api_gateway_api_config" "the_game_api_cfg" {
  # TODO: Create service account for gw
  # TODO: private/gw ingress
  # TODO: scaling/other stuff?
  provider      = google-beta
  project       = var.project_id
  api           = google_api_gateway_api.the_game_api.api_id
  api_config_id = "the-game-api-config-${random_id.api_config.hex}"

  openapi_documents {
    document {
      path     = "${path.module}/the-game-api.yml"
      contents = filebase64("${path.module}/the-game-api.yml")
    }
  }
  lifecycle {
    create_before_destroy = true
  }
}

resource "google_api_gateway_gateway" "the_game_api" {
  provider     = google-beta
  project      = var.project_id
  api_config   = google_api_gateway_api_config.the_game_api_cfg.id
  gateway_id   = "the-game-gateway"
  display_name = "the-game-gateway"
  region       = var.region
}

####################
# Networking
####################

data "google_compute_network" "default" {
  name = "default"
}

data "google_compute_subnetwork" "default" {
  name   = "default"
  region = var.region
}