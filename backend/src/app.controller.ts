import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Req,
} from '@nestjs/common';
import { AppService } from './app.service';

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from '@nestjs/class-validator';
import { IsNumber } from 'class-validator';
import { CreateOrderDto } from './modules/orders/dto/create-order.dto';

export class readingDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  'x-axis': number;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  'y-axis': number;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  'z-axis': number;
}

@Controller('')
export class AppController {
  x_axis;
  y_axis;
  z_axis;
  constructor(private readonly appService: AppService) {}
  @Get()
  getHello(): string {
    return 'Api server running';
  }

  @Post('/stac/readings')
  postReadings(@Body() readingDTO: readingDto, @Req() request) {
    console.log(readingDTO);
    this.z_axis = readingDTO['z-axis'];
    this.y_axis = readingDTO['y-axis'];
    this.z_axis = readingDTO['z-axis'];
    throw new HttpException('Success', 200);
  }
  @Get('/latest/readings')
  getReadings() {
    return {
      'x-axis': this.x_axis,
      'y-axis': this.y_axis,
      'z-axis': this.z_axis,
    };
  }
}
