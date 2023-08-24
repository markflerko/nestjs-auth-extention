import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenGuard } from 'src/iam/authentication/guards/authentication/access-token.guard';
import { AuthenticationGuard } from 'src/iam/authentication/guards/authentication/authentication.guard';
import { RefreshTokenIdsStorage } from 'src/iam/authentication/refresh-token-ids.storage/refresh-token-ids.storage';
import { PermissionsGuard } from 'src/iam/authorization/guards/roles/permissions.guard';
import jwtConfig from 'src/iam/config/jwt.config';
import { UsersModule } from 'src/users/users.module';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { BcryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';

@Module({
  imports: [
    UsersModule,
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
      useClass: PermissionsGuard,
      // useClass: RolesGuard,
    },
    AccessTokenGuard,
    RefreshTokenIdsStorage,
    AuthenticationService,
  ],
  controllers: [AuthenticationController],
})
export class IamModule {}
