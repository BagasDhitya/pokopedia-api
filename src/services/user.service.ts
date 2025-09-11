import { PrismaClient } from "@prisma/client";
import { Database } from "../config/prisma";
import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from "../dto/user.dto";
import bcrypt from "bcrypt";

export class UserService {
    private prisma: PrismaClient

    constructor() {
        this.prisma = new Database().getInstance()
    }
    public async createUser(data: CreateUserDTO): Promise<UserResponseDTO> {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await this.prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                image: data.image,
                role: data.role || "CUSTOMER",
            },
        });

        return {
            id: user.id,
            email: user.email,
            image: user.image ?? undefined,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    public async getAllUsers(): Promise<UserResponseDTO[]> {
        const users = await this.prisma.user.findMany({
            where: { deletedAt: null },
        });

        return users.map((user) => ({
            id: user.id,
            email: user.email,
            image: user.image ?? undefined,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }));
    }

    public async getUserById(id: number): Promise<UserResponseDTO | null> {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user || user.deletedAt) return null;

        return {
            id: user.id,
            email: user.email,
            image: user.image ?? undefined,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    public async updateUser(id: number, data: UpdateUserDTO): Promise<UserResponseDTO | null> {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user || user.deletedAt) return null;

        let hashedPassword = user.password;
        if (data.password) {
            hashedPassword = await bcrypt.hash(data.password, 10);
        }

        const updated = await this.prisma.user.update({
            where: { id },
            data: {
                email: data.email ?? user.email,
                password: hashedPassword,
                image: data.image ?? user.image,
                role: data.role ?? user.role,
            },
        });

        return {
            id: updated.id,
            email: updated.email,
            image: updated.image ?? undefined,
            role: updated.role,
            createdAt: updated.createdAt,
            updatedAt: updated.updatedAt,
        };
    }

    public async deleteUser(id: number): Promise<boolean> {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user || user.deletedAt) return false;

        await this.prisma.user.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
        return true;
    }
}
