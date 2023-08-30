import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { toFileStream } from 'qrcode';
import { AuthenticationService } from 'src/iam/authentication/authentication.service';
import { ActiveUser } from 'src/iam/authentication/decorators/active-user.decorator';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { RefreshTokenDto } from 'src/iam/authentication/dto/refresh-token.dto';
import { SignInDto } from 'src/iam/authentication/dto/sign-in.dto';
import { SignUpDto } from 'src/iam/authentication/dto/sign-up.dto';
import { AuthType } from 'src/iam/authentication/enums/auth-type.enum';
import { ActiveUserData } from 'src/iam/authentication/interfaces/active-user-data.interface';
import { OtpAuthenticationService } from 'src/iam/authentication/otp-authentication.service';

@Auth(AuthType.None)
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly otpAuthenticationService: OtpAuthenticationService,
  ) {}

  @Auth(AuthType.Bearer)
  @HttpCode(HttpStatus.OK)
  @Post('2fa/generate')
  async generateQrCode(
    @ActiveUser() activeUser: ActiveUserData,
    @Res() res: Response,
  ) {
    const { secret, uri } = await this.otpAuthenticationService.generateSecret(
      activeUser.email,
    );
    await this.otpAuthenticationService.enableTfaForUser(
      activeUser.email,
      secret,
    );
    res.type('png');
    return toFileStream(res, uri);
  }

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-tokens')
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }

  // @HttpCode(HttpStatus.OK)
  // @Post('sign-in')
  // async signIn(
  //   @Res({ passthrough: true }) response: Response,
  //   @Body() signInDto: SignInDto,
  // ) {
  //   const accessToken = await this.authService.signIn(signInDto);
  //   response.cookie('accessToken', accessToken, {
  //     secure: true,
  //     httpOnly: true,
  //     sameSite: true,
  //   });
  // }
}
