import {
  Controller,
  Post,
  Body,
  Response,
  UnauthorizedException,
  BadRequestException,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../../database/models/user.model';
import { HttpExceptionFilter } from 'src/filters/global-exception.filter';
@UseFilters(HttpExceptionFilter)
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body('user') user: User, @Response() res) {
    const createUser = new User(user);

    const newUser = await this.authService.register(createUser.dataValues);
    res.setHeader('Authorization', newUser.token);
    return res
      .status(201)
      .json({ message: 'User registered successfully', user: newUser.user });
  }
  @Post('/login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Response() res,
  ) {
    if (!password || !email) {
      throw new BadRequestException('all filed is required');
    }

    const authenticatedUser = await this.authService.validatePassword(
      email,
      password,
    );

    if (!authenticatedUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.authService.login(authenticatedUser);
    res.setHeader('Authorization', token);

    return res.status(200).json({ message: 'user registered' });
  }
}
