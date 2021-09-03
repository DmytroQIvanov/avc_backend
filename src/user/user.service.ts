import { OrderProductEntity } from '../model/orderProduct';
import { JwtService } from '@nestjs/jwt';
import { ProductEntity } from './../model/product.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/model/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { OrderEntity } from '../model/order.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,

    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,

    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,

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

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = this.usersRepository.create({
        password: hashedPassword,
        number,
        firstName,
        lastName,
      });
      return await this.usersRepository.save(user);
    } catch (e) {
      if (e.code == 23505) {
        throw new HttpException('So number already exist', HttpStatus.CONFLICT);
      }
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }
  }
  async getUser(id) {
    const userData = await this.usersRepository.findOne({
      where: { id },
      relations: ['basket', 'orders'],
    });
    let basket1 = [];
    let basketLength = 0;

    let ordersData = [];
    if (!userData) {
      throw new HttpException('User is not found', HttpStatus.BAD_REQUEST);
    }

    if (userData) {
      basketLength = userData.basket.length;
      basket1 = await Promise.all(
        userData?.basket.map(async (elem) => {
          return await this.orderProductEntity.findOne({
            where: { ID: elem.ID },
            relations: ['product'],
          });
        }),
      );

      ordersData = await Promise.all(
        userData.orders.map(async (elem) => {
          return await this.orderRepository.findOne({
            where: { id: elem.id },
            relations: ['orderProducts'],
          });
        }),
      );
    }
    const { basket, password, orders, ...user } = userData;
    return { ...user, basketLength, basket: basket1, orders: ordersData };
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
      relations: ['basket', 'orders'],
    });
    const userData = await this.getUser(id);
    for (let i = 0; i < userData.basket.length; i++) {
      if (userData.basket[i].product.id === productId) {
        user.basket[i].quantity += quantity;
        await this.usersRepository.save(user);
        return { user: await this.getUser(id) };
      }
    }
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    // console.log(product.id);
    const orderProduct = await this.orderProductEntity.create({
      product,
      quantity,
      user,
    });
    await this.orderProductEntity.save(orderProduct);
    return { user: await this.getUser(id) };
  }

  async deleteProductFromBasket(id, productId) {
    try {
      await this.orderProductEntity.delete({ ID: productId });
      return { user: await this.getUser(id) };
    } catch (e) {
      console.log(e);
    }
  }
  async deleteProductsFromBasket(id) {
    try {
      const user = this.usersRepository.findOne(id);
      await this.orderProductEntity.delete({ user: id });
      return { user: await this.getUser(id) };
    } catch (e) {
      console.log(e);
    }
  }
  async loginUser({ login, password }) {
    const userData = await this.usersRepository.findOne({
      where: { number: login },
    });
    console.log(userData);
    if (!userData) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const isPasswordMatching = await bcrypt.compare(
      password,
      userData.password,
    );
    if (userData && isPasswordMatching) {
      const accessToken = this.jwtService.sign({
        login: userData.number,
        id: userData.id,
      });
      const { password, ...user } = userData;

      return { user, accessToken };
    }
    throw new HttpException('Data is not rigth', HttpStatus.FORBIDDEN);
  }
  async checkToken(accessToken) {
    try {
      const accesTokenObj = await this.jwtService.verify(accessToken);

      const user = await this.usersRepository.findOne({
        id: accesTokenObj['id'],
      });
      if (user) {
        const { password, ...returnsData } = user;
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
