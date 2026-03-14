import { IsNotEmpty, IsString, IsEnum, IsNumber, IsOptional } from "class-validator";
import { PAYMENT_METHOD } from "./payment.contant";

export class CreatePaymentDto {
    @IsOptional()
    @IsString()
    orderId?: string;

    @IsOptional()
    @IsString()
    packageId?: string;

    @IsNotEmpty()
    @IsEnum(PAYMENT_METHOD)
    method!: PAYMENT_METHOD;

    @IsNotEmpty()
    @IsNumber()
    amount!: number;

    @IsOptional()
    @IsString()
    userId?: string;

    @IsOptional()
    @IsString()
    status?: string;
}

