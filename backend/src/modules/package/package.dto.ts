import { IsNotEmpty, IsString, IsEnum, IsNumber, IsDate, IsBoolean } from "class-validator";
import { PackageStatus } from "./package.contant";

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
}

export class UpdatePackageDto {
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
}

export class DeletePackageDto {
    @IsNotEmpty()
    @IsString()
    id!: string;
}