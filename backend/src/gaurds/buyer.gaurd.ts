import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtPayload } from 'jsonwebtoken';
import { AuthService } from '../modules/auth/auth.service';
import { UserRole } from '../modules/auth/auth.entity';

@Injectable()
export class BuyerGaurd implements CanActivate {
  constructor(private readonly userService: AuthService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }
  async validateRequest(request: Request) {
    const jwtToken = request.headers['x-access-token'];
    const tokenInfo: JwtPayload | string =
      this.userService.validateToken(jwtToken);
    const user = await this.userService.getUser(tokenInfo['id']);
    if (!user) return false;
    if (user.role != UserRole.BUYER)
      throw new HttpException('Unauthorized', 401);
    request['user'] = user;
    request['user']['id'] = user._id;
    return true;
  }
}
