import { Injectable } from "@nestjs/common";
import { ProductRepository } from "../repositories/product.repository";
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
  constructor(private readonly productRepository: ProductRepository) {}

  async getAllProducts(query: GetProductsInput) {
    const validatedQuery = getProductsSchema.parse(query);
    const products = await this.productRepository.findAll(
      validatedQuery as any,
    );
    const total = await this.productRepository.count(validatedQuery as any);

    return {
      data: products,
      total,
      page: validatedQuery.page || 1,
      limit: validatedQuery.limit || 100,
    };
  }

  async getProductById(id: string) {
    getProductByIdSchema.parse({ id });
    return await this.productRepository.findById(id);
  }

  async createProduct(data: CreateProductInput) {
    const validatedData = createProductSchema.parse(data);
    return await this.productRepository.create(validatedData as any);
  }

  async updateProduct(id: string, data: UpdateProductInput) {
    const validatedData = updateProductSchema.parse(data);
    return await this.productRepository.update(id, validatedData as any);
  }

  async deleteProduct(id: string) {
    deleteProductSchema.parse({ id });
    return await this.productRepository.delete(id);
  }

  async toggleAvailability(id: string, isAvailable: boolean) {
    const validated = toggleAvailabilitySchema.parse({ id, isAvailable });
    return await this.productRepository.updateAvailability(
      validated.id,
      validated.isAvailable,
    );
  }
}
