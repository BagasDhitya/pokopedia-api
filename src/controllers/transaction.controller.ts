import { Request, Response } from "express";
import { TransactionService } from "../services/transaction.service";
import { successResponse, AppError } from "../helpers/response.helper";

export class TransactionController {
    private transactionService: TransactionService;

    constructor() {
        this.transactionService = new TransactionService();

        this.create = this.create.bind(this);
        this.getById = this.getById.bind(this);
    }

    // ✅ Checkout semua cart milik user
    public async create(req: Request, res: Response): Promise<void> {
        const { userId } = req.body;
        if (!userId) throw new AppError("UserId is required", 400);

        const transaction = await this.transactionService.create(userId);
        successResponse(res, transaction, "Transaction created", 201);
    }

    public async getById(req: Request, res: Response): Promise<void> {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new AppError("Invalid transaction ID", 400);

        const transaction = await this.transactionService.getById(id);
        if (!transaction) throw new AppError("Transaction not found", 404);

        successResponse(res, transaction, "Transaction retrieved");
    }
}
