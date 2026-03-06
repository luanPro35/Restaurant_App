import { IsNotEmpty, IsString, IsEnum, IsNumber } from "class-validator";
import { PAYMENT_METHOD } from "./payment.contant";

export class CreatePaymentDto {
    @IsNotEmpty()
    @IsString()
    orderId!: string;

    @IsNotEmpty()
    @IsEnum(PAYMENT_METHOD)
    method!: PAYMENT_METHOD;

    @IsNotEmpty()
    @IsNumber()
    amount!: number;
}

