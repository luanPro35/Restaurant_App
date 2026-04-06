import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";
import { CommentRepository } from "./comment.repository";
import { PrismaModule } from "../../prisma/prisma.module";
import { CloudinaryModule } from "../../cloudinary/cloudinary.module";

@Module({
    imports: [
        PrismaModule, 
        CloudinaryModule,
        MulterModule.register({
            storage: memoryStorage(),
        }),
    ],
    controllers: [CommentController],
    providers: [CommentService, CommentRepository],
    exports: [CommentService],
})
export class CommentModule { }
