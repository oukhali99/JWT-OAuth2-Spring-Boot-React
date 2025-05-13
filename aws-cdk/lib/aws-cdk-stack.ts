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

export class AwsCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Parameters
    const environment = new cdk.CfnParameter(this, 'Environment', {
      type: 'String',
      default: 'dev',
      allowedValues: ['dev', 'prod'],
      description: 'Environment name'
    });

    const databaseName = new cdk.CfnParameter(this, 'DatabaseName', {
      type: 'String',
      default: 'oauth2db',
      description: 'Name of the database'
    });

    const databaseUsername = new cdk.CfnParameter(this, 'DatabaseUsername', {
      type: 'String',
      default: 'postgres',
      description: 'Database admin username'
    });

    const databasePassword = new cdk.CfnParameter(this, 'DatabasePassword', {
      type: 'String',
      noEcho: true,
      description: 'Database admin password',
      minLength: 8
    });

    const googleClientId = new cdk.CfnParameter(this, 'GoogleClientId', {
      type: 'String',
      description: 'Google OAuth2 Client ID'
    });

    const googleClientSecret = new cdk.CfnParameter(this, 'GoogleClientSecret', {
      type: 'String',
      noEcho: true,
      description: 'Google OAuth2 Client Secret'
    });

    const googleRedirectUri = new cdk.CfnParameter(this, 'GoogleRedirectUri', {
      type: 'String',
      description: 'Google OAuth2 Redirect URI'
    });

    const springSecuritySecretKey = new cdk.CfnParameter(this, 'SpringSecuritySecretKey', {
      type: 'String',
      noEcho: true,
      description: 'Spring Security Secret Key'
    });

    const frontendUrl = new cdk.CfnParameter(this, 'FrontendUrl', {
      type: 'String',
      description: 'Frontend URL'
    });

    const githubConnectionArn = new cdk.CfnParameter(this, 'GitHubConnectionArn', {
      type: 'String',
      description: 'GitHub Connection ARN'
    });

    const s3BucketFrontend = new cdk.CfnParameter(this, 'S3BucketFrontend', {
      type: 'String',
      description: 'S3 Bucket Frontend Name'
    });

    // VPC and Network Configuration
    const vpc = new ec2.Vpc(this, 'VPC', {
      vpcName: `${this.stackName}-${environment.valueAsString}-vpc`,
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
      securityGroupName: `${this.stackName}-${environment.valueAsString}-db-security-group`
    });

    const backendSecurityGroup = new ec2.SecurityGroup(this, 'BackendSecurityGroup', {
      vpc,
      description: 'Security group for ECS tasks',
      securityGroupName: `${this.stackName}-${environment.valueAsString}-backend-security-group`
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
      databaseName: databaseName.valueAsString,
      credentials: rds.Credentials.fromGeneratedSecret(databaseUsername.valueAsString, {
        secretName: `${this.stackName}-${environment.valueAsString}-db-credentials`
      }),
      allocatedStorage: 20,
      storageType: rds.StorageType.GP2,
      multiAz: false,
      publiclyAccessible: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    // Elastic Beanstalk Application
    const elasticBeanstalkApp = new elasticbeanstalk.CfnApplication(this, 'ElasticBeanstalkApplication', {
      applicationName: `${this.stackName}-${environment.valueAsString}`,
      description: 'JWT OAuth2 Spring Boot React Application'
    });

    // IAM Role for Elastic Beanstalk
    const elasticBeanstalkRole = new iam.Role(this, 'ElasticBeanstalkRole', {
      roleName: `${this.stackName}-${environment.valueAsString}-elasticbeanstalk-role`,
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
      environmentName: `${this.stackName}-${environment.valueAsString}-env`,
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
          value: databaseUsername.valueAsString
        },
        {
          namespace: 'aws:elasticbeanstalk:application:environment',
          optionName: 'POSTGRES_PASSWORD',
          value: databasePassword.valueAsString
        },
        {
          namespace: 'aws:elasticbeanstalk:application:environment',
          optionName: 'POSTGRES_DB',
          value: databaseName.valueAsString
        },
        {
          namespace: 'aws:elasticbeanstalk:application:environment',
          optionName: 'SPRING_SECURITY_SECRET_KEY',
          value: springSecuritySecretKey.valueAsString
        },
        {
          namespace: 'aws:elasticbeanstalk:application:environment',
          optionName: 'GOOGLE_CLIENT_ID',
          value: googleClientId.valueAsString
        },
        {
          namespace: 'aws:elasticbeanstalk:application:environment',
          optionName: 'GOOGLE_CLIENT_SECRET',
          value: googleClientSecret.valueAsString
        },
        {
          namespace: 'aws:elasticbeanstalk:application:environment',
          optionName: 'GOOGLE_REDIRECT_URI',
          value: googleRedirectUri.valueAsString
        },
        {
          namespace: 'aws:elasticbeanstalk:application:environment',
          optionName: 'FRONTEND_URL',
          value: frontendUrl.valueAsString
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
      bucketName: `${this.stackName.toLowerCase()}-${environment.valueAsString}-artifacts`,
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
      projectName: `${this.stackName}-${environment.valueAsString}`,
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
        privileged: true,
        computeType: codebuild.ComputeType.SMALL
      },
      source: codebuild.Source.gitHub({
        owner: 'oukhali99',
        repo: 'JWT-OAuth2-Spring-Boot-React'
      }),
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
      projectName: `${this.stackName}-${environment.valueAsString}-frontend`,
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
        privileged: true,
        computeType: codebuild.ComputeType.SMALL
      },
      source: codebuild.Source.gitHub({
        owner: 'oukhali99',
        repo: 'JWT-OAuth2-Spring-Boot-React'
      }),
      buildSpec: buildSpecFrontend
    });
    

    // Grant CodeBuild access to S3 bucket
    artifactsBucket.grantReadWrite(codeBuildProjectBackend);

    // CodePipeline
    const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      pipelineName: `${this.stackName}-${environment.valueAsString}-pipeline`,
      artifactBucket: artifactsBucket
    });

    // Source Stage
    const sourceOutput = new codepipeline.Artifact();
    const sourceAction = new codepipeline_actions.CodeStarConnectionsSourceAction({
      actionName: 'GitHub_Source',
      owner: 'oukhali99',
      repo: 'JWT-OAuth2-Spring-Boot-React',
      branch: 'main',
      connectionArn: githubConnectionArn.valueAsString,
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
      bucket: s3.Bucket.fromBucketName(this, 'FrontendBucket', s3BucketFrontend.valueAsString),
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
