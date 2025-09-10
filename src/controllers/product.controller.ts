import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { CreateProductDTO, UpdateProductDTO } from "../dto/product.dto";
import { successResponse, AppError } from "../helpers/response.helper";

export class ProductController {
    private productService: ProductService

    constructor() {
        this.productService = new ProductService()
    }

    public async create(req: Request, res: Response): Promise<void> {
        const { name, image, stock, basePrice }: CreateProductDTO = req.body

        // validasi body request create
        if (!name || stock === undefined || basePrice === undefined) {
            throw new AppError('Name, stock, and basePrice are required', 404)
        }

        const product = await this.productService.create({ name, image, stock, basePrice })
        successResponse(res, product, 'Product created', 201)
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params
        const { name, image, stock, basePrice }: UpdateProductDTO = req.body

        // validasi ID yang masuk harus number
        if (isNaN(Number(id))) throw new AppError('Invalid product ID', 404)

        const updated = await this.productService.update(Number(id), { name, image, stock, basePrice })

        // validasi jika produk tidak ada
        if (!updated) throw new AppError('Product not found', 404)

        successResponse(res, updated, 'Product updated', 201)
    }

    public async getAll(req: Request, res: Response): Promise<void> {
        const products = await this.productService.getAll()
        successResponse(res, products, 'Products retrieved')
    }

    public async getById(req: Request, res: Response): Promise<void> {
        const { id } = req.params

        // validasi ID yang masuk harus number
        if (isNaN(Number(id))) throw new AppError('Invalid product ID', 404)

        const product = await this.productService.getById(Number(id))

        // validasi jika produk tidak ada
        if (!product) throw new AppError('Product not found', 404)

        successResponse(res, product, 'Product retrieved', 200)
    }
}