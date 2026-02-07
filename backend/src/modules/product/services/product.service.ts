import { Injectable } from "@nestjs/common";
import { ProductRepository } from "../repositories/product.repository";
import { GetProductsDto } from "../dto/get-products.dto";
import { CreateProductDto } from "../dto/create-product.dto";
import { UpdateProductDto } from "../dto/update-product.dto";

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getAllProducts(query: GetProductsDto) {
    const products = await this.productRepository.findAll(query);
    const total = await this.productRepository.count(query);

    return {
      data: products,
      total,
      page: query.page || 1,
      limit: query.limit || 10,
    };
  }

  async getProductById(id: string) {
    return await this.productRepository.findById(id);
  }

  async createProduct(data: CreateProductDto) {
    return await this.productRepository.create(data);
  }

  async updateProduct(id: string, data: UpdateProductDto) {
    return await this.productRepository.update(id, data);
  }

  async deleteProduct(id: string) {
    return await this.productRepository.delete(id);
  }

  async toggleAvailability(id: string, isAvailable: boolean) {
    return await this.productRepository.updateAvailability(id, isAvailable);
  }
}
