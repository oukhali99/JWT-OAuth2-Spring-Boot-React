variable "aws_region" {
  description = "The AWS region to deploy the infrastructure"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
}

variable "database_name" {
  description = "Name of the PostgreSQL database"
  type        = string
}

variable "database_username" {
  description = "Username for the PostgreSQL database"
  type        = string
}

variable "google_client_id" {
  description = "Google OAuth2 Client ID"
  type        = string
  sensitive   = true
}

variable "google_client_secret" {
  description = "Google OAuth2 Client Secret"
  type        = string
  sensitive   = true
}

variable "github_connection_arn" {
  description = "ARN of the GitHub connection for CodePipeline"
  type        = string
}

variable "spring_security_secret_key" {
  description = "Secret key for Spring Security"
  type        = string
  sensitive   = true
}

variable "google_redirect_uri" {
  description = "Google OAuth2 redirect URI"
  type        = string
}

variable "frontend_url" {
  description = "Frontend application URL"
  type        = string
}

variable "s3_bucket_frontend" {
  description = "S3 bucket name for frontend deployment"
  type        = string
}

variable "backend_url" {
  description = "Backend application URL"
  type        = string
}

variable "max_azs" {
  description = "Maximum number of availability zones"
  type        = number
  default     = 2
}

variable "allocated_storage" {
  description = "Allocated storage for RDS instance in GB"
  type        = number
  default     = 20
}

variable "multi_az" {
  description = "Enable Multi-AZ deployment for RDS"
  type        = bool
  default     = false
}

variable "rds_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "eb_instance_type" {
  description = "Elastic Beanstalk instance type"
  type        = string
  default     = "t3.nano"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "172.30.0.0/16"
}

variable "github_owner" {
  description = "GitHub repository owner"
  type        = string
  default     = "oukhali99"
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
  default     = "JWT-OAuth2-Spring-Boot-React"
}

variable "github_branch" {
  description = "GitHub branch to deploy"
  type        = string
  default     = "main"
}
