# the-game

## GCP Setup

- Create a the project (in our case "The Game")
- Run `terrraform init && terraform apply` locally to create the Terraform state bucket on commit [f0934af](https://github.com/kevinmccartney/the-game/commit/f0934af65173ef19815850bab9aac7ea655dfb02)
- Run `terraform init` locally after setting up the backend on commit [c3df2dd](https://github.com/kevinmccartney/the-game/commit/c3df2dd0ed11970709ca842a56e6cd3513769422) to set up the GCP GCS bucket Terraform state backend
- Create a service account called `github-cicd` in the `The Game` project with the `Editor` role.
- Create a JSON service account key for `github-cicd`
- Create a new actions secret called `GOOGLE_CREDENTIALS` that contains the service account credentials
  - Make sure the json string is all on one line (no newlines)
- Create a new actions secret called `GCP_REGION` that contains the GCP region
- Create a new actions secret called `GCP_PROJECT` that contains the GCP project ID
- Before building the web host GCS buckets, make sure to verify the domain & add the service account email on the [Webmaster Central](https://www.google.com/webmasters/verification/home?hl=en)
- Your service account will need the Storage Admin (roles/storage.admin) role on "The Game" project to update the IAM policy on the bucket
- Set up DNS in your project that contains DNS (not in scope for now). Add a CNAME record as follows

| DNS Name                | Resource Record Type | TTL                     | Cannonical Name           |
| ----------------------- | -------------------- | ----------------------- | ------------------------- |
| the-game.{your-domain}. | CNAME                | 300 seconds (5 minutes) | c.storage.googleapis.com. |

# Reference

- [Using GitHub Actions with Terraform on GCP](https://jozimarback.medium.com/using-github-actions-with-terraform-on-gcp-d473a37ddbd6)
- [Automating Terraform Deployment to Google Cloud with GitHub Actions](https://medium.com/interleap/automating-terraform-deployment-to-google-cloud-with-github-actions-17516c4fb2e5)
- [`setup-gcloud` GitHub Action](https://github.com/google-github-actions/setup-gcloud)
- [Setup Node.js environment](https://github.com/marketplace/actions/setup-node-js-environment)
- [Super fast npm install on Github Actions](https://www.voorhoede.nl/en/blog/super-fast-npm-install-on-github-actions/)
