import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as elasticbeanstalk from 'aws-cdk-lib/aws-elasticbeanstalk';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export class AwsCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Parameters
    const environment = process.env.ENVIRONMENT;
    if (!environment) throw new Error('ENVIRONMENT is not set');

    const databaseName = process.env.DATABASE_NAME;
    if (!databaseName) throw new Error('DATABASE_NAME is not set');

    const databaseUsername = process.env.DATABASE_USERNAME;
    if (!databaseUsername) throw new Error('DATABASE_USERNAME is not set');

    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    if (!googleClientId) throw new Error('GOOGLE_CLIENT_ID is not set');

    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!googleClientSecret) throw new Error('GOOGLE_CLIENT_SECRET is not set');

    const googleRedirectUri = process.env.GOOGLE_REDIRECT_URI;
    if (!googleRedirectUri) throw new Error('GOOGLE_REDIRECT_URI is not set');

    const frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl) throw new Error('FRONTEND_URL is not set');

    const githubConnectionArn = process.env.GITHUB_CONNECTION_ARN;
    if (!githubConnectionArn) throw new Error('GITHUB_CONNECTION_ARN is not set');

    const s3BucketFrontend = process.env.S3_BUCKET_FRONTEND;
    if (!s3BucketFrontend) throw new Error('S3_BUCKET_FRONTEND is not set');

    const springSecuritySecretKey = process.env.SPRING_SECURITY_SECRET_KEY;
    if (!springSecuritySecretKey) throw new Error('SPRING_SECURITY_SECRET_KEY is not set');

    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) throw new Error('BACKEND_URL is not set');

    const dbCredentials = rds.Credentials.fromGeneratedSecret(databaseUsername, {
      secretName: `${this.stackName}-${environment}-db-credentials`
    });

    // VPC and Network Configuration
    const vpc = new ec2.Vpc(this, 'VPC', {
      vpcName: `${this.stackName}-${environment}-vpc`,
      ipAddresses: ec2.IpAddresses.cidr('172.30.0.0/16'),
      maxAzs: 3,
      subnetConfiguration: [
        {
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24
        },
        {
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 24
        }
      ]
    });

    // RDS Instance
    const dbSecurityGroup = new ec2.SecurityGroup(this, 'DBSecurityGroup', {
      vpc,
      description: 'Security group for RDS instance',
      securityGroupName: `${this.stackName}-${environment}-db-security-group`
    });

    const backendSecurityGroup = new ec2.SecurityGroup(this, 'BackendSecurityGroup', {
      vpc,
      description: 'Security group for ECS tasks',
      securityGroupName: `${this.stackName}-${environment}-backend-security-group`
    });

    dbSecurityGroup.addIngressRule(
      backendSecurityGroup,
      ec2.Port.tcp(5432),
      'Allow PostgreSQL access from backend'
    );

    backendSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'Allow HTTP access'
    );

    const dbInstance = new rds.DatabaseInstance(this, 'DBInstance', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_15
      }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED
      },
      securityGroups: [dbSecurityGroup],
      databaseName: databaseName,
      credentials: dbCredentials,
      allocatedStorage: 20,
      storageType: rds.StorageType.GP2,
      multiAz: false,
      publiclyAccessible: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    // Elastic Beanstalk Application
    const elasticBeanstalkApp = new elasticbeanstalk.CfnApplication(this, 'ElasticBeanstalkApplication', {
      applicationName: `${this.stackName}-${environment}`,
      description: 'JWT OAuth2 Spring Boot React Application'
    });

    // IAM Role for Elastic Beanstalk
    const elasticBeanstalkRole = new iam.Role(this, 'ElasticBeanstalkRole', {
      roleName: `${this.stackName}-${environment}-elasticbeanstalk-role`,
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkWorkerTier'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLogsFullAccess')
      ]
    });

    const elasticBeanstalkInstanceProfile = new iam.CfnInstanceProfile(this, 'ElasticBeanstalkInstanceProfile', {
      path: '/',
      roles: [elasticBeanstalkRole.roleName]
    });

    // Elastic Beanstalk Environment
    const elasticBeanstalkEnv = new elasticbeanstalk.CfnEnvironment(this, 'ElasticBeanstalkEnvironment', {
      applicationName: elasticBeanstalkApp.applicationName!,
      environmentName: `${this.stackName}-${environment}-env`,
      solutionStackName: '64bit Amazon Linux 2023 v4.5.1 running Corretto 21',
      optionSettings: [
        {
          namespace: 'aws:ec2:vpc',
          optionName: 'VPCId',
          value: vpc.vpcId
        },
        {
          namespace: 'aws:ec2:vpc',
          optionName: 'Subnets',
          value: vpc.publicSubnets.map(subnet => subnet.subnetId).join(',')
        },
        {
          namespace: 'aws:ec2:vpc',
          optionName: 'AssociatePublicIpAddress',
          value: 'true'
        },
        {
          namespace: 'aws:elasticbeanstalk:environment',
          optionName: 'EnvironmentType',
          value: 'SingleInstance'
        },
        {
          namespace: 'aws:elasticbeanstalk:application:environment',
          optionName: 'PORT',
          value: '8080'
        },
        {
          namespace: 'aws:elasticbeanstalk:application:environment',
          optionName: 'POSTGRES_HOST',
          value: dbInstance.dbInstanceEndpointAddress
        },
        {
          namespace: 'aws:elasticbeanstalk:application:environment',
          optionName: 'POSTGRES_USER',
          value: databaseUsername
        },
        {
          namespace: 'aws:elasticbeanstalk:application:environment',
          optionName: 'POSTGRES_PASSWORD',
          value: dbCredentials.secret?.secretValueFromJson('password').unsafeUnwrap()

        },
        {
          namespace: 'aws:elasticbeanstalk:application:environment',
          optionName: 'POSTGRES_DB',
          value: databaseName
        },
        {
          namespace: 'aws:elasticbeanstalk:application:environment',
          optionName: 'SPRING_SECURITY_SECRET_KEY',
          value: springSecuritySecretKey
        },
        {
          namespace: 'aws:elasticbeanstalk:application:environment',
          optionName: 'GOOGLE_CLIENT_ID',
          value: googleClientId
        },
        {
          namespace: 'aws:elasticbeanstalk:application:environment',
          optionName: 'GOOGLE_CLIENT_SECRET',
          value: googleClientSecret
        },
        {
          namespace: 'aws:elasticbeanstalk:application:environment',
          optionName: 'GOOGLE_REDIRECT_URI',
          value: googleRedirectUri
        },
        {
          namespace: 'aws:elasticbeanstalk:application:environment',
          optionName: 'FRONTEND_URL',
          value: frontendUrl
        },
        {
          namespace: 'aws:autoscaling:launchconfiguration',
          optionName: 'IamInstanceProfile',
          value: elasticBeanstalkInstanceProfile.ref
        },
        {
          namespace: 'aws:autoscaling:launchconfiguration',
          optionName: 'SecurityGroups',
          value: backendSecurityGroup.securityGroupId
        },
        {
          namespace: 'aws:autoscaling:launchconfiguration',
          optionName: 'DisableDefaultEC2SecurityGroup',
          value: 'true'
        },
        {
          namespace: 'aws:ec2:instances',
          optionName: 'InstanceTypes',
          value: 't3.nano'
        },
        {
          namespace: 'aws:elasticbeanstalk:application:environment',
          optionName: 'JAVA_OPTS',
          value: '-Xms256m -Xmx512m'
        },
        {
          namespace: 'aws:elasticbeanstalk:application:environment',
          optionName: 'JVM_OPTIONS',
          value: '-Xms256m -Xmx512m'
        }
      ]
    });

    // S3 Bucket for Artifacts
    const artifactsBucket = new s3.Bucket(this, 'ArtifactsBucket', {
      bucketName: `${this.stackName.toLowerCase()}-${environment}-artifacts`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
    });

    const buildSpecBackend = codebuild.BuildSpec.fromObject({
      version: '0.2',
      phases: {
        install: {
          commands: [
            'mvn -B package --file pom.xml'
          ]
        }
      },
      artifacts: {
        'base-directory': 'target',
        files: ['*.jar']
      }
    });
    const codeBuildProjectBackend = new codebuild.Project(this, 'CodeBuildProject', {
      projectName: `${this.stackName}-${environment}`,
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
        privileged: true,
        computeType: codebuild.ComputeType.SMALL
      },
      artifacts: codebuild.Artifacts.s3({
        bucket: artifactsBucket,
        name: 'artifacts.zip',
        includeBuildId: true,
        packageZip: true
      }),
      buildSpec: buildSpecBackend
    });

    const buildSpecFrontend = codebuild.BuildSpec.fromObject({
      version: '0.2',
      phases: {
        install: {
          commands: [
            'cd src/frontend',
            'npm install -g yarn',
            'yarn --cwd src/frontend'
          ]
        },
        build: {
          commands: [
            'yarn --cwd src/frontend build'
          ]
        }
      },
      artifacts: {
        'base-directory': 'src/frontend/dist',
        files: ['**/*']
      }
    });
    const codeBuildProjectFrontend = new codebuild.Project(this, 'CodeBuildProjectFrontend', {
      projectName: `${this.stackName}-${environment}-frontend`,
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
        privileged: true,
        computeType: codebuild.ComputeType.SMALL,
        environmentVariables: {
          VITE_GOOGLE_CLIENT_ID: {
            value: googleClientId
          },
          VITE_GOOGLE_RESPONSE_TYPE: {
            value: 'code'
          },
          VITE_GOOGLE_SCOPE: {
            value: 'profile email'
          },
          VITE_BACKEND_URL: {
            value: backendUrl
          },
          VITE_GOOGLE_REDIRECT_URI: {
            value: googleRedirectUri
          }
        }
      },
      buildSpec: buildSpecFrontend
    });
    

    // Grant CodeBuild access to S3 bucket
    artifactsBucket.grantReadWrite(codeBuildProjectBackend);

    // CodePipeline
    const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      pipelineName: `${this.stackName}-${environment}-pipeline`,
      artifactBucket: artifactsBucket
    });

    // Source Stage
    const sourceOutput = new codepipeline.Artifact();
    const sourceAction = new codepipeline_actions.CodeStarConnectionsSourceAction({
      actionName: 'GitHub_Source',
      owner: 'oukhali99',
      repo: 'JWT-OAuth2-Spring-Boot-React',
      branch: 'main',
      connectionArn: githubConnectionArn,
      output: sourceOutput
    });

    // Build Stage
    const buildBackendOutput = new codepipeline.Artifact();
    const buildBackendAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'Build-Backend',
      project: codeBuildProjectBackend,
      input: sourceOutput,
      outputs: [buildBackendOutput]
    });

    const buildFrontendOutput = new codepipeline.Artifact();
    const buildFrontendAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'Build-Frontend',
      project: codeBuildProjectFrontend,
      input: sourceOutput,
      outputs: [buildFrontendOutput]
    });

    // Deploy Stage
    const deployBackendAction = new codepipeline_actions.ElasticBeanstalkDeployAction({
      actionName: 'Deploy-Backend',
      applicationName: elasticBeanstalkApp.applicationName!,
      environmentName: elasticBeanstalkEnv.environmentName!,
      input: buildBackendOutput
    });

    const deployFrontendAction = new codepipeline_actions.S3DeployAction({
      actionName: 'Deploy-Frontend',
      bucket: s3.Bucket.fromBucketName(this, 'FrontendBucket', s3BucketFrontend),
      input: buildFrontendOutput
    });

    // Add stages to pipeline
    pipeline.addStage({
      stageName: 'Source',
      actions: [sourceAction]
    });

    pipeline.addStage({
      stageName: 'Build',
      actions: [buildBackendAction, buildFrontendAction]
    });

    pipeline.addStage({
      stageName: 'Deploy',
      actions: [deployBackendAction, deployFrontendAction]
    });

    // Outputs
    new cdk.CfnOutput(this, 'ElasticBeanstalkUrl', {
      value: `http://${elasticBeanstalkEnv.attrEndpointUrl}`,
      description: 'Elastic Beanstalk Environment URL'
    });
  }
}
