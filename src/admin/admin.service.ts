import { ProductEntity } from '../model/product.entity';
import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from 'src/model/admin.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private adminRepository: Repository<AdminEntity>,

    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    private jwtService: JwtService,
  ) {}
  async loginAdmin(login: string, password: string) {
    const admin = await this.adminRepository.findOne({ login });

    if (admin && admin.password == password) {
      const login = admin.login;
      const accesToken = this.jwtService.sign(
        { login },
        { expiresIn: '360000s' },
      );

      const randomKey = uuid();
      const accesSlice = accesToken.slice(-8);
      const refreshToken = this.jwtService.sign(
        { accesSlice, randomKey },
        { expiresIn: '9600h', secret: accesSlice },
      );

      return { accesToken, refreshToken, login };
    }
    throw new HttpException(
      'Password or login doe`s not match ',
      HttpStatus.FORBIDDEN,
    );
  }
  async refreshToken(accesToken, refreshToken) {
    try {
      // const accesSlice = accesToken.slice(-8)
      // const tokenObj = await this.jwtService.verify(refreshToken,{secret:accesSlice})

      const accesTokenObj = await this.jwtService.decode(accesToken);

      console.log(accesTokenObj['login']);

      const accesTokenGet = this.jwtService.sign({}, { expiresIn: '9600s' });

      return;
    } catch (e) {
      throw new HttpException('Token is not valid', HttpStatus.FORBIDDEN);
    }
    // const admin =await this.adminRepository.findOne({login});
    // console.log(admin)
    // console.log(login)

    // if(admin && admin.password == password){
    //     console.log(admin)
    //     const accesToken = this.jwtService.sign({admin,login},{expiresIn:"3600s"});

    //     const randomKey = uuid()
    //     const accesSlice = accesToken.slice(-8)
    //     const refreshToken = this.jwtService.sign({accesSlice,randomKey},{expiresIn:"9600h"});

    //     return {accesToken, refreshToken}
    // }
  }
  async checkToken(accesToken) {
    try {
      const accesTokenObj = await this.jwtService.verify(accesToken);

      console.log(accesTokenObj);
      const admin = await this.adminRepository.findOne({
        login: accesTokenObj['login'],
      });
      const { password, ...returnsData } = admin;
      if (admin) {
        return returnsData;
      } else {
        throw new HttpException('Admin not found', HttpStatus.FORBIDDEN);
      }
    } catch (e) {
      throw new HttpException(
        'Token is not valid CheckToken',
        HttpStatus.FORBIDDEN,
      );
    }
  }
  async addAdmin(code: string, { firstName, lastName, login, password }) {
    if (code != 'sT7PZ7Tmn99L94cr')
      throw new HttpException('code', HttpStatus.FORBIDDEN);
    if (!login || !password || !firstName || !lastName)
      throw new HttpException('Some field is missing', HttpStatus.BAD_REQUEST);
    const admin = await this.adminRepository.create({
      firstName,
      lastName,
      login,
      password,
    });
    return await this.adminRepository.save(admin);
  }

  async addProduct(itemData) {
    try {
      const item = await this.productRepository.create(itemData);
      return await this.productRepository.save(item);
    } catch (e) {
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }
  }
}
