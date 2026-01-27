output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "vpc_cidr" {
  description = "CIDR block of the VPC"
  value       = aws_vpc.main.cidr_block
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = aws_subnet.private[*].id
}

output "database_endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.main.address
}

output "database_port" {
  description = "RDS instance port"
  value       = aws_db_instance.main.port
}

output "database_name" {
  description = "Database name"
  value       = aws_db_instance.main.db_name
}

output "db_credentials_secret_arn" {
  description = "ARN of the database credentials secret"
  value       = aws_secretsmanager_secret.db_credentials.arn
}

output "google_secret_arn" {
  description = "ARN of the Google OAuth secret"
  value       = aws_secretsmanager_secret.google.arn
}

output "elastic_beanstalk_application_name" {
  description = "Name of the Elastic Beanstalk application"
  value       = aws_elastic_beanstalk_application.main.name
}

output "elastic_beanstalk_environment_name" {
  description = "Name of the Elastic Beanstalk environment"
  value       = aws_elastic_beanstalk_environment.main.name
}

output "elastic_beanstalk_url" {
  description = "Elastic Beanstalk Environment URL"
  value       = "http://${aws_elastic_beanstalk_environment.main.endpoint_url}"
}

output "backend_security_group_id" {
  description = "ID of the backend security group"
  value       = aws_security_group.backend.id
}

output "db_security_group_id" {
  description = "ID of the database security group"
  value       = aws_security_group.db.id
}

output "artifacts_bucket_name" {
  description = "Name of the S3 bucket for artifacts"
  value       = aws_s3_bucket.artifacts.bucket
}

output "codepipeline_name" {
  description = "Name of the CodePipeline"
  value       = aws_codepipeline.main.name
}

output "codebuild_backend_project_name" {
  description = "Name of the backend CodeBuild project"
  value       = aws_codebuild_project.backend.name
}

output "codebuild_frontend_project_name" {
  description = "Name of the frontend CodeBuild project"
  value       = aws_codebuild_project.frontend.name
}

output "frontend_bucket_name" {
  description = "Name of the frontend S3 bucket (must be created manually)"
  value       = var.s3_bucket_frontend
}
