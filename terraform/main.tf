terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.18.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }
  required_version = ">= 1.0"
}

provider "aws" {
  region = var.aws_region
}

locals {
  stack_name = "jwt-oauth2-${var.environment}"
  common_tags = {
    Environment = var.environment
    Project     = "JWT-OAuth2-Spring-Boot-React"
    ManagedBy   = "Terraform"
  }
}
