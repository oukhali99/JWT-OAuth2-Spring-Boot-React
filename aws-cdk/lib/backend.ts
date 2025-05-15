import * as cdk from 'aws-cdk-lib';
import * as elasticbeanstalk from 'aws-cdk-lib/aws-elasticbeanstalk';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';

export class Backend {
    public readonly elasticBeanstalkApp: elasticbeanstalk.CfnApplication;
    public readonly elasticBeanstalkEnv: elasticbeanstalk.CfnEnvironment;
    public readonly securityGroup: ec2.SecurityGroup;

    constructor(
        private readonly stack: cdk.Stack,
        private readonly environment: string,
        private readonly googleClientId: string,
        private readonly secretGoogle: secretsmanager.Secret,
        private readonly vpc: ec2.Vpc,
        private readonly dbInstance: rds.DatabaseInstance,
        private readonly databaseUsername: string,
        private readonly databaseName: string,
        private readonly springSecuritySecretKey: string,
        private readonly googleRedirectUri: string,
        private readonly frontendUrl: string
    ) {
        const dbCredentialsSecret = this.dbInstance.secret;
        if (!dbCredentialsSecret) throw new Error('dbCredentialsSecret is undefined');

        this.securityGroup = new ec2.SecurityGroup(stack, 'BackendSecurityGroup', {
          vpc,
          description: 'Security group for ECS tasks',
          securityGroupName: `${stack.stackName}-${environment}-backend-security-group`
        });
    
        this.securityGroup.addIngressRule(
          ec2.Peer.anyIpv4(),
          ec2.Port.tcp(80),
          'Allow HTTP access'
        );

        // Elastic Beanstalk Application
        this.elasticBeanstalkApp = new elasticbeanstalk.CfnApplication(stack, 'ElasticBeanstalkApplication', {
            applicationName: `${stack.stackName}-${environment}`,
            description: 'JWT OAuth2 Spring Boot React Application'
        });
        
        // IAM Role for Elastic Beanstalk
        const elasticBeanstalkRole = new iam.Role(stack, 'ElasticBeanstalkRole', {
            roleName: `${stack.stackName}-${environment}-elasticbeanstalk-role`,
            assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkWorkerTier'),
                iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLogsFullAccess')
            ]
        });
        
        elasticBeanstalkRole.addToPolicy(new iam.PolicyStatement({
            actions: ['secretsmanager:GetSecretValue', 'ssm:GetParameter'],
            resources: [
                dbCredentialsSecret.secretArn,
                this.secretGoogle.secretArn
            ]
        }));
        
        const elasticBeanstalkInstanceProfile = new iam.CfnInstanceProfile(stack, 'ElasticBeanstalkInstanceProfile', {
            path: '/',
            roles: [elasticBeanstalkRole.roleName]
        });
        
        // Elastic Beanstalk Environment
        this.elasticBeanstalkEnv = new elasticbeanstalk.CfnEnvironment(stack, 'ElasticBeanstalkEnvironment', {
            applicationName: this.elasticBeanstalkApp.applicationName!,
            environmentName: `${stack.stackName}-${environment}-env`,
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
                    optionName: 'AWS_DB_SECRET_ARN',
                    value: dbCredentialsSecret.secretArn
                },
                {
                    namespace: 'aws:elasticbeanstalk:application:environment',
                    optionName: 'POSTGRES_PORT',
                    value: '5432'
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
                    optionName: 'AWS_SECRET_GOOGLE_CLIENT_SECRET_ARN',
                    value: secretGoogle.secretArn
                },
                {
                    namespace: 'aws:elasticbeanstalk:application:environment',
                    optionName: 'GOOGLE_REDIRECT_URI',
                    value: googleRedirectUri
                },
                {
                    namespace: 'aws:elasticbeanstalk:application:environment',
                    optionName: 'GOOGLE_CLIENT_ID',
                    value: googleClientId
                },
                {
                    namespace: 'aws:elasticbeanstalk:application:environment',
                    optionName: 'FRONTEND_URL',
                    value: frontendUrl
                },
                {
                    namespace: 'aws:elasticbeanstalk:application:environment',
                    optionName: 'AWS_REGION',
                    value: 'us-east-1'
                },
                {
                    namespace: 'aws:autoscaling:launchconfiguration',
                    optionName: 'IamInstanceProfile',
                    value: elasticBeanstalkInstanceProfile.ref
                },
                {
                    namespace: 'aws:autoscaling:launchconfiguration',
                    optionName: 'SecurityGroups',
                    value: this.securityGroup.securityGroupId
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
    }
}