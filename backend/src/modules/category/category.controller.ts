import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

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
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const categories = await this.prisma.category.findMany({
      orderBy: { order: 'asc' },
    });

    await this.redisService.set(cacheKey, JSON.stringify(categories), 3600);

    return categories;
  }
}
