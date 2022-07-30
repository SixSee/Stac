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
import { BuyerGaurd } from '../../gaurds/buyer.gaurd';
import { CommonGaurd } from '../../gaurds/common.gaurd';

@Controller('item')
@ApiTags('item')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @UseGuards(BuyerGaurd)
  create(@Body() createItemDto: CreateItemDto, @Req() request) {
    return this.itemsService.create(createItemDto, request.user);
  }
  @Get('/buyer')
  @UseGuards(BuyerGaurd)
  getAllItemByBuyer(@Req() request) {
    return this.itemsService.getByBuyer(request.user);
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
  @UseGuards(BuyerGaurd)
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(id, updateItemDto);
  }

  @Delete(':id')
  @UseGuards(BuyerGaurd)
  remove(@Param('id') id: string) {
    return this.itemsService.remove(id);
  }
}
