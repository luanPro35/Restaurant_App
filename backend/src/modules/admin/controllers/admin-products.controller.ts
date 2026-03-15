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
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
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
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from "@nestjs/swagger";
import { CloudinaryService } from "../../../cloudinary/cloudinary.service";

@ApiTags("Admin / Products")
@ApiBearerAuth()
@Controller("admin/products")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.STAFF)
export class AdminProductController {
  constructor(
    private readonly adminProductService: AdminProductService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Upload ảnh sản phẩm lên Cloudinary" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const url = await this.cloudinaryService.uploadFile(file);
    return { url };
  }

  @Post()
  @ApiOperation({ summary: "Tạo sản phẩm mới" })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: "Sản phẩm được tạo thành công" })
  create(@Body() data: CreateProductDto) {
    return this.adminProductService.createProduct(data);
  }

  @Get()
  @ApiOperation({ summary: "Lấy danh sách sản phẩm" })
  @ApiResponse({ status: 200, description: "Danh sách sản phẩm" })
  findAll(@Query() query: GetProductsDto) {
    return this.adminProductService.getAllProducts(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Lấy chi tiết sản phẩm theo ID" })
  @ApiParam({ name: "id", description: "ID của sản phẩm" })
  @ApiResponse({ status: 200, description: "Thông tin sản phẩm" })
  @ApiResponse({ status: 404, description: "Không tìm thấy sản phẩm" })
  findOne(@Param("id") id: string) {
    return this.adminProductService.getProductById(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Cập nhật sản phẩm" })
  @ApiParam({ name: "id", description: "ID của sản phẩm" })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: "Sản phẩm được cập nhật thành công",
  })
  update(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.adminProductService.updateProduct(id, updateProductDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Xóa sản phẩm" })
  @ApiParam({ name: "id", description: "ID của sản phẩm" })
  @ApiResponse({ status: 200, description: "Sản phẩm được xóa thành công" })
  remove(@Param("id") id: string) {
    return this.adminProductService.deleteProduct(id);
  }

  @Patch(":id/availability")
  @ApiOperation({ summary: "Bật/tắt trạng thái có sẵn của sản phẩm" })
  @ApiParam({ name: "id", description: "ID của sản phẩm" })
  @ApiBody({ schema: { properties: { isAvailable: { type: "boolean" } } } })
  @ApiResponse({ status: 200, description: "Cập nhật trạng thái thành công" })
  toggleAvailability(
    @Param("id") id: string,
    @Body("isAvailable") isAvailable: boolean,
  ) {
    return this.adminProductService.toggleAvailability(id, isAvailable);
  }
}
