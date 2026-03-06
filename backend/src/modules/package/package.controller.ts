import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { PackageService } from "./package.service";
import { CreatePackageDto, UpdatePackageDto } from "./package.dto";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

@ApiTags("Packages")
@Controller("packages")
export class PackageController {
    constructor(private readonly packageService: PackageService) { }

    @Post()
    @ApiOperation({ summary: "Create a new package" })
    create(@Body() createPackageDto: CreatePackageDto) {
        return this.packageService.create(createPackageDto);
    }

    @Get()
    @ApiOperation({ summary: "Get all packages" })
    findAll() {
        return this.packageService.findAll();
    }

    @Get(":id")
    @ApiOperation({ summary: "Get a package by ID" })
    findOne(@Param("id") id: string) {
        return this.packageService.findOne(id);
    }

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
