import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/model/user.entity';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';

// import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) // private jwtService: JwtService
  {}

  async login(number, password: string) {
    try {
      if (!number) {
        throw new HttpException('Введите номер', HttpStatus.BAD_REQUEST);
      }

      const user = await this.usersRepository.findOne({ number });
      if (!user) return 'Нема';
      if (user.password == password) {
        const payload = { user };
        // return await this.jwtService.sign(payload);
        return jwt.sign(
          { user },
          'iYYCClECDPsBzZeBzQGAYagf111111111111111111111111111111111111111111l',
        );
      }
      return false;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}
