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
import { IsBoolean, IsNumber } from 'class-validator';
import { CreateOrderDto } from './modules/orders/dto/create-order.dto';
import { OrdersService } from './modules/orders/orders.service';

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
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  'inspectionNeeded': boolean;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  'device_id': string;
}

@Controller('')
export class AppController {
  x_axis;
  y_axis;
  z_axis;
  constructor(
    private readonly appService: AppService,
    private readonly orderService: OrdersService,
  ) {}
  @Get()
  getHello(): string {
    return 'Api server running';
  }

  @Post('/stac/readings')
  async postReadings(@Body() readingDTO: readingDto, @Req() request) {
    console.log(readingDTO);
    this.z_axis = readingDTO['z-axis'];
    this.y_axis = readingDTO['y-axis'];
    this.z_axis = readingDTO['z-axis'];
    if (readingDTO.inspectionNeeded)
      await this.orderService.toggleInspectionNeeded(readingDTO.device_id);
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
