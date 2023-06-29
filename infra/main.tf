# Stuff I haven't done
# - Firewalls
# - Project itself
# - Logging sink
# - firebase SAs (googlee-provided) roles
# - Firebase stuff in general
# - Ttighten up SAs in general
# - Google Identity provider
# - OAuth 2.0 Client ID
# - Enable Identity Toolkit API
# - SA for cloud functions

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
