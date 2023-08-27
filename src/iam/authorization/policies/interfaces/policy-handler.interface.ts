import { ActiveUserData } from 'src/iam/authentication/interfaces/active-user-data.interface';
import { Policy } from 'src/iam/authorization/policies/interfaces/policy.interface';

export interface PolicyHandler<T extends Policy> {
  handle(policy: T, user: ActiveUserData): Promise<void>;
}
