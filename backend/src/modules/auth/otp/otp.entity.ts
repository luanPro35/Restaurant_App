import { ApiProperty } from "@nestjs/swagger";

export class OtpEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  otp: string;

  @ApiProperty()
  expiresAt: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<OtpEntity>) {
    Object.assign(this, partial);
  }
}
