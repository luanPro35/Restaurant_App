import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AdminProductService } from "../services/admin-products.service";
import {
  CreateProductDto,
  GetProductsDto,
  UpdateProductDto,
} from "../dtos/admin-products.dto";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Role } from "../../auth/enums/role.enum";

@Controller("admin/products")
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(Role.ADMIN)
export class AdminProductController {
  constructor(private readonly adminProductService: AdminProductService) {}

  @Post()
  create(@Body() data: any) {
    return this.adminProductService.createProduct(data);
  }

  @Get()
  findAll(@Query() query: GetProductsDto) {
    return this.adminProductService.getAllProducts(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.adminProductService.getProductById(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.adminProductService.updateProduct(id, updateProductDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.adminProductService.deleteProduct(id);
  }

  @Patch(":id/availability")
  toggleAvailability(
    @Param("id") id: string,
    @Body("isAvailable") isAvailable: boolean,
  ) {
    return this.adminProductService.toggleAvailability(id, isAvailable);
  }
}
