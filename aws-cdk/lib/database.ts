import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class Database {
    public readonly securityGroup: ec2.SecurityGroup;
    public readonly dbInstance: rds.DatabaseInstance;

    constructor(
        private readonly stack: cdk.Stack,
        private readonly environment: string,
        private readonly vpc: ec2.Vpc,
        private readonly databaseName: string,
        private readonly dbCredentials: rds.Credentials,
        private readonly allocatedStorage: number,
        private readonly multiAz: boolean
    ) {
        // RDS Instance
        this.securityGroup = new ec2.SecurityGroup(stack, 'DBSecurityGroup', {
          vpc,
          description: 'Security group for RDS instance',
          securityGroupName: `${stack.stackName}-${environment}-db-security-group`
        });

        this.dbInstance = new rds.DatabaseInstance(stack, 'DBInstance', {
          engine: rds.DatabaseInstanceEngine.postgres({
            version: rds.PostgresEngineVersion.VER_15
          }),
          instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
          vpc,
          vpcSubnets: {
            subnetType: ec2.SubnetType.PRIVATE_ISOLATED
          },
          securityGroups: [this.securityGroup],
          databaseName: databaseName,
          credentials: dbCredentials,
          allocatedStorage: allocatedStorage,
          storageType: rds.StorageType.GP2,
          multiAz: multiAz,
          publiclyAccessible: false,
          removalPolicy: cdk.RemovalPolicy.DESTROY
        });
    }

    public allowAccessFrom(securityGroup: ec2.SecurityGroup) {
        this.securityGroup.addIngressRule(
            securityGroup,
            ec2.Port.tcp(5432),
            'Allow PostgreSQL access'
        );
    }
}
