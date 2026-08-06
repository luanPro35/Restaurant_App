import { Injectable } from "@nestjs/common";
import { ProductRepository } from "../repositories/product.repository";
import { RedisService } from "../../redis/redis.service";
import { z } from "zod";
import {
  createProductSchema,
  updateProductSchema,
  getProductsSchema,
  getProductByIdSchema,
  deleteProductSchema,
  toggleAvailabilitySchema,
} from "../validations/product.validation";

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type GetProductsInput = z.infer<typeof getProductsSchema>;
export type GetProductByIdInput = z.infer<typeof getProductByIdSchema>;
export type DeleteProductInput = z.infer<typeof deleteProductSchema>;
export type ToggleAvailabilityInput = z.infer<typeof toggleAvailabilitySchema>;

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly redisService: RedisService
  ) {}

  async getAllProducts(query: GetProductsInput) {
    const validatedQuery = getProductsSchema.parse(query);
    
    const cacheKey = `products:list:${JSON.stringify(validatedQuery)}`;
    
    const cachedData = await this.redisService.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const products = await this.productRepository.findAll(
      validatedQuery as any,
    );
    const total = await this.productRepository.count(validatedQuery as any);

    const result = {
      data: products,
      total,
      page: validatedQuery.page || 1,
      limit: validatedQuery.limit || 100,
    };

    await this.redisService.set(cacheKey, JSON.stringify(result), 600);

    return result;
  }

  async getProductById(id: string) {
    getProductByIdSchema.parse({ id });
    return await this.productRepository.findById(id);
  }

  async createProduct(data: CreateProductInput) {
    const validatedData = createProductSchema.parse(data);
    
    await this.clearProductCache();
    
    return await this.productRepository.create(validatedData as any);
  }

  async updateProduct(id: string, data: UpdateProductInput) {
    const validatedData = updateProductSchema.parse(data);
    
    await this.clearProductCache();
    
    return await this.productRepository.update(id, validatedData as any);
  }

  async deleteProduct(id: string) {
    deleteProductSchema.parse({ id });
    
    await this.clearProductCache();
    
    return await this.productRepository.delete(id);
  }

  async toggleAvailability(id: string, isAvailable: boolean) {
    const validated = toggleAvailabilitySchema.parse({ id, isAvailable });
    
    await this.clearProductCache();
    
    return await this.productRepository.updateAvailability(
      validated.id,
      validated.isAvailable,
    );
  }

  private async clearProductCache() {
    const client = this.redisService.getClient();
    const keys = await client.keys('products:list:*');
    if (keys.length > 0) {
      await client.del(keys);
    }
  }
}
