import { Database } from "../config/prisma";
import { PrismaClient } from "@prisma/client";
import { CreateProductDTO, UpdateProductDTO, ProductResponseDTO } from "../dto/product.dto";

export class ProductService {
    private prisma: PrismaClient

    constructor() {
        this.prisma = new Database().getInstance()
    }

    public async create(data: CreateProductDTO): Promise<ProductResponseDTO> {
        const product = await this.prisma.product.create({ data })
        return product
    }

    public async update(id: number, data: UpdateProductDTO): Promise<ProductResponseDTO | null> {
        const product = await this.prisma.product.findUnique({
            where: { id }
        })

        if (!product || product?.deletedAt) return null
        return this.prisma.product.update({
            where: { id },
            data
        })
    }

    public async getAll(): Promise<ProductResponseDTO[]> {
        return await this.prisma.product.findMany({
            where: {
                deletedAt: null
            }
        })
    }

    public async getById(id: number): Promise<ProductResponseDTO | null> {
        const product = await this.prisma.product.findUnique({
            where: { id }
        })

        if (!product || product?.deletedAt) return null
        return product
    }
}