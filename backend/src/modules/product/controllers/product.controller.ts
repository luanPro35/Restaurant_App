import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { ProductService } from "../services/product.service";
import { CreateProductDto } from "../dto/create-product.dto";
import { UpdateProductDto } from "../dto/update-product.dto";
import { GetProductsDto } from "../dto/get-products.dto";
import { CloudinaryService } from "cloudinary/cloudinary.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { UseInterceptors } from "@nestjs/common";

@Controller("products")
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor("image"))
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @Get()
  findAll(@Query() query: GetProductsDto) {
    return this.productService.getAllProducts(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.productService.getProductById(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.productService.deleteProduct(id);
  }

  @Patch(":id/availability")
  toggleAvailability(
    @Param("id") id: string,
    @Body("isAvailable") isAvailable: boolean,
  ) {
    return this.productService.toggleAvailability(id, isAvailable);
  }
}
