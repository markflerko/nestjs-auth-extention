import { Body, Controller, Post } from '@nestjs/common';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { GoogleTokenDto } from 'src/iam/authentication/dto/google-token.dto';
import { AuthType } from 'src/iam/authentication/enums/auth-type.enum';
import { GoogleAuthenticationService } from 'src/iam/authentication/social/google-authentication.service';

@Auth(AuthType.None)
@Controller('authentication/google')
export class GoogleAuthenticationController {
  constructor(
    private readonly googleAuthService: GoogleAuthenticationService,
  ) {}

  @Post()
  authenticate(@Body() tokenDto: GoogleTokenDto) {
    return this.googleAuthService.authenticate(tokenDto.token);
  }
}
