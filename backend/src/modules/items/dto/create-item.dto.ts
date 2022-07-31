import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from '@nestjs/class-validator';
import { IsNumber } from 'class-validator';

export class CreateItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  price: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  image_link: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
