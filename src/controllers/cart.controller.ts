import { Request, Response } from "express";
import { CartService } from "../services/cart.service";
import { successResponse, AppError } from "../helpers/response.helper";

export class CartController {
    private cartService: CartService;

    constructor() {
        this.cartService = new CartService();

        // Bind supaya `this` tetap konsisten
        this.create = this.create.bind(this);
        this.getById = this.getById.bind(this);
        this.getByUserId = this.getByUserId.bind(this); // <--- baru
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    // CREATE
    public async create(req: Request, res: Response): Promise<void> {
        const { userId, items } = req.body;
        if (!userId || !Array.isArray(items) || items.length === 0) {
            throw new AppError("UserId and items are required", 400);
        }

        const cart = await this.cartService.create({ userId, items });
        successResponse(res, cart, "Cart created", 201);
    }

    // GET BY ID
    public async getById(req: Request, res: Response): Promise<void> {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new AppError("Invalid cart ID", 400);

        const cart = await this.cartService.getById(id);
        if (!cart) throw new AppError("Cart not found", 404);

        successResponse(res, cart, "Cart retrieved");
    }

    // ✅ GET ALL CART BY USER ID
    public async getByUserId(req: Request, res: Response): Promise<void> {
        const userId = Number(req.params.userId);
        if (isNaN(userId)) throw new AppError("Invalid user ID", 400);

        const carts = await this.cartService.getByUserId(userId);
        successResponse(res, carts, "User carts retrieved");
    }

    // UPDATE
    public async update(req: Request, res: Response): Promise<void> {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new AppError("Invalid cart ID", 400);

        const { userId, items } = req.body;
        if (!userId || !Array.isArray(items) || items.length === 0) {
            throw new AppError("UserId and items are required", 400);
        }

        const updatedCart = await this.cartService.update(id, { userId, items });
        successResponse(res, updatedCart, "Cart updated");
    }

    // DELETE
    public async delete(req: Request, res: Response): Promise<void> {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new AppError("Invalid cart ID", 400);

        await this.cartService.delete(id);
        successResponse(res, null, "Cart deleted");
    }
}
