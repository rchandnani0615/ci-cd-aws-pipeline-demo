import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep, Step } from 'aws-cdk-lib/pipelines';
import { ManualApprovalStep } from 'aws-cdk-lib/pipelines';
import { MyPipelineAppStage } from './stage';

export class CiCdAwsPipelineDemoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /*----------------------TEST PIPELINE -------------------------------------------*/

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'TestPipeline',
      crossAccountKeys: true,
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('rchandnani0615/ci-cd-aws-pipeline-demo', 'main'),  
        commands: ['npm ci', 
                   'npm run build', 
                   'npx cdk synth']
      })
    }); 


    const devqa = pipeline.addStage(new MyPipelineAppStage(this, "devqa", {
      env: { account: "185418174191", region: "us-east-1" }
    }));


    devqa.addPre(new ShellStep("Run Unit Tests", { commands: ['npm install', 'npm test'] }));

    const devStage = pipeline.addStage(new MyPipelineAppStage(this, "dev", {
      env: { account: "185418174191", region: "us-east-1" }
    }));

    const qaStage = pipeline.addStage(new MyPipelineAppStage(this, "qa", {
      env: { account: "185418174191", region: "us-east-1" }
    }));

    qaStage.addPost(new ManualApprovalStep('Manual approval before prod'));

    const prodStage = pipeline.addStage(new MyPipelineAppStage(this, "prod", {
      env: { account: "185418174191", region: "us-east-1" }
    }));

    /*****************End OF TEST PIPE LINE************************************************* */



    // /*******************************PRODUCTION PIPE LINE************************************ */

    // const prodpipeline = new CodePipeline(this, 'ProdPipeline', {
    //   pipelineName: 'ProdPipeline',
    //   synth: new ShellStep('Synth', {
    //     input: CodePipelineSource.gitHub('rchandnani0615/ci-cd-aws-pipeline-demo', 'master'),  
    //     commands: ['npm ci', 
    //                'npm run build', 
    //                'npx cdk synth']
    //   })
    // });


    // const qastage = pipeline.addStage(new MyPipelineAppStage(this, "qa", {
    //   env: { account: "091444724237", region: "us-east-1" }
    // }));

    // qastage.addPost(new ManualApprovalStep('Manual approval before prod'));

    // const prodStage = pipeline.addStage(new MyPipelineAppStage(this, "prod", {
    //   env: { account: "091444724237", region: "us-east-1" }
    // }));

    // /********************************END PRODUCTION PIPE LINE********************************* */
  }
}