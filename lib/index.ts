import * as cdk from '@aws-cdk/core';

export interface EpsagonCdkProps {
  // Define construct properties here
}

export class EpsagonCdk extends cdk.Construct {

  constructor(scope: cdk.Construct, id: string, props: EpsagonCdkProps = {}) {
    super(scope, id);

    // Define construct contents here
  }
}
