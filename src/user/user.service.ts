import { OrderProductEntity } from './../model/orderProduct';
import { JwtService } from '@nestjs/jwt';
import { ProductEntity } from './../model/product.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/model/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(OrderProductEntity)
    private orderProductEntity: Repository<OrderProductEntity>,
    private jwtService: JwtService,
  ) {}

  async addUser(
    password: string,
    number: string,
    firstName: string,
    lastName: string,
  ) {
    try {
      number = number.replace('+', '');
      const user = this.usersRepository.create();
      user.password = password;
      user.number = number;
      user.firstName = firstName;
      user.lastName = lastName;
      await this.usersRepository.save(user);
      return user;
    } catch (e) {
      // console.log(e.code)
      if (e.code == 23505) {
        throw new HttpException('So number already exist', HttpStatus.CONFLICT);
      }
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }
  }
  async getUser(id) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['basket'],
    });
    const orderProducts = user.basket.length;
    return { ...user, orderProducts };
  }
  async getUsers() {
    return await this.usersRepository.find();
  }
  async logout() {
    return await this.usersRepository.find();
  }
  async addProductToBasket(id, productId, quantity = 1) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['basket'],
    });
    const product = await this.productRepository.findOne({ id: productId });
    const orderProduct = await this.orderProductEntity.create({
      product,
      quantity,
      user,
    });
    user.basket.push(orderProduct);
    await this.orderProductEntity.save(orderProduct);
    await this.usersRepository.save(user);
    return { user: await this.getUser(id) };
  }

  async deleteProductFromBasket(id, productId) {
    // const user = await this.usersRepository.findOne({
    //   where: { id },
    //   relations: ['basket'],
    // });
    // // const product = await this.productRepository.findOne({ id: productId });
    // // user.basket.slice();
    // await this.orderProductEntity.delete({ id: productId });
    // // await this.usersRepository.save(user);
    // return { user: await this.getUser(id) };
  }
  async loginUser({ login, password }) {
    const user = await this.usersRepository.findOne({
      where: { number: login },
    });
    if (user && user.password == password) {
      const accessToken = this.jwtService.sign({
        login: user.number,
        id: user.id,
      });

      return { user, accessToken };
    }
    throw new HttpException('Data is not rigth', HttpStatus.FORBIDDEN);
  }
  async checkToken(accessToken) {
    try {
      console.log(accessToken);

      const accesTokenObj = await this.jwtService.verify(accessToken);

      const user = await this.usersRepository.findOne({
        id: accesTokenObj['id'],
      });
      const { password, ...returnsData } = user;
      if (user) {
        return returnsData;
      } else {
        throw new HttpException('User not found', HttpStatus.FORBIDDEN);
      }
    } catch (e) {
      throw new HttpException(
        'Token is not valid CheckToken',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
