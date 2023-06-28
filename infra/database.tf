resource "google_firestore_database" "the_game_firestore" {
  project                     = var.project_id
  name                        = "(default)"
  location_id                 = "nam5"
  type                        = "DATASTORE_MODE"
  concurrency_mode            = "OPTIMISTIC"
  app_engine_integration_mode = "DISABLED"
}