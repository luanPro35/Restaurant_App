import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { OrderService } from "./order.service";
import {
  CreateOrderDto,
  UpdateOrderStatusDto,
  AddItemsToOrderDto,
} from "./order.dto";

@Controller("orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get(":id")
  async getOrderById(@Param("id") id: string) {
    return this.orderService.findById(id);
  }

  @Get("table/:tableId")
  async getOrderByTableId(@Param("tableId") tableId: string) {
    return this.orderService.findActiveOrderByTable(tableId);
  }

  @Patch(":id/status")
  async updateOrderStatus(
    @Param("id") id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateStatus(id, updateOrderStatusDto.status);
  }

  @Patch(":id/add-items")
  async addItemsToOrder(
    @Param("id") id: string,
    @Body() addItemsToOrderDto: AddItemsToOrderDto,
  ) {
    return this.orderService.addItems(id, addItemsToOrderDto.items);
  }
}

