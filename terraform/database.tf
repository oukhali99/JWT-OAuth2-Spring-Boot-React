# Security Group for RDS
resource "aws_security_group" "db" {
  name        = "${local.stack_name}-${var.environment}-db-security-group"
  description = "Security group for RDS instance"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "PostgreSQL access from backend"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.backend.id]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(
    local.common_tags,
    {
      Name = "${local.stack_name}-${var.environment}-db-security-group"
    }
  )
}

# DB Subnet Group
resource "aws_db_subnet_group" "main" {
  name       = "${local.stack_name}-${var.environment}-db-subnet-group"
  subnet_ids = aws_subnet.private[*].id

  tags = merge(
    local.common_tags,
    {
      Name = "${local.stack_name}-${var.environment}-db-subnet-group"
    }
  )
}

# RDS Parameter Group
resource "aws_db_parameter_group" "main" {
  name   = "${local.stack_name}-${var.environment}-postgres15"
  family = "postgres15"

  tags = local.common_tags
}

# RDS Instance
resource "aws_db_instance" "main" {
  identifier = "${local.stack_name}-${var.environment}-db"

  engine         = "postgres"
  engine_version = "15"
  instance_class = var.rds_instance_class

  allocated_storage     = var.allocated_storage
  storage_type          = "gp2"
  storage_encrypted      = true
  multi_az              = var.multi_az
  publicly_accessible   = false

  db_name  = var.database_name
  username = var.database_username
  password = random_password.db_password.result

  vpc_security_group_ids = [aws_security_group.db.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  parameter_group_name   = aws_db_parameter_group.main.name

  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "mon:04:00-mon:05:00"

  skip_final_snapshot       = true
  deletion_protection        = false
  final_snapshot_identifier  = "${local.stack_name}-${var.environment}-final-snapshot"

  tags = merge(
    local.common_tags,
    {
      Name = "${local.stack_name}-${var.environment}-db"
    }
  )
}
