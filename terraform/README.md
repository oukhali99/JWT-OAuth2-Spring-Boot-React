# Terraform Infrastructure for JWT-OAuth2-Spring-Boot-React

This directory contains Terraform configuration files to provision AWS infrastructure for the JWT-OAuth2-Spring-Boot-React application.

## Architecture

The Terraform configuration creates:

- **VPC**: Virtual Private Cloud with public and private isolated subnets
- **RDS PostgreSQL**: Database instance in private subnets
- **Elastic Beanstalk**: Application and environment for the Spring Boot backend
- **Secrets Manager**: Secrets for database credentials and Google OAuth
- **IAM Roles**: Roles for Elastic Beanstalk, CodeBuild, and CodePipeline
- **CodePipeline**: CI/CD pipeline with CodeBuild projects for backend and frontend
- **S3**: Buckets for pipeline artifacts and frontend deployment (optional)

## Prerequisites

1. AWS CLI configured with appropriate credentials
2. Terraform >= 1.0 installed
3. Required AWS resources:
   - GitHub connection ARN for CodePipeline (created via AWS Console)
   - S3 bucket for frontend deployment (must exist before running Terraform)

## Variables

This project uses environment-specific variable files to easily switch between dev and prod deployments.

1. Copy the default variable files for each environment:
   ```bash
   cp terraform.tfvars.default terraform.tfvars.dev
   cp terraform.tfvars.default terraform.tfvars.prod
   ```

2. Edit the environment-specific files and fill in your actual values (replace all "changeme" placeholders):
   - `terraform.tfvars.dev` - For development environment
   - `terraform.tfvars.prod` - For production environment

   Example structure:
   ```hcl
   aws_region                = "us-east-1"
   environment               = "dev"  # or "prod"
   database_name             = "jwt_oauth2"
   database_username         = "admin"
   google_client_id          = "your-google-client-id"
   google_client_secret      = "your-google-client-secret"
   github_connection_arn     = "arn:aws:codestar-connections:region:account:connection/connection-id"
   spring_security_secret_key = "your-spring-security-secret-key"
   google_redirect_uri       = "https://your-frontend.com/auth/callback"
   frontend_url              = "https://your-frontend.com"
   s3_bucket_frontend        = "your-frontend-bucket-name"
   backend_url               = "http://your-backend-url.elasticbeanstalk.com"
   ```

   **Note:** `terraform.tfvars.dev` and `terraform.tfvars.prod` are in `.gitignore` to protect sensitive data. Only the `.default` files should be committed to version control.

## Usage

1. Copy and configure variables for each environment:
   ```bash
   cp terraform.tfvars.default terraform.tfvars.dev
   cp terraform.tfvars.default terraform.tfvars.prod
   # Edit terraform.tfvars.dev and terraform.tfvars.prod with your actual values
   ```

2. Initialize Terraform:
   ```bash
   terraform init
   ```

3. Deploy to an environment using the appropriate variable file:

   **For DEV environment:**
   ```bash
   terraform plan -var-file=terraform.tfvars.dev
   terraform apply -var-file=terraform.tfvars.dev
   ```

   **For PROD environment:**
   ```bash
   terraform plan -var-file=terraform.tfvars.prod
   terraform apply -var-file=terraform.tfvars.prod
   ```

4. Destroy the infrastructure (when needed):
   ```bash
   # For dev
   terraform destroy -var-file=terraform.tfvars.dev
   
   # For prod
   terraform destroy -var-file=terraform.tfvars.prod
   ```

## File Structure

- `main.tf` - Provider configuration and locals
- `variables.tf` - Input variables
- `terraform.tfvars.default` - environment variable template (safe to commit)
- `terraform.tfvars.dev` - Your DEV environment values (in .gitignore, do NOT commit)
- `terraform.tfvars.prod` - Your PROD environment values (in .gitignore, do NOT commit)
- `vpc.tf` - VPC and networking resources
- `database.tf` - RDS PostgreSQL instance
- `secrets.tf` - Secrets Manager resources
- `iam.tf` - IAM roles and policies
- `backend.tf` - Elastic Beanstalk resources
- `pipeline.tf` - CodePipeline and CodeBuild resources
- `outputs.tf` - Output values
- `.gitignore` - Git ignore patterns for Terraform files

## Notes

- The database password is automatically generated and stored in Secrets Manager
- The RDS instance is configured with `skip_final_snapshot = true` for easier cleanup
- The Elastic Beanstalk environment uses a single instance configuration
- Make sure to set appropriate values for sensitive variables
- **Frontend S3 Bucket**: The frontend S3 bucket must be created manually before running Terraform. Provide the bucket name in the `s3_bucket_frontend` variable.
