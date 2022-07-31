import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ApiTags } from '@nestjs/swagger';
import { CommonGaurd } from '../../gaurds/common.gaurd';
import { SellerGaurd } from '../../gaurds/seller.gaurd';

@Controller('item')
@ApiTags('item')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @UseGuards(SellerGaurd)
  create(@Body() createItemDto: CreateItemDto, @Req() request) {
    return this.itemsService.create(createItemDto, request.user);
  }
  @Get('/seller')
  @UseGuards(SellerGaurd)
  getAllItemBySeller(@Req() request) {
    return this.itemsService.getBySeller(request.user);
  }
  @Get()
  @UseGuards(CommonGaurd)
  findAll() {
    return this.itemsService.findAll();
  }

  @Get(':id')
  @UseGuards(CommonGaurd)
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(SellerGaurd)
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(id, updateItemDto);
  }

  @Delete(':id')
  @UseGuards(SellerGaurd)
  remove(@Param('id') id: string) {
    return this.itemsService.remove(id);
  }
}
