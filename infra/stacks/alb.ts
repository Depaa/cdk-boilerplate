import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Peer, Port, SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2';
import { ApplicationListener, ApplicationLoadBalancer } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { BuildConfig } from '../lib/common/config.interface';
import { name } from '../lib/common/utils';

interface ALBStackProps extends StackProps {
  vpc: Vpc;
}

export class ALBStack extends Stack {
  public readonly lbSecurityGroup: SecurityGroup;
  public readonly ALB: ApplicationLoadBalancer;

  constructor(scope: App, id: string, props: ALBStackProps, buildConfig: BuildConfig) {
    super(scope, id, props);

    this.lbSecurityGroup = this.createSecurityGroup(name(id, 'sg'), props.vpc);
    this.lbSecurityGroup.addIngressRule(Peer.anyIpv4(), Port.allTraffic());
    this.lbSecurityGroup.addEgressRule(Peer.anyIpv4(), Port.allTraffic());
    this.ALB = this.createALB(name(id), props.vpc, this.lbSecurityGroup);
  }

  private createSecurityGroup(name: string, vpc: Vpc): SecurityGroup {
    return new SecurityGroup(this, name, {
      vpc,
    });

  }

  private createALB(name: string, vpc: Vpc, lbSecurityGroup: SecurityGroup): ApplicationLoadBalancer {
    return new ApplicationLoadBalancer(this, name, {
      loadBalancerName: name,
      vpc,
      internetFacing: true,
      securityGroup: lbSecurityGroup,
    });
  }
}