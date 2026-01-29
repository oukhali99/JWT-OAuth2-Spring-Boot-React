# Random password for database (if not using generated secret)
resource "random_password" "db_password" {
  length  = 32
  special = true
}

# Database credentials secret
resource "aws_secretsmanager_secret" "db_credentials" {
  name                    = "${local.stack_name}-${var.environment}-db-credentials2"
  description             = "Database credentials for ${local.stack_name}"
  recovery_window_in_days = 0  # Allow immediate deletion

  tags = local.common_tags
}

resource "aws_secretsmanager_secret_version" "db_credentials" {
  secret_id = aws_secretsmanager_secret.db_credentials.id
  secret_string = jsonencode({
    username = var.database_username
    password = random_password.db_password.result
  })
}

# Google OAuth secret
resource "aws_secretsmanager_secret" "google" {
  name                    = "${local.stack_name}-${var.environment}-google2"
  description             = "Google OAuth credentials for ${local.stack_name}"
  recovery_window_in_days = 0  # Allow immediate deletion

  tags = local.common_tags
}

resource "aws_secretsmanager_secret_version" "google" {
  secret_id = aws_secretsmanager_secret.google.id
  secret_string = jsonencode({
    clientSecret = var.google_client_secret
  })
}
