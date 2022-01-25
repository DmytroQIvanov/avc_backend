import { OrderProductEntity } from '../model/orderProduct';
import { JwtService } from '@nestjs/jwt';
import { ProductEntity } from './../model/product.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/model/user.entity';
import { getRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { OrderEntity } from '../model/order.entity';
import { NotificationEntity } from '../model/notification.entity';

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

    @InjectRepository(NotificationEntity)
    private notificationEntityEntity: Repository<NotificationEntity>,
    private jwtService: JwtService,
  ) {}

  async addUser(
    password: string,
    number: string,
    firstName: string,
    lastName: string,
  ) {
    try {
      // number = number.replace('+', '');
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

  async deleteUser(id) {
    try {
      const user = await this.usersRepository.delete({ id });
    } catch (e) {
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }
  }

  async addGuest() {
    try {
      const user = this.usersRepository.create({});
      console.log(user.id);
      const accessToken = this.jwtService.sign({
        id: user.id,
      });
      console.log('Guest was created');
      return await { user: await this.usersRepository.save(user), accessToken };
    } catch (e) {
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }
  }

  async getUser(id) {
    const userData = await getRepository(UserEntity)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.favourite', 'favourite')
      .leftJoinAndSelect('user.basket', 'basket')
      .leftJoinAndSelect('user.orders', 'orders')
      .leftJoinAndSelect('user.notifications', 'notification')
      .leftJoinAndSelect('basket.product', 'product')
      .leftJoinAndSelect('product.productVariant', 'productVariant')
      .leftJoinAndSelect('productVariant.property', 'property')
      .where('user.id = :id', { id })
      .getOne();

    if (!userData) {
      throw new HttpException('User is not found', HttpStatus.BAD_REQUEST);
    }
    const { basket, password, orders, ...user } = userData;
    return { ...user, basket, orders };
  }
  async getUsers() {
    return await this.usersRepository.find();
  }
  async addProductToBasket(id, productId, { quantity = 1, taste, weight }) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['basket', 'orders'],
    });
    const userData = await this.getUser(id);
    for (let i = 0; i < userData.basket.length; i++) {
      if (userData.basket[i].product.id === productId) {
        user.basket[i].quantity += quantity;
        await this.usersRepository.save(user);
        return;
        // return { user: await this.getUser(id) };
      }
    }
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    const orderProduct = await this.orderProductEntity.create({
      product,
      quantity,
      user,
      taste,
      weight,
    });
    await this.orderProductEntity.save(orderProduct);
    return;
  }

  async addProductToFavourite(userId, productId) {
    const user = await getRepository(UserEntity)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.favourite', 'favourite')
      .where('user.id = :id', { id: userId })
      .getOne();


    const product = await this.productRepository.findOne(productId);
    if (user.favourite.filter(e => e.id === product.id).length > 0) {
      console.log(product)
      user.favourite = user.favourite.filter((userProduct) => userProduct.id !== product.id);
    } else {
      user.favourite.push(product);
    }

    await this.usersRepository.save(user);

    return;
  }
  async changeProductQuantity(id, productName, quantity = 1) {
    try {
      const user = this.usersRepository.findOne(id);
      const orderProduct = await this.productRepository.findOne({
        where: { name: productName },
      });
      const product = await this.orderProductEntity.findOne({
        where: { user, product: orderProduct },
      });
      product.quantity = quantity;
      if (product.quantity <= 0) {
        product.quantity = 0;
        return;
      }
      await this.orderProductEntity.save(product);
    } catch (e) {}
  }

  async deleteProductFromBasket(id, name) {
    try {
      const user = this.usersRepository.findOne(id);
      const product = this.productRepository.findOne({
        where: { name },
      });
      const deleteProduct = await this.orderProductEntity.findOne({
        where: { user, product },
      });
      await this.orderProductEntity.delete({ ID: deleteProduct.ID });
      return;
      // return { user: await this.getUser(id) };
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
    if (!userData) {
      throw new HttpException('Користувач не знайден', HttpStatus.BAD_REQUEST);
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
    throw new HttpException('Data is not right', HttpStatus.FORBIDDEN);
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
