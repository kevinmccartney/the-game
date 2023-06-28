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
- Make sure the Service Usage & Cloud Resource Manager services are enabled
  - `gcloud services enable serviceusage.googleapis.com cloudresourcemanager.googleapis.com --project {project_id}`
  - _This will allow you to export infrastructure created in the GCP console & imported into Terraform state if you get stuck_
- Make sure you create the LB before the cert
  - [Relevant SO answer](https://stackoverflow.com/a/66578266)
- Create domain DNS A record in your project that contains DNS (not in scope for now) pointed to the LB frontend IP

| DNS Name                | Resource Record Type | TTL                     | IPv4 Address          |
| ----------------------- | -------------------- | ----------------------- | --------------------- |
| the-game.{your-domain}. | A                    | 300 seconds (5 minutes) | {your-lb-frontend-ip} |

- Set up Oauth consent screen

# Reference

- [Using GitHub Actions with Terraform on GCP](https://jozimarback.medium.com/using-github-actions-with-terraform-on-gcp-d473a37ddbd6)
- [Automating Terraform Deployment to Google Cloud with GitHub Actions](https://medium.com/interleap/automating-terraform-deployment-to-google-cloud-with-github-actions-17516c4fb2e5)
- [`setup-gcloud` GitHub Action](https://github.com/google-github-actions/setup-gcloud)
- [Setup Node.js environment](https://github.com/marketplace/actions/setup-node-js-environment)
- [Super fast npm install on Github Actions](https://www.voorhoede.nl/en/blog/super-fast-npm-install-on-github-actions/)
- [Host a Static Website in Google Cloud with Cloud Storage](https://codelabs.developers.google.com/codelabs/cloud-webapp-hosting-gcs#0)
- [How to upload files to Google Cloud Storage (GCS) Bucket](https://sametkaradag.medium.com/how-to-upload-files-to-google-cloud-storage-gcs-bucket-70f9599a01e5)
- [Setting up SSL for Google Cloud Storage static website?](https://stackoverflow.com/questions/22759710/setting-up-ssl-for-google-cloud-storage-static-website)
- [Use Google-managed SSL certificates](https://cloud.google.com/load-balancing/docs/ssl-certificates/google-managed-certs)
- [Can I automatically enable APIs when using GCP cloud with terraform?](https://stackoverflow.com/a/72094901)
- [Solving HTTP 404 for GCP Storage Bucket Hosted Single Page Web App](https://thepaulo.medium.com/solving-http-404-for-gcp-storage-bucket-hosted-single-page-web-app-140b15316cde)
- [Allow Users to Set HTTP Response Status ](https://issuetracker.google.com/issues/151212194)
- [Install Tailwind CSS with Create React App](https://tailwindcss.com/docs/guides/create-react-app)
- [<Link href="/link" /> forwards to "/link.txt"](https://github.com/vercel/next.js/issues/48996)
- [An example Github Actions for Python + Pipenv + Postgres + Pyright](https://gist.github.com/alukach/6f3a371e9af600e417aca1b36806ad72)
- [Static website examples and tips](https://cloud.google.com/storage/docs/static-website)
- [Signing in users with Google](https://cloud.google.com/identity-platform/docs/web/google)
- [Protected Routes In Next.Js](https://danishshakeel.me/protected-routes-in-nextjs/)
- [🐛 [Storage] A required service account is missing necessary permissions.](https://github.com/firebase/flutterfire/issues/9588#issuecomment-1255055456)
- [Addressing your API use cases: Choosing between Apigee, API Gateway, and Cloud Endpoints](https://cloud.google.com/blog/products/application-modernization/choosing-between-apigee-api-gateway-and-cloud-endpoints)
- [Your Google Cloud database options, explained](https://cloud.google.com/blog/topics/developers-practitioners/your-google-cloud-database-options-explained)
