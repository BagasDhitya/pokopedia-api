import { PrismaClient } from "@prisma/client";
import { Database } from "../config/prisma";
import { CreateCartDTO, CartResponseDTO } from "../dto/cart.dto";
import { AppError } from "../helpers/response.helper";

export class CartService {
    private prisma: PrismaClient

    constructor() {
        this.prisma = new Database().getInstance()
    }

    // CREATE cart + kurangi stok produk
    public async create(data: CreateCartDTO): Promise<CartResponseDTO> {
        return await this.prisma.$transaction(async (tx) => {
            // Kurangi stok produk dulu
            for (const item of data.items) {
                const product = await tx.product.findUnique({
                    where: { id: item.productId },
                });

                if (!product || product.deletedAt) {
                    throw new AppError(`Product with id ${item.productId} not found`, 404);
                }

                if (product.stock < item.quantity) {
                    throw new AppError(`Not enough stock for product ${product.name}`, 400);
                }

                console.log('updating stock', {
                    productId: item.productId,
                    quantity: item.quantity,
                    quantityNumber: Number(item.quantity),
                    isInteger: Number.isInteger(Number(item.quantity)),
                })

                // update stock
                await tx.product.update({
                    where: { id: Number(item.productId) },
                    data: {
                        stock: {
                            decrement: Number(item.quantity),
                        },
                    },
                });
            }

            // Hitung total amount
            const total = data.items.reduce((sum, item) => sum + item.basePrice * item.quantity, 0);

            const cart = await tx.cart.create({
                data: {
                    userId: data.userId,
                    totalAmount: total,
                    CartItem: {
                        create: data.items.map((item) => ({
                            productId: item.productId,
                            name: item.name,
                            image: item.image,
                            basePrice: item.basePrice,
                            quantity: item.quantity,
                        })),
                    },
                },
                include: { CartItem: true },
            });

            return {
                id: cart.id,
                userId: cart.userId,
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
            };
        });
    }

    // GET All Cart by User ID
    public async getByUserId(userId: number): Promise<CartResponseDTO[]> {
        const carts = await this.prisma.cart.findMany({
            where: { userId, deletedAt: null },
            include: { CartItem: true },
            orderBy: { createdAt: "desc" }, // biar cart terbaru muncul di atas
        });

        return carts.map((cart) => ({
            id: cart.id,
            userId: cart.userId,
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
        }));
    }


    // GET Cart by ID
    public async getById(id: number): Promise<CartResponseDTO | null> {
        const cart = await this.prisma.cart.findUnique({
            where: { id },
            include: { CartItem: true },
        });

        if (!cart || cart.deletedAt) return null;

        return {
            id: cart.id,
            userId: cart.userId,
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
        };
    }

    // UPDATE Cart (ganti item → stok produk harus dikembalikan / dikurangi lagi)
    public async update(id: number, data: CreateCartDTO): Promise<CartResponseDTO> {
        return await this.prisma.$transaction(async (tx) => {
            const existingCart = await tx.cart.findUnique({
                where: { id },
                include: { CartItem: true },
            });

            if (!existingCart || existingCart.deletedAt) {
                throw new AppError("Cart not found", 404);
            }

            // kembalikan stok produk lama
            for (const oldItem of existingCart.CartItem) {
                await tx.product.update({
                    where: { id: oldItem.productId },
                    data: { stock: { increment: oldItem.quantity } },
                });
            }

            // hapus item lama
            await tx.cartItem.deleteMany({
                where: { cartId: id },
            });

            // cek stok & kurangi untuk item baru
            for (const item of data.items) {
                const product = await tx.product.findUnique({
                    where: { id: Number(item.productId) },
                });

                if (!product || product.deletedAt) {
                    throw new AppError(`Product with id ${item.productId} not found`, 404);
                }

                if (product.stock < item.quantity) {
                    throw new AppError(`Not enough stock for product ${product.name}`, 400);
                }

                await tx.product.update({
                    where: { id: Number(item.productId) },
                    data: {
                        stock: {
                            decrement: Number(item.quantity),
                        },
                    },
                });


            }

            // hitung ulang total
            const total = data.items.reduce((sum, item) => sum + item.basePrice * item.quantity, 0);

            const updatedCart = await tx.cart.update({
                where: { id },
                data: {
                    totalAmount: total,
                    CartItem: {
                        create: data.items.map((item) => ({
                            productId: item.productId,
                            name: item.name,
                            image: item.image,
                            basePrice: item.basePrice,
                            quantity: item.quantity,
                        })),
                    },
                },
                include: { CartItem: true },
            });

            return {
                id: updatedCart.id,
                userId: updatedCart.userId,
                totalAmount: updatedCart.totalAmount,
                items: updatedCart.CartItem.map((i) => ({
                    productId: i.productId,
                    name: i.name,
                    image: i.image ?? undefined,
                    basePrice: i.basePrice,
                    quantity: i.quantity,
                })),
                createdAt: updatedCart.createdAt,
                updatedAt: updatedCart.updatedAt,
            };
        });
    }

    // DELETE Cart (restore stok produk)
    public async delete(id: number): Promise<void> {
        await this.prisma.$transaction(async (tx) => {
            const cart = await tx.cart.findUnique({
                where: { id },
                include: { CartItem: true },
            });

            if (!cart || cart.deletedAt) {
                throw new AppError("Cart not found", 404);
            }

            // kembalikan stok produk
            for (const item of cart.CartItem) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { increment: item.quantity } },
                });
            }

            // soft delete cart
            await tx.cart.update({
                where: { id },
                data: { deletedAt: new Date() },
            });
        });
    }
}
