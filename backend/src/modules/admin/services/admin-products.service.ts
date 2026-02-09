import { Injectable, NotFoundException } from "@nestjs/common";
import {
  CreateProductDto,
  GetProductsDto,
  UpdateProductDto,
} from "../dtos/admin-products.dto";
import { AdminProductRepository } from "../repositories/admin-products.repository";

@Injectable()
export class AdminProductService {
  constructor(
    private readonly adminProductRepository: AdminProductRepository,
  ) {}

  async createProduct(createProductDto: CreateProductDto) {
    return this.adminProductRepository.create(createProductDto);
  }

  async getAllProducts(query: GetProductsDto) {
    const products = await this.adminProductRepository.findAll(query);
    const total = await this.adminProductRepository.count(query);

    return {
      data: products,
      pagination: {
        total,
        page: Number(query.page) || 1,
        limit: Number(query.limit) || 10,
        totalPages: Math.ceil(total / (Number(query.limit) || 10)),
      },
    };
  }

  async getProductById(id: string) {
    const product = await this.adminProductRepository.findById(id);
    if (!product) {
      throw new NotFoundException("Không tìm thấy sản phẩm");
    }
    return product;
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    await this.getProductById(id);
    return this.adminProductRepository.update(id, updateProductDto);
  }

  async deleteProduct(id: string) {
    await this.getProductById(id);
    return this.adminProductRepository.delete(id);
  }

  async toggleAvailability(id: string, isAvailable: boolean) {
    await this.getProductById(id);
    return this.adminProductRepository.updateAvailability(id, isAvailable);
  }
}
