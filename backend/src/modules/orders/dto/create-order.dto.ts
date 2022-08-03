import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from '@nestjs/class-validator';
import { IsBoolean, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  itemId: string;
}

export class VerifyOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  token: string;
}

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
