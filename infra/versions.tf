terraform {
  required_version = ">= 1.4.6"

  required_providers {
    google = {
      // version 4.31.0 removed because of issue https://github.com/hashicorp/terraform-provider-google/issues/12226
      source  = "hashicorp/google"
      version = ">= 4.67.0, != 4.31.0"
    }

    google-beta = {
      // version 4.31.0 removed because of issue https://github.com/hashicorp/terraform-provider-google/issues/12226
      source  = "hashicorp/google-beta"
      version = ">= 4.67.0, != 4.31.0"
    }
    random = {
      source = "hashicorp/random"
      version = ">= 3.5.1"
    }
  }
}
