terraform {
  backend "gcs" {
    bucket = "7c13ce29121023b9-bucket-tfstate"
    prefix = "terraform/state"
  }
}
