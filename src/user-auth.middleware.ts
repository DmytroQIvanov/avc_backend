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
  constructor(
    // @InjectRepository(UserEntity)
    private userService: UserService,
  ) {}
  async use(req: any, res: any, next: () => void) {
    if (!req.cookies.accessToken) {
      throw new HttpException('No token', HttpStatus.FORBIDDEN);
    }
    try {
      console.log(req.cookies.accessToken);

      console.log('s');
      const data = await this.userService.checkToken(req.cookies.accessToken);
      console.log('s');
      req.headers.id = data.id;

      next();
    } catch (e) {
      throw new HttpException(
        'Token is not valid middleware',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
