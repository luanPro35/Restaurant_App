import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { PackageService } from "./package.service";
import { CreatePackageDto, UpdatePackageDto } from "./package.dto";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../auth/enums/role.enum";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Public } from "../auth/decorators/public.decorator";


@ApiTags("Packages")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("packages")
export class PackageController {
    constructor(private readonly packageService: PackageService) { }

    @Public()
    @Post()
    @ApiOperation({ summary: "Create a new package" })
    create(@CurrentUser() user: any, @Body() createPackageDto: CreatePackageDto) {
        return this.packageService.create({ ...createPackageDto, userId: user?.sub || "admin" });
    }


    @Public()
    @Get("people")
    @ApiOperation({ summary: "Get all packages for admin" })
    findAllPeople() {
        return this.packageService.findAllPackage();
    }

    @Get()
    @ApiOperation({ summary: "Get all packages for current user" })
    findAll(@CurrentUser() user: any) {
        return this.packageService.findAll(user.sub);
    }

    @Get("count")
    @ApiOperation({ summary: "Get count packages for current user" })
    count(@CurrentUser() user: any) {
        return this.packageService.count(user.sub);
    }

    @Public()
    @Get(":id")
    @ApiOperation({ summary: "Get a package by ID" })
    findOne(@Param("id") id: string) {
        return this.packageService.findOne(id);
    }

    @Public()
    @Patch(":id")
    @ApiOperation({ summary: "Update a package" })
    update(@Param("id") id: string, @Body() updatePackageDto: UpdatePackageDto) {
        return this.packageService.update(id, updatePackageDto);
    }

    @Delete(":id")
    @ApiOperation({ summary: "Delete a package" })
    remove(@Param("id") id: string) {
        return this.packageService.delete(id);
    }


}
