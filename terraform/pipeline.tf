# S3 Bucket for Artifacts
resource "aws_s3_bucket" "artifacts" {
  bucket        = "${lower(local.stack_name)}-${var.environment}-artifacts"
  force_destroy = true

  tags = local.common_tags
}

resource "aws_s3_bucket_public_access_block" "artifacts" {
  bucket = aws_s3_bucket.artifacts.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "artifacts" {
  bucket = aws_s3_bucket.artifacts.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "artifacts" {
  bucket = aws_s3_bucket.artifacts.id

  rule {
    id     = "delete-old-artifacts"
    status = "Enabled"

    expiration {
      days = 30
    }
  }
}

# Note: Frontend S3 bucket must be created manually before running Terraform
# The bucket name is specified in the s3_bucket_frontend variable

# CodeBuild Project for Backend
resource "aws_codebuild_project" "backend" {
  name          = "${local.stack_name}-${var.environment}"
  description   = "Build project for backend JAR"
  build_timeout = 60
  service_role  = aws_iam_role.codebuild.arn

  artifacts {
    type = "CODEPIPELINE"
  }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "aws/codebuild/standard:7.0"
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type  = "CODEBUILD"
    privileged_mode             = true

    environment_variable {
      name  = "JAVA_HOME"
      value = "/usr/lib/jvm/java-21-amazon-corretto"
    }
  }

  source {
    type      = "CODEPIPELINE"
    buildspec = <<-BUILDSPEC
      version: 0.2
      phases:
        install:
          commands:
            - mvn -B package --file pom.xml
      artifacts:
        base-directory: target
        files:
          - '*.jar'
    BUILDSPEC
  }

  tags = local.common_tags
}

# CodeBuild Project for Frontend
resource "aws_codebuild_project" "frontend" {
  name          = "${local.stack_name}-${var.environment}-frontend"
  description   = "Build project for frontend"
  build_timeout = 60
  service_role  = aws_iam_role.codebuild.arn

  artifacts {
    type = "CODEPIPELINE"
  }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "aws/codebuild/standard:7.0"
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"
    privileged_mode             = true

    environment_variable {
      name  = "VITE_GOOGLE_CLIENT_ID"
      value = var.google_client_id
    }

    environment_variable {
      name  = "VITE_GOOGLE_RESPONSE_TYPE"
      value = "code"
    }

    environment_variable {
      name  = "VITE_GOOGLE_SCOPE"
      value = "profile email"
    }

    environment_variable {
      name  = "VITE_BACKEND_URL"
      value = var.backend_url
    }

    environment_variable {
      name  = "VITE_GOOGLE_REDIRECT_URI"
      value = var.google_redirect_uri
    }
  }

  source {
    type      = "CODEPIPELINE"
    buildspec = <<-BUILDSPEC
      version: 0.2
      phases:
        install:
          commands:
            - cd src/frontend
            - npm install -g yarn
            - yarn --cwd src/frontend
        build:
          commands:
            - yarn --cwd src/frontend build
      artifacts:
        base-directory: src/frontend/dist
        files:
          - '**/*'
    BUILDSPEC
  }

  tags = local.common_tags
}

# CodePipeline
resource "aws_codepipeline" "main" {
  name     = "${local.stack_name}-${var.environment}-pipeline"
  role_arn = aws_iam_role.codepipeline.arn

  artifact_store {
    location = aws_s3_bucket.artifacts.bucket
    type     = "S3"
  }

  stage {
    name = "Source"

    action {
      name             = "GitHub_Source"
      category         = "Source"
      owner            = "AWS"
      provider         = "CodeStarSourceConnection"
      version          = "1"
      output_artifacts = ["source_output"]

      configuration = {
        ConnectionArn    = var.github_connection_arn
        FullRepositoryId = "${var.github_owner}/${var.github_repo}"
        BranchName       = var.github_branch
      }
    }
  }

  stage {
    name = "Build"

    action {
      name             = "Build-Backend"
      category         = "Build"
      owner            = "AWS"
      provider         = "CodeBuild"
      input_artifacts  = ["source_output"]
      output_artifacts = ["build_backend_output"]
      version          = "1"

      configuration = {
        ProjectName = aws_codebuild_project.backend.name
      }
    }

    action {
      name             = "Build-Frontend"
      category         = "Build"
      owner            = "AWS"
      provider         = "CodeBuild"
      input_artifacts  = ["source_output"]
      output_artifacts = ["build_frontend_output"]
      version          = "1"

      configuration = {
        ProjectName = aws_codebuild_project.frontend.name
      }
    }
  }

  stage {
    name = "Deploy"

    action {
      name            = "Deploy-Backend"
      category        = "Deploy"
      owner           = "AWS"
      provider        = "ElasticBeanstalk"
      input_artifacts = ["build_backend_output"]
      version         = "1"

      configuration = {
        ApplicationName = aws_elastic_beanstalk_application.main.name
        EnvironmentName = aws_elastic_beanstalk_environment.main.name
      }
    }

    action {
      name            = "Deploy-Frontend"
      category        = "Deploy"
      owner           = "AWS"
      provider        = "S3"
      input_artifacts = ["build_frontend_output"]
      version         = "1"

      configuration = {
        BucketName = var.s3_bucket_frontend
        Extract    = "true"
      }
    }
  }

  tags = local.common_tags
}
