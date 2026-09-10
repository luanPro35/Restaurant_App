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
import { Public } from "../auth/decorators/public.decorator";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";

@ApiTags("Orders")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a new order (optional user)" })
  async createOrder(@CurrentUser() user: any, @Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create({ ...createOrderDto, userId: user?.sub });
  }

  @Public()
  @Get()
  @ApiOperation({ summary: "Get all orders" })
  async getAllOrders(@Query() query: any) {
    return this.orderService.findAll(query);
  }

  @Get("my-history")
  @ApiOperation({ summary: "Get order history for current user" })
  async getMyOrders(@CurrentUser() user: any, @Query() query: any) {
    return this.orderService.findAll({ ...query, userId: user.sub });
  }

  @Public()
  @Get(":id")
  @ApiOperation({ summary: "Get order details by ID" })
  async getOrderById(@Param("id") id: string) {
    return this.orderService.findById(id);
  }

  @Public()
  @Get("table/:tableId")
  @ApiOperation({ summary: "Get active order by table ID" })
  async getOrderByTableId(@Param("tableId") tableId: string, @CurrentUser() user: any) {
    return this.orderService.findActiveOrderByTable(Number(tableId), user?.sub);
  }

  @Public()
  @Patch(":id/status")
  @ApiOperation({ summary: "Update order status" })
  async updateOrderStatus(
    @Param("id") id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateStatus(id, updateOrderStatusDto.status);
  }

  @Public()
  @Patch(":id/add-items")
  @ApiOperation({ summary: "Add items to existing order" })
  async addItemsToOrder(
    @Param("id") id: string,
    @Body() addItemsToOrderDto: AddItemsToOrderDto,
  ) {
    return this.orderService.addItems(id, addItemsToOrderDto.items);
  }
}

