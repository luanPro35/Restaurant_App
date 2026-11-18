import { IsNotEmpty, IsString, IsEnum, IsNumber, IsOptional, MaxLength } from "class-validator";
import { PackageStatus } from "./package.contant";
import { PartialType } from "@nestjs/swagger";

export class CreatePackageDto {
    @IsOptional()
    @IsString()
    @MaxLength(500)
    note?: string;
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

    @IsOptional()
    @IsString()
    status?: string;

    @IsNotEmpty()
    @IsString()
    paymentMethod!: string;

    @IsOptional()
    @IsString()
    userId?: string;
}

export class UpdatePackageDto {
    @IsOptional()
    @IsString()
    @MaxLength(500)
    note?: string;
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    price?: number;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsString()
    paymentMethod?: string;

    @IsOptional()
    @IsString()
    userId?: string;
}

export class DeletePackageDto {
    @IsNotEmpty()
    @IsString()
    id!: string;
}
