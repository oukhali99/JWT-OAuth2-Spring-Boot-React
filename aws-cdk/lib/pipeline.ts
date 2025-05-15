import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as elasticbeanstalk from 'aws-cdk-lib/aws-elasticbeanstalk';
export class Pipeline {
    constructor(
        private readonly stack: cdk.Stack,
        private readonly environment: string,
        private readonly googleClientId: string,
        private readonly githubConnectionArn: string,
        private readonly elasticBeanstalkApp: elasticbeanstalk.CfnApplication,
        private readonly elasticBeanstalkEnv: elasticbeanstalk.CfnEnvironment,
        private readonly s3BucketFrontend: string,
        private readonly backendUrl: string,
        private readonly googleRedirectUri: string
    ) {        
        // S3 Bucket for Artifacts
        const artifactsBucket = new s3.Bucket(stack, 'ArtifactsBucket', {
            bucketName: `${stack.stackName.toLowerCase()}-${environment}-artifacts`,
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
        const codeBuildProjectBackend = new codebuild.Project(stack, 'CodeBuildProject', {
            projectName: `${stack.stackName}-${environment}`,
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
        const codeBuildProjectFrontend = new codebuild.Project(stack, 'CodeBuildProjectFrontend', {
            projectName: `${stack.stackName}-${environment}-frontend`,
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
        const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
            pipelineName: `${stack.stackName}-${environment}-pipeline`,
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
            bucket: s3.Bucket.fromBucketName(stack, 'FrontendBucket', s3BucketFrontend),
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
    }
}
