import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as createRedisStore from 'connect-redis';
import * as session from 'express-session';
import { Redis } from 'ioredis';
import * as passport from 'passport';
import { ApiKeyGuard } from 'src/iam/authentication/guards/api-key/api-key.guard';
import { AccessTokenGuard } from 'src/iam/authentication/guards/authentication/access-token.guard';
import { AuthenticationGuard } from 'src/iam/authentication/guards/authentication/authentication.guard';
import { RefreshTokenIdsStorage } from 'src/iam/authentication/refresh-token-ids.storage/refresh-token-ids.storage';
import { UserSerializer } from 'src/iam/authentication/serializers/user-serializer/user-serializer';
import { PoliciesGuard } from 'src/iam/authorization/guards/roles/policies.guard';
import { FrameworkContributorPolicyHandler } from 'src/iam/authorization/policies/framework-contributor.policy';
import { PolicyHandlerStorage } from 'src/iam/authorization/policies/policy-handler.storage';
import jwtConfig from 'src/iam/config/jwt.config';
import { ApiKey } from 'src/users/api-keys/entities/api-key.entity';
import { User } from 'src/users/entities/user.entity';
import { ApiKeysService } from './authentication/api-keys.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { OtpAuthenticationService } from './authentication/otp-authentication.service';
import { SessionAuthenticationController } from './authentication/session-authentication.controller';
import { SessionAuthenticationService } from './authentication/session-authentication.service';
import { GoogleAuthenticationController } from './authentication/social/google-authentication.controller';
import { GoogleAuthenticationService } from './authentication/social/google-authentication.service';
import { BcryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';

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
    SessionAuthenticationService,
    UserSerializer,
  ],
  controllers: [
    AuthenticationController,
    GoogleAuthenticationController,
    SessionAuthenticationController,
  ],
})
export class IamModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const RedisStore = createRedisStore(session);

    consumer
      .apply(
        session({
          store: new RedisStore({
            client: new Redis(6379, 'localhost'),
          }),
          secret: process.env.SESSION_SECRET,
          resave: false,
          saveUninitialized: false,
          cookie: {
            sameSite: true,
            httpOnly: true,
          },
        }),
        passport.initialize(),
        passport.session(),
      )
      .forRoutes('*');
  }
}
