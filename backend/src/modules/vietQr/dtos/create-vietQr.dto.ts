import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateVietQrDto {
  @IsString()
  @IsNotEmpty()
  accountName!: string;

  @IsString()
  @IsNotEmpty()
  bin!: string;

  @IsString()
  @IsNotEmpty()
  accountNumber!: string;

  @IsNumber()
  @IsNotEmpty()
  amount!: number;

  @IsString()
  @IsOptional()
  orderInfo?: string;

  @IsString()
  @IsOptional()
  qrData?: string;

  @IsString()
  @IsOptional()
  orderId?: string;

  @IsString()
  @IsOptional()
  packageId?: string;
}
