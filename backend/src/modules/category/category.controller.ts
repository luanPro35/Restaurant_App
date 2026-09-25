import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  async findAll() {
    const cacheKey = 'categories:all';

    const cachedData = await this.redisService.get(cacheKey);
    if (typeof cachedData === 'string') {
      return JSON.parse(cachedData);
    }

    const categories = await this.prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    await this.redisService.set(cacheKey, JSON.stringify(categories), 3600);

    return categories;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiParam({ name: 'id', description: 'ID của danh mục' })
  async findOne(@Param('id') id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            isAvailable: true,
          },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Không tìm thấy danh mục với ID: ${id}`);
    }

    return category;
  }

  @Post()
  @ApiOperation({ summary: 'Create new category' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        image: { type: 'string' },
        order: { type: 'number' },
        slug: { type: 'string' },
      },
      required: ['name'],
    },
  })
  async create(
    @Body()
    body: {
      name: string;
      description?: string;
      image?: string;
      order?: number;
      slug?: string;
    }
  ) {
    if (!body.name || !body.name.trim()) {
      throw new BadRequestException('Tên danh mục không được để trống');
    }

    const existing = await this.prisma.category.findUnique({
      where: { name: body.name.trim() },
    });
    if (existing) {
      throw new BadRequestException(`Danh mục "${body.name}" đã tồn tại`);
    }

    const slug =
      body.slug?.trim() ||
      body.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');

    const newCategory = await this.prisma.category.create({
      data: {
        name: body.name.trim(),
        description: body.description?.trim() || null,
        image: body.image?.trim() || null,
        order: body.order !== undefined ? Number(body.order) : 0,
        slug,
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    await this.redisService.del('categories:all');
    return newCategory;
  }

  @Put(':id')
  @Patch(':id')
  @ApiOperation({ summary: 'Update category' })
  @ApiParam({ name: 'id', description: 'ID của danh mục' })
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      description?: string;
      image?: string;
      order?: number;
      slug?: string;
    }
  ) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Không tìm thấy danh mục với ID: ${id}`);
    }

    if (body.name && body.name.trim() !== category.name) {
      const existing = await this.prisma.category.findUnique({
        where: { name: body.name.trim() },
      });
      if (existing) {
        throw new BadRequestException(
          `Tên danh mục "${body.name}" đã được sử dụng`
        );
      }
    }

    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name.trim() }),
        ...(body.description !== undefined && {
          description: body.description?.trim() || null,
        }),
        ...(body.image !== undefined && { image: body.image?.trim() || null }),
        ...(body.order !== undefined && { order: Number(body.order) || 0 }),
        ...(body.slug !== undefined && { slug: body.slug?.trim() || null }),
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    await this.redisService.del('categories:all');
    return updatedCategory;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category' })
  @ApiParam({ name: 'id', description: 'ID của danh mục' })
  async delete(@Param('id') id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Không tìm thấy danh mục với ID: ${id}`);
    }

    if (category._count.products > 0) {
      throw new BadRequestException(
        `Không thể xóa danh mục này vì đang có ${category._count.products} món ăn liên kết. Vui lòng chuyển hoặc xóa các món ăn trước!`
      );
    }

    await this.prisma.category.delete({
      where: { id },
    });

    await this.redisService.del('categories:all');
    return { success: true, message: 'Đã xóa danh mục thành công' };
  }
}

