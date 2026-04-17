import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto, LoginDto } from './dto/auth.dto';
import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
} from './common/decorators';
import { RtGuard } from './common/guards/rt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Public()
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  async signupLocal(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, tokens } = await this.authService.signupLocal(dto);
    this.setCookies(res, tokens);
    return user;
  }

  @Public()
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  async signinLocal(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, tokens } = await this.authService.signinLocal(dto);
    this.setCookies(res, tokens);
    return user;
  };

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @GetCurrentUserId() userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.clearCookies(res);
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') rt: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.refreshTokens(userId, rt);
    this.setCookies(res, tokens);
    return { success: true };
  }

  @Post('verify-password')
  @HttpCode(HttpStatus.OK)
  async verifyPassword(
    @GetCurrentUserId() userId: string,
    @Body('password') password: string,
  ) {
    const isValid = await this.authService.verifyPassword(userId, password);
    if (!isValid) throw new ForbiddenException('Incorrect Password');
    return { success: true };
  }

  private setCookies(res: Response, tokens: any) {
    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: true, //process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'none',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: true, //process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  private clearCookies(res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }
}
