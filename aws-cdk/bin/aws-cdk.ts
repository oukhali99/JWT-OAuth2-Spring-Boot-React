#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AwsCdkStack } from '../lib/aws-cdk-stack';

const app = new cdk.App();

// Get the environment from command line arguments or default to 'dev'
const environment = app.node.tryGetContext('environment') || 'dev';

new AwsCdkStack(app, `JWT-OAuth2-${environment}`, {
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION
  }
});