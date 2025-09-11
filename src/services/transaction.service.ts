import { PrismaClient } from "@prisma/client";
import { Database } from "../config/prisma";
import { CreateTransactionDTO, TransactionResponseDTO } from "../dto/transaction.dto";
import { AppError } from "../helpers/response.helper";

export class TransactionService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new Database().getInstance();
    }

    private generateInvoice(): string {
        // format invoice : PKD-20250911-48390

        const today = new Date()
        const datePart = today.toISOString().split("T")[0].replace(/-/g, ""); // YYYYMMDD
        const randomPart = Math.floor(100000 + Math.random() * 900000) // 6 digit random

        return `PKD-${datePart}-${randomPart}`
    }

    // ✅ Checkout semua cart milik user
    public async create(userId: number): Promise<any> {
        return this.prisma.$transaction(async (tx) => {
            // 1. Ambil semua cart aktif
            const carts = await tx.cart.findMany({
                where: { userId, deletedAt: null },
                include: { CartItem: true },
            });

            if (carts.length === 0) {
                throw new AppError("No active carts found for this user", 404);
            }

            // 2. Hitung total
            const totalAmount = carts.reduce((sum, cart) => sum + cart.totalAmount, 0);

            // 3. Buat transaksi
            const transaction = await tx.transaction.create({
                data: {
                    userId,
                    totalAmount,
                    invoice: this.generateInvoice(),
                    carts: {
                        connect: carts.map((c) => ({ id: c.id })), // relasi ke semua cart
                    },
                },
                include: { carts: { include: { CartItem: true } } },
            });

            // 4. Tandai cart sudah di-checkout (opsional: tambahin kolom `checkedOutAt`)
            await tx.cart.updateMany({
                where: { id: { in: carts.map((c) => c.id) } },
                data: { checkedOutAt: new Date() },
            });

            return {
                id: transaction.id,
                userId: transaction.userId,
                totalAmount: transaction.totalAmount,
                invoice: transaction.invoice,
                carts: transaction.carts.map((cart) => ({
                    id: cart.id,
                    totalAmount: cart.totalAmount,
                    items: cart.CartItem.map((i) => ({
                        productId: i.productId,
                        name: i.name,
                        image: i.image ?? undefined,
                        basePrice: i.basePrice,
                        quantity: i.quantity,
                    })),
                    createdAt: cart.createdAt,
                    updatedAt: cart.updatedAt,
                })),
                createdAt: transaction.createdAt,
                updatedAt: transaction.updatedAt,
            };
        });
    }

    public async getById(id: number): Promise<TransactionResponseDTO | null> {
        return this.prisma.transaction.findUnique({
            where: { id },
            include: { carts: true },
        }) as unknown as TransactionResponseDTO;
    }
}
