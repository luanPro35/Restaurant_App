import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
} from "@nestjs/common";
import { OrderService } from "./order.service";
import {
  CreateOrderDto,
  UpdateOrderStatusDto,
  AddItemsToOrderDto,
} from "./order.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";

@ApiTags("Orders")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a new order for current user" })
  async createOrder(@CurrentUser() user: any, @Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create({ ...createOrderDto, userId: user.sub });
  }

  @Get("my-history")
  @ApiOperation({ summary: "Get order history for current user" })
  async getMyOrders(@CurrentUser() user: any, @Query() query: any) {
    return this.orderService.findAll({ ...query, userId: user.sub });
  }

  @Get(":id")
  @ApiOperation({ summary: "Get order details by ID" })
  async getOrderById(@Param("id") id: string) {
    return this.orderService.findById(id);
  }

  @Get("table/:tableId")
  @ApiOperation({ summary: "Get active order by table ID (limited to current user)" })
  async getOrderByTableId(@Param("tableId") tableId: string, @CurrentUser() user: any) {
    return this.orderService.findActiveOrderByTable(tableId, user.sub);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update order status" })
  async updateOrderStatus(
    @Param("id") id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateStatus(id, updateOrderStatusDto.status);
  }

  @Patch(":id/add-items")
  @ApiOperation({ summary: "Add items to existing order" })
  async addItemsToOrder(
    @Param("id") id: string,
    @Body() addItemsToOrderDto: AddItemsToOrderDto,
  ) {
    return this.orderService.addItems(id, addItemsToOrderDto.items);
  }
}

