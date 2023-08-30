import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessTokenGuard } from 'src/iam/authentication/guards/authentication/access-token.guard';
import { AuthenticationGuard } from 'src/iam/authentication/guards/authentication/authentication.guard';
import { RefreshTokenIdsStorage } from 'src/iam/authentication/refresh-token-ids.storage/refresh-token-ids.storage';
import { PoliciesGuard } from 'src/iam/authorization/guards/roles/policies.guard';
import { FrameworkContributorPolicyHandler } from 'src/iam/authorization/policies/framework-contributor.policy';
import { PolicyHandlerStorage } from 'src/iam/authorization/policies/policy-handler.storage';
import jwtConfig from 'src/iam/config/jwt.config';
import { ApiKey } from 'src/users/api-keys/entities/api-key.entity';
import { User } from 'src/users/entities/user.entity';
import { ApiKeysService } from './authentication/api-keys.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { BcryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';
import { ApiKeyGuard } from 'src/iam/authentication/guards/api-key/api-key.guard';
import { OtpAuthenticationService } from './authentication/otp-authentication.service';
import { GoogleAuthenticationService } from './authentication/social/google-authentication.service';
import { GoogleAuthenticationController } from './authentication/social/google-authentication.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ApiKey]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PoliciesGuard,
      // useClass: PermissionsGuard,
      // useClass: RolesGuard,
    },
    AccessTokenGuard,
    ApiKeyGuard,
    RefreshTokenIdsStorage,
    AuthenticationService,
    PolicyHandlerStorage,
    FrameworkContributorPolicyHandler,
    ApiKeysService,
    OtpAuthenticationService,
    GoogleAuthenticationService,
  ],
  controllers: [AuthenticationController, GoogleAuthenticationController],
})
export class IamModule {}
