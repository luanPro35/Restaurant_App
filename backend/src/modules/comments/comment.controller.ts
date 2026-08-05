import { Controller, Post, Body, Get, Param, Put, Delete, UseInterceptors, UploadedFile, Query, UseGuards, Request } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./comment.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Public } from "../auth/decorators/public.decorator";

@Controller('comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) { }

    @Post()
    @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
    @UseGuards(JwtAuthGuard)
    async createComment(@Body() data: CreateCommentDto, @UploadedFile() file: Express.Multer.File, @Request() req) {
        if (req.user && req.user.sub) {
            data.userId = req.user.sub;
        }
        return this.commentService.createComment(data, file);
    }

    @Public()
    @Get()
    async getComments(@Query() params: any) {
        return this.commentService.getComments(params);
    }

    @Public()
    @Get('user/:userId')
    async getCommentsByUserId(@Param('userId') userId: string) {
        return this.commentService.getCommentsByUserId(userId);
    }

    @Public()
    @Get('count')
    async countComments(@Query() where?: any) {
        return this.commentService.countComments(where);
    }

    @Public()
    @Get(':id')
    async getCommentById(@Param('id') id: string) {
        return this.commentService.getCommentById(id);
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(JwtAuthGuard)
    async updateComment(@Param('id') id: string, @Body() data: Partial<CreateCommentDto>, @UploadedFile() file: Express.Multer.File) {
        return this.commentService.updateComment(id, data, file);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteComment(@Param('id') id: string) {
        return this.commentService.deleteComment(id);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
        return this.commentService.uploadImage(file);
    }

    @Post('send-telegram-notification')
    @UseGuards(JwtAuthGuard)
    async sendTelegramNotification(@Body() data: CreateCommentDto, @Request() req) {
        if (req.user && req.user.sub) {
            data.userId = req.user.sub;
        }
        return this.commentService.sendFeedback(data);
    }
}
