import { IsNotEmpty, IsString, IsEnum, IsNumber, IsOptional } from "class-validator";
import { PackageStatus } from "./package.contant";
import { PartialType } from "@nestjs/swagger";

export class CreatePackageDto {
    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsNotEmpty()
    @IsString()
    address!: string;

    @IsNotEmpty()
    @IsString()
    description!: string;

    @IsNotEmpty()
    @IsNumber()
    price!: number;

    @IsNotEmpty()
    @IsEnum(PackageStatus)
    status!: PackageStatus;

    @IsOptional()
    @IsString()
    userId?: string;
}

export class UpdatePackageDto extends PartialType(CreatePackageDto) {}

export class DeletePackageDto {
    @IsNotEmpty()
    @IsString()
    id!: string;
}