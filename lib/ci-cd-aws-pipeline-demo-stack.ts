import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep, Step } from 'aws-cdk-lib/pipelines';
import { ManualApprovalStep } from 'aws-cdk-lib/pipelines';
import { MyPipelineAppStage } from './stage';

export class CiCdAwsPipelineDemoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new CodePipeline(this, 'Pipeline', {
      pipelineName: 'TestPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('rchandnani0615/ci-cd-aws-pipeline-demo', 'main'),  
        commands: ['npm ci', 
                   'npm run build', 
                   'npx cdk synth']
      })
    });



    // const testingStage = pipeline.addStage(new MyPipelineAppStage(this, "test", {
    //   env: { account: "091444724237", region: "us-east-1" }
    // }));


    // testingStage.addPre(new ShellStep("Run Unit Tests", { commands: ['npm install', 'npm test'] }));
    // testingStage.addPost(new ManualApprovalStep('Manual approval before production'));

    // const prodStage = pipeline.addStage(new MyPipelineAppStage(this, "prod", {
    //   env: { account: "091444724237", region: "us-east-1" }
    // }));
  }
}