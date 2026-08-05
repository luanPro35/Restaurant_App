import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateCommentDto } from "./comment.dto";

@Injectable()
export class CommentRepository {
    constructor(private readonly prisma: PrismaService) { }

    async createComment(data: CreateCommentDto) {
        return this.prisma.comment.create({
            data: {
                userId: data.userId,
                content: data.content!,
                imageUrl: data.imageUrl,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });
    }

    async getComments(params?: {
        skip?: number;
        take?: number;
        cursor?: any;
        where?: any;
        orderBy?: any;
    }) {
        const { skip, take, cursor, where, orderBy } = params || {};
        return this.prisma.comment.findMany({
            skip: skip ? Number(skip) : undefined,
            take: take ? Number(take) : undefined,
            cursor,
            where,
            orderBy: orderBy || { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });
    }

    async getCommentById(id: string) {
        return this.prisma.comment.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });
    }

    async getCommentsByUserId(userId: string) {
        const comments = await this.prisma.comment.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        return comments;
    }

    async updateComment(id: string, data: Partial<CreateCommentDto>) {
        return this.prisma.comment.update({
            where: { id },
            data: {
                content: data.content,
                imageUrl: data.imageUrl,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });
    }

    async deleteComment(id: string) {
        return this.prisma.comment.delete({
            where: { id },
        });
    }

    async countComments(where?: any) {
        return this.prisma.comment.count({
            where,
        });
    }

    async sendFeedback(data: CreateCommentDto) {
        return this.prisma.comment.create({
            data: {
                userId: data.userId,
                content: data.content!,
            },
        });
    }

    async getWeeklyComments() {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        return this.prisma.comment.findMany({
            where: {
                createdAt: {
                    gte: sevenDaysAgo,
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
}