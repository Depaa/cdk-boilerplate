import { App, Stack, StackProps } from 'aws-cdk-lib';
import { aws_ec2 as ec2 } from 'aws-cdk-lib';
import { BuildConfig } from '../lib/common/config.interface';
import { name } from '../lib/common/utils';

export class VPCStack extends Stack {
  public readonly vpc: ec2.Vpc;

  constructor(scope: App, id: string, props: StackProps, buildConfig: BuildConfig) {
    super(scope, id, props);

    this.vpc = this.createVPC(
      name(id, 'vpc'),
      buildConfig.stacks.vpc.cidr,
      buildConfig.stacks.vpc.natGateways,
      buildConfig.stacks.vpc.maxAzs,
    );
  }

  private createVPC(name: string, cidr: string, natGateways: number, maxAzs: number): ec2.Vpc {
    return new ec2.Vpc(this, name, {
      cidr,
      natGateways,
      maxAzs,
    })
  }
}