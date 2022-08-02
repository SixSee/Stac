import { HttpException, Injectable } from '@nestjs/common';
import { UserDTO, UserLoginDto } from './dto/auth.dto';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import * as jwt from 'jsonwebtoken';
import { checkPasswd, User, UserRole } from './auth.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(@InjectModel('User') private user: Model<User>) {}

  async create(createAuthDto: UserDTO, role: string) {
    if (await this.usernameExists(createAuthDto.username))
      throw new HttpException('Username taken', 400);
    if (role === UserRole.BUYER) {
      const newAccount = new this.user(createAuthDto);
      newAccount.role = UserRole.BUYER;
      await newAccount.save();
    } else {
      const newAccount = new this.user(createAuthDto);
      newAccount.role = UserRole.SELLER;
      await newAccount.save();
    }
    return true;
  }

  async login(loginDto: UserLoginDto) {
    const user: User = await this.user.findOne({ username: loginDto.username });
    if (!user) throw new HttpException('Email not registered', 400);
    if (!(await checkPasswd(user.password, loginDto.password)))
      throw new HttpException('Incorrect Password', 401);
    if (user.walletAddress != loginDto.walletAddress)
      throw new HttpException('Wallet Address does not match', 401);
    const jwtToken = this.createToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });
    return {
      accessToken: jwtToken,
      user: { name: user.fullName, username: user.username, role: user.role },
    };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(user) {
    return this.user.findOne({ _id: user.id });
  }

  update(id: number, updateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async getUser(id) {
    const user: User = await this.user.findOne(
      {
        _id: id,
        isDeleted: false,
      },
      'id fullName username role',
    );
    return !user ? null : this.sanitizeAdmin(user);
  }

  createToken(payload) {
    return jwt.sign(payload, config.SECRET, { expiresIn: '7d' });
  }

  validateToken(payload): string | JwtPayload {
    try {
      return jwt.verify(payload, config.SECRET);
    } catch (e) {
      throw new HttpException(e.message, 403);
    }
  }

  sanitizeAdmin(user: User) {
    const sanitized = user.toObject();
    delete sanitized['password'];
    return sanitized;
  }

  async usernameExists(username: string) {
    const exists = await this.user.findOne({ username: username }, 'username');
    return !!exists;
  }
}
