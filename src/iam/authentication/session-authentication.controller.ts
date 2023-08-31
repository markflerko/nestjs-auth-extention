import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ActiveUser } from 'src/iam/authentication/decorators/active-user.decorator';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { SignInDto } from 'src/iam/authentication/dto/sign-in.dto';
import { AuthType } from 'src/iam/authentication/enums/auth-type.enum';
import { SessionGuard } from 'src/iam/authentication/guards/session/session.guard';
import { ActiveUserData } from 'src/iam/authentication/interfaces/active-user-data.interface';
import { SessionAuthenticationService } from 'src/iam/authentication/session-authentication.service';
import { promisify } from 'util';

@Auth(AuthType.None)
@Controller('session-authentication')
export class SessionAuthenticationController {
  constructor(
    private readonly sessionAuthService: SessionAuthenticationService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Req() request: Request, @Body() signInDto: SignInDto) {
    const user = await this.sessionAuthService.signIn(signInDto);
    await promisify(request.logIn).call(request, user);
  }

  @UseGuards(SessionGuard)
  @Get()
  async sayHello(@ActiveUser() user: ActiveUserData) {
    return `Hello, ${user.email}!`;
  }
}
