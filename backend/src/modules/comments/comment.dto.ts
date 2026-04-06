import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateCommentDto {
    @IsString()
    @IsOptional()
    id?: string;

    @IsString()
    @IsOptional()
    userId?: string;

    @IsString()
    @IsNotEmpty()
    content?: string;

    @IsString()
    @IsOptional()
    imageUrl?: string;

    @IsString()
    @IsOptional()
    createdAt?: string;

    @IsString()
    @IsOptional()
    updatedAt?: string;
}
