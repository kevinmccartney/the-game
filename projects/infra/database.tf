resource "google_firestore_database" "the_game_firestore" {
  project                     = var.project_id
  name                        = "(default)"
  location_id                 = "nam5"
  type                        = "FIRESTORE_NATIVE"
  concurrency_mode            = "PESSIMISTIC" # TODO: is this the right mode?
  app_engine_integration_mode = "DISABLED"
}