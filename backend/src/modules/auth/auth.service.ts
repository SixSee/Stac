import { HttpException, Injectable } from '@nestjs/common';
import { UserDTO } from './dto/auth.dto';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import * as jwt from 'jsonwebtoken';
import { User } from './auth.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(@InjectModel('User') private user: Model<User>) {}

  create(createAuthDto: UserDTO) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
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
}
