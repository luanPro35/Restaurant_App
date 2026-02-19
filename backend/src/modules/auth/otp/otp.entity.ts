import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";

export class OtpEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @Exclude()
  @ApiProperty()
  otp!: string;

  @ApiProperty()
  expiresAt!: Date;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  constructor(partial: Partial<OtpEntity>) {
    Object.assign(this, partial);
  }
}
