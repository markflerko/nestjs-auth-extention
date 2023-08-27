import { Injectable } from '@nestjs/common';
import { ActiveUserData } from 'src/iam/authentication/interfaces/active-user-data.interface';
import { PolicyHandler } from 'src/iam/authorization/policies/interfaces/policy-handler.interface';
import { Policy } from 'src/iam/authorization/policies/interfaces/policy.interface';
import { PolicyHandlerStorage } from 'src/iam/authorization/policies/policy-handler.storage';

export class FrameworkContributorPolicy implements Policy {
  name = 'FrameworkContributor';
}

@Injectable()
export class FrameworkContributorPolicyHandler
  implements PolicyHandler<FrameworkContributorPolicy>
{
  constructor(private readonly policyHandlerStorage: PolicyHandlerStorage) {
    this.policyHandlerStorage.add(FrameworkContributorPolicy, this);
  }

  handle(policy: FrameworkContributorPolicy, user: ActiveUserData): any {
    const isContributor = user.email.endsWith('@nestjs.com');
    if (!isContributor) {
      throw new Error('User is not a contributor');
    }
  }
}
