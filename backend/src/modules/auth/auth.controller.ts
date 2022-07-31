import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  Req,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO, UserLoginDto } from './dto/auth.dto';
import { BuyerGaurd } from '../../gaurds/buyer.gaurd';
import { UserRole } from './auth.entity';
import { ApiTags } from '@nestjs/swagger';
import {CommonGaurd} from "../../gaurds/common.gaurd";

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/seller/signup')
  async seller_signup(@Body(ValidationPipe) createAuthDto: UserDTO) {
    await this.authService.create(createAuthDto, UserRole.SELLER);
    throw new HttpException('Success', 200);
  }

  @Post('/buyer/signup')
  async buyer_signup(@Body(ValidationPipe) createAuthDto: UserDTO) {
    await this.authService.create(createAuthDto, UserRole.BUYER);
    throw new HttpException('Success', 200);
  }

  @Post('/login')
  async login(@Body(ValidationPipe) loginDto: UserLoginDto) {
    return this.authService.login(loginDto);
  }
  //
  // @Get()
  // @UseGuards(BuyerGaurd)
  // findAll(@Req() request) {
  //   return this.authService.findAll();
  // }
  //
  @Get('/user')
  @UseGuards(CommonGaurd)
  findOne(@Req() request) {
    return this.authService.findOne(request.user);
  }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
