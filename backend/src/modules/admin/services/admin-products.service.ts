import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { AdminProductRepository } from "../repositories/admin-products.repository";
import { RedisService } from "../../redis/redis.service";
import {
  createProductSchema,
  updateProductSchema,
  getProductsSchema,
  getProductByIdSchema,
  deleteProductSchema,
  toggleAvailabilitySchema,
} from "../../product/validations/product.validation";

@Injectable()
export class AdminProductService {
  private readonly logger = new Logger(AdminProductService.name);

  constructor(
    private readonly adminProductRepository: AdminProductRepository,
    private readonly redisService: RedisService,
  ) {}

  private async clearProductCache() {
    try {
      const client = this.redisService.getClient();
      const keys = await client.keys('products:list:*');
      if (keys.length > 0) {
        await client.del(keys);
        this.logger.log(`Cleared ${keys.length} product list cache keys`);
      }
    } catch (error) {
      this.logger.error("Failed to clear product cache:", error);
    }
  }

  async createProduct(data: any) {
    try {
      const validatedData = createProductSchema.parse(data);
      const product = await this.adminProductRepository.create(validatedData as any);
      await this.clearProductCache();
      return product;
    } catch (error) {
      this.logger.error("Validation failed for creating product:", error);
      if (error instanceof Error && "issues" in error) {
        throw new BadRequestException((error as any).issues);
      }
      throw error;
    }
  }

  async getAllProducts(query: any) {
    try {
      const validatedQuery = getProductsSchema.parse(query);
      const products = await this.adminProductRepository.findAll(
        validatedQuery as any,
      );
      const total = await this.adminProductRepository.count(
        validatedQuery as any,
      );

      return {
        data: products,
        pagination: {
          total,
          page: Number(validatedQuery.page) || 1,
          limit: Number(validatedQuery.limit) || 100,
          totalPages: Math.ceil(total / (Number(validatedQuery.limit) || 100)),
        },
      };
    } catch (error) {
      this.logger.error("Validation failed for getting products:", error);
      throw error;
    }
  }

  async getProductById(id: string) {
    getProductByIdSchema.parse({ id });
    const product = await this.adminProductRepository.findById(id);
    if (!product) {
      throw new NotFoundException("Không tìm thấy sản phẩm");
    }
    return product;
  }

  async updateProduct(id: string, data: any) {
    try {
      await this.getProductById(id);
      const validatedData = updateProductSchema.parse(data);
      const product = await this.adminProductRepository.update(id, validatedData as any);
      await this.clearProductCache();
      return product;
    } catch (error) {
      this.logger.error("Validation failed for updating product:", error);
      throw error;
    }
  }

  async deleteProduct(id: string) {
    deleteProductSchema.parse({ id });
    await this.getProductById(id);
    const result = await this.adminProductRepository.delete(id);
    await this.clearProductCache();
    return result;
  }

  async toggleAvailability(id: string, isAvailable: boolean) {
    const validated = toggleAvailabilitySchema.parse({ id, isAvailable });
    await this.getProductById(validated.id);
    const result = await this.adminProductRepository.updateAvailability(
      validated.id,
      validated.isAvailable,
    );
    await this.clearProductCache();
    return result;
  }
}
