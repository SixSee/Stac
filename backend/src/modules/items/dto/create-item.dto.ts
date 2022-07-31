import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from '@nestjs/class-validator';
import { IsInt, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

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
  @IsOptional()
  image_link: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  quantity: number;
}
