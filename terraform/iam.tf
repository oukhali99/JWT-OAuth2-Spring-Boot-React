# IAM Role for Elastic Beanstalk
resource "aws_iam_role" "elastic_beanstalk" {
  name = "${local.stack_name}-elasticbeanstalk-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = local.common_tags
}

# Attach managed policies
resource "aws_iam_role_policy_attachment" "elastic_beanstalk_worker" {
  role       = aws_iam_role.elastic_beanstalk.name
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkWorkerTier"
}

resource "aws_iam_role_policy_attachment" "elastic_beanstalk_cloudwatch" {
  role       = aws_iam_role.elastic_beanstalk.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
}

# Custom policy for Secrets Manager and SSM access
resource "aws_iam_role_policy" "elastic_beanstalk_secrets" {
  name = "${local.stack_name}-secrets-access"
  role = aws_iam_role.elastic_beanstalk.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "ssm:GetParameter"
        ]
        Resource = [
          aws_secretsmanager_secret.db_credentials.arn,
          aws_secretsmanager_secret.google.arn
        ]
      }
    ]
  })
}

# Instance Profile for Elastic Beanstalk
resource "aws_iam_instance_profile" "elastic_beanstalk" {
  name = "${local.stack_name}-elasticbeanstalk-profile"
  role = aws_iam_role.elastic_beanstalk.name

  tags = local.common_tags
}

# IAM Role for CodeBuild
resource "aws_iam_role" "codebuild" {
  name = "${local.stack_name}-codebuild-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "codebuild.amazonaws.com"
        }
      }
    ]
  })

  tags = local.common_tags
}

# CodeBuild policy
resource "aws_iam_role_policy" "codebuild" {
  name = "${local.stack_name}-codebuild-policy"
  role = aws_iam_role.codebuild.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "s3:GetObject",
          "s3:PutObject",
          "s3:GetObjectVersion"
        ]
        Resource = [
          "${aws_s3_bucket.artifacts.arn}/*",
          "arn:aws:logs:${var.aws_region}:*:*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "s3:ListBucket"
        ]
        Resource = aws_s3_bucket.artifacts.arn
      }
    ]
  })
}

# IAM Role for CodePipeline
resource "aws_iam_role" "codepipeline" {
  name = "${local.stack_name}-codepipeline-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "codepipeline.amazonaws.com"
        }
      }
    ]
  })

  tags = local.common_tags
}

# CodePipeline policy
resource "aws_iam_role_policy" "codepipeline" {
  name = "${local.stack_name}-codepipeline-policy"
  role = aws_iam_role.codepipeline.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:GetObjectVersion",
          "s3:PutObject"
        ]
        Resource = [
          "${aws_s3_bucket.artifacts.arn}/*",
          "arn:aws:s3:::${var.s3_bucket_frontend}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.artifacts.arn,
          "arn:aws:s3:::${var.s3_bucket_frontend}"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "codebuild:BatchGetBuilds",
          "codebuild:StartBuild",
          "codestar-connections:UseConnection"
        ]
        Resource = [
          aws_codebuild_project.backend.arn,
          aws_codebuild_project.frontend.arn,
          var.github_connection_arn
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "elasticbeanstalk:*",
          "ec2:*",
          "elasticloadbalancing:*",
          "autoscaling:*",
          "cloudwatch:*",
          "s3:*",
          "sns:*",
          "cloudformation:*",
          "rds:*",
          "sqs:*",
          "ecs:*"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "iam:PassRole"
        ]
        Resource = "*"
        Condition = {
          StringEqualsIfExists = {
            "iam:PassedToService" = [
              "cloudformation.amazonaws.com",
              "elasticbeanstalk.amazonaws.com",
              "ec2.amazonaws.com",
              "ecs-tasks.amazonaws.com"
            ]
          }
        }
      }
    ]
  })
}
