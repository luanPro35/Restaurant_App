import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from "@nestjs/common";
import { AdminPromotionService } from "../services/admin-promotion.service";
import {
  GetPromotionsDto,
  CreatePromotionDto,
  UpdatePromotionDto,
} from "../dtos/admin-promotion.dto";
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
} from "@nestjs/swagger";

@ApiTags("Admin / Promotions")
@Controller("admin/promotions")
@UseInterceptors(ClassSerializerInterceptor)
export class AdminPromotionController {
  constructor(private readonly adminPromotionService: AdminPromotionService) {}

  @Get()
  @ApiOperation({
    summary: "Lấy danh sách khuyến mãi (có phân trang và tìm kiếm)",
  })
  @ApiResponse({
    status: 200,
    description: "Danh sách khuyến mãi",
  })
  findAll(@Query() query: GetPromotionsDto) {
    return this.adminPromotionService.getPromotions(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Lấy chi tiết một khuyến mãi theo ID" })
  @ApiParam({ name: "id", description: "ID của khuyến mãi cần lấy" })
  @ApiResponse({ status: 200, description: "Thông tin chi tiết khuyến mãi" })
  @ApiResponse({ status: 404, description: "Không tìm thấy khuyến mãi" })
  findOne(@Param("id") id: string) {
    return this.adminPromotionService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Tạo khuyến mãi mới" })
  @ApiBody({ type: CreatePromotionDto })
  @ApiResponse({
    status: 201,
    description: "Khuyến mãi đã được tạo thành công",
  })
  create(@Body() createPromotionDto: CreatePromotionDto) {
    return this.adminPromotionService.createPromotion(createPromotionDto);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Cập nhật thông tin khuyến mãi" })
  @ApiParam({ name: "id", description: "ID của khuyến mãi cần cập nhật" })
  @ApiBody({ type: UpdatePromotionDto })
  @ApiResponse({
    status: 200,
    description: "Thông tin khuyến mãi đã được cập nhật",
  })
  update(
    @Param("id") id: string,
    @Body() updatePromotionDto: UpdatePromotionDto,
  ) {
    updatePromotionDto.id = id;
    return this.adminPromotionService.updatePromotion(updatePromotionDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Xóa khuyến mãi" })
  @ApiParam({ name: "id", description: "ID của khuyến mãi cần xóa" })
  @ApiResponse({
    status: 200,
    description: "Khuyến mãi đã được xóa thành công",
  })
  remove(@Param("id") id: string) {
    return this.adminPromotionService.deletePromotion({ id });
  }
}
