import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

import { Pipeline } from './pipeline';
import { Backend } from './backend';
import { Database } from './database';

interface EnvironmentConfig {
  googleRedirectUri: string;
  frontendUrl: string;
  s3BucketFrontend: string;
  backendUrl: string;
  maxAzs: number;
  allocatedStorage: number;
  multiAz: boolean;
}

export class AwsCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Get the environment from context
    const environment = this.node.tryGetContext('environment');
    const envConfig = this.node.tryGetContext(environment) as EnvironmentConfig;

    // Get root-level configuration
    const databaseName = this.node.tryGetContext('databaseName');
    const databaseUsername = this.node.tryGetContext('databaseUsername');
    const googleClientId = this.node.tryGetContext('googleClientId');
    const googleClientSecret = this.node.tryGetContext('googleClientSecret');
    const githubConnectionArn = this.node.tryGetContext('githubConnectionArn');
    const springSecuritySecretKey = this.node.tryGetContext('springSecuritySecretKey');

    const dbCredentials = rds.Credentials.fromGeneratedSecret(databaseUsername, {
      secretName: `${this.stackName}-${environment}-db-credentials`
    });

    const secretGoogle = new secretsmanager.Secret(this, 'SecretGoogle', {
      secretName: `${this.stackName}-${environment}-google`,
      generateSecretString: {
        secretStringTemplate: JSON.stringify({
          clientSecret: googleClientSecret
        }),
        generateStringKey: 'dummy'
      }
    });

    // VPC and Network Configuration
    const vpc = new ec2.Vpc(this, 'VPC', {
      vpcName: `${this.stackName}-${environment}-vpc`,
      ipAddresses: ec2.IpAddresses.cidr('172.30.0.0/16'),
      maxAzs: envConfig.maxAzs,
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

    const database = new Database(this, environment, vpc, databaseName, dbCredentials, envConfig.allocatedStorage, envConfig.multiAz);

    const backend = new Backend(this, environment, googleClientId, secretGoogle, vpc, database.dbInstance, databaseUsername, databaseName, springSecuritySecretKey, envConfig.googleRedirectUri, envConfig.frontendUrl);

    database.allowAccessFrom(backend.securityGroup);

    new Pipeline(this, environment, googleClientId, githubConnectionArn, backend.elasticBeanstalkApp, backend.elasticBeanstalkEnv, envConfig.s3BucketFrontend, envConfig.backendUrl, envConfig.googleRedirectUri);

    // Outputs
    new cdk.CfnOutput(this, 'ElasticBeanstalkUrl', {
      value: `http://${backend.elasticBeanstalkEnv.attrEndpointUrl}`,
      description: 'Elastic Beanstalk Environment URL'
    });
  }
}
