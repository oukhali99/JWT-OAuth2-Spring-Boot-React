# Security Group for Backend (Elastic Beanstalk)
resource "aws_security_group" "backend" {
  name        = "${local.stack_name}-${var.environment}-backend-security-group"
  description = "Security group for ECS tasks"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "Allow HTTP access"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
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
      Name = "${local.stack_name}-${var.environment}-backend-security-group"
    }
  )
}

# Elastic Beanstalk Application
resource "aws_elastic_beanstalk_application" "main" {
  name        = "${local.stack_name}-${var.environment}"
  description = "JWT OAuth2 Spring Boot React Application"

  tags = local.common_tags
}

# Elastic Beanstalk Environment
resource "aws_elastic_beanstalk_environment" "main" {
  name                = "${local.stack_name}-${var.environment}-env"
  application         = aws_elastic_beanstalk_application.main.name
  solution_stack_name = "64bit Amazon Linux 2023 v4.5.1 running Corretto 21"

  setting {
    namespace = "aws:ec2:vpc"
    name      = "VPCId"
    value     = aws_vpc.main.id
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "Subnets"
    value     = join(",", aws_subnet.public[*].id)
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "AssociatePublicIpAddress"
    value     = "true"
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "EnvironmentType"
    value     = "SingleInstance"
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "PORT"
    value     = "8080"
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "POSTGRES_HOST"
    value     = aws_db_instance.main.address
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "POSTGRES_USER"
    value     = var.database_username
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "AWS_DB_SECRET_ARN"
    value     = aws_secretsmanager_secret.db_credentials.arn
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "POSTGRES_PORT"
    value     = "5432"
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "POSTGRES_DB"
    value     = var.database_name
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "SPRING_SECURITY_SECRET_KEY"
    value     = var.spring_security_secret_key
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "AWS_SECRET_GOOGLE_CLIENT_SECRET_ARN"
    value     = aws_secretsmanager_secret.google.arn
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "GOOGLE_REDIRECT_URI"
    value     = var.google_redirect_uri
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "GOOGLE_CLIENT_ID"
    value     = var.google_client_id
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "FRONTEND_URL"
    value     = var.frontend_url
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "AWS_REGION"
    value     = var.aws_region
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = aws_iam_instance_profile.elastic_beanstalk.name
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "SecurityGroups"
    value     = aws_security_group.backend.id
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "DisableDefaultEC2SecurityGroup"
    value     = "true"
  }

  setting {
    namespace = "aws:ec2:instances"
    name      = "InstanceTypes"
    value     = var.eb_instance_type
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "JAVA_OPTS"
    value     = "-Xms256m -Xmx512m"
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "JVM_OPTIONS"
    value     = "-Xms256m -Xmx512m"
  }

  tags = local.common_tags
}
