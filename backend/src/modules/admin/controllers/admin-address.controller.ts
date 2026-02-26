import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { AdminAddressService } from "../services/admin-address.service";
import { CreateAddressDto, UpdateAddressDto } from "../dtos/admin-address.dto";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("Address")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("address")
export class AddressController {
  constructor(private readonly addressService: AdminAddressService) {}

  @Post()
  @ApiOperation({ summary: "Create a new address" })
  create(@CurrentUser() user: any, @Body() createAddressDto: CreateAddressDto) {
    const userId = user.sub || user.id;
    return this.addressService.create(userId, createAddressDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all addresses of the current user" })
  findAll(@CurrentUser() user: any) {
    const userId = user.sub || user.id;
    return this.addressService.findAll(userId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a specific address by ID" })
  findOne(@Param("id") id: string) {
    return this.addressService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update an address" })
  update(@Param("id") id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(id, updateAddressDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete an address" })
  remove(@Param("id") id: string) {
    return this.addressService.remove(id);
  }
}
