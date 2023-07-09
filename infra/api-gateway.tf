locals {
  api_config_base64 = filebase64("${path.module}/the-game-api.yml")
}

resource "random_id" "api_config" {
  byte_length = 4 # TODO: does this need a dependency to manage regeneration?

  keepers = {
    # Generate a new id each time we switch to a new AMI id
    config_base64 = local.api_config_base64
  }
}

resource "google_api_gateway_api" "the_game_api" {
  # tesing formatting
  provider     = google-beta
  project      = var.project_id
  api_id       = "the-game-api"
  display_name = "the-game-api"
}

resource "google_api_gateway_api_config" "the_game_api_cfg" {
  # TODO: Create service account for gw (?)
  provider      = google-beta
  project       = var.project_id
  api           = google_api_gateway_api.the_game_api.api_id
  api_config_id = "the-game-api-config-${random_id.api_config.hex}"

  openapi_documents {
    document {
      path     = "${path.module}/the-game-api.yml"
      contents = local.api_config_base64
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
