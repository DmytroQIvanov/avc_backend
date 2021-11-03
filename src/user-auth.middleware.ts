import { UserService } from './user/user.service';
import { UserEntity } from 'src/model/user.entity';
import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserAuthMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {}
  async use(req: any, res: any, next: () => void) {
    if (!req.cookies.accessToken) {
      throw new HttpException('No token', HttpStatus.FORBIDDEN);
    }
    try {
      const data = await this.userService.checkToken(req.cookies.accessToken);
      req.headers.id = data.id;
      console.log('pass middleware');
      next();
    } catch (e) {
      throw new HttpException(
        'Token is not valid middleware',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
