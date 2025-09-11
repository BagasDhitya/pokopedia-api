import { PrismaClient } from "@prisma/client";
import { Database } from "../config/prisma";
import { CreateMessageDTO, MessageResponseDTO } from "../dto/message.dto";
import { AppError } from "../helpers/response.helper";

export class ChatService {
    private prisma: PrismaClient

    constructor() {
        this.prisma = new Database().getInstance()
    }

    // simpan pesan baru
    public async create(data: CreateMessageDTO): Promise<MessageResponseDTO> {
        const { content, senderId, receiverId, transactionId } = data

        if (!content.trim()) throw new AppError('Message content cannot be empty', 400)

        const message = await this.prisma.message.create({
            data: {
                content,
                senderId,
                receiverId,
                transactionId
            }
        })

        return {
            id: message.id,
            content: message.content,
            senderId: message.senderId,
            receiverId: message.receiverId,
            transactionId: Number(message.transactionId),
            createdAt: message.createdAt
        }
    }

    // ambil semua pesan berdasarkan transaksi (room)
    public async getMessages(transactionId: number): Promise<any> {
        return this.prisma.message.findMany({
            where: { transactionId },
            orderBy: { createdAt: 'asc' }
        })
    }

    // ambil chat antar 2 user (customer <-> admin)
    public async getConversation(userA: number, userB: number): Promise<any> {
        return this.prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userA, receiverId: userB },
                    { senderId: userB, receiverId: userA }
                ]
            },
            orderBy: { createdAt: 'asc' }
        })
    }
}