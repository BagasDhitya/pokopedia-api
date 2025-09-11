import express, { Application, Request, Response } from 'express'
import { errorResponse } from './helpers/response.helper'

import { ProductRouter } from './routers/product.router'
import { CartRouter } from './routers/cart.router'
import { UserRouter } from './routers/user.router'
import { TransactionRouter } from './routers/transaction.router'

import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { ChatService } from './services/chat.service'

class App {
    private app: Application
    private port: number
    private io?: SocketIOServer

    constructor(port: number) {
        this.app = express()
        this.port = port

        this.initMiddlewares()
        this.initRoutes()
        this.initErrorHandlers()
    }

    private initSocket(server: any): void {
        this.io = new SocketIOServer(server, {
            cors: {
                origin: '*' // buat mempersilahkan diakses oleh browser
            }
        })

        const chatService = new ChatService()

        this.io.on('connection', (socket) => {
            console.log('User connected : ', socket.id)

            // join ke room berdasarkan transactionId (misal room 3)
            socket.on('joinRoom', (transactionId: number) => {
                socket.join(`room-${transactionId}`)
                console.log(`User ${socket.id} joined room-${transactionId}`)
            })

            // kirim pesan
            socket.on('sendMessage', async (msg) => {
                // msg : {content, senderId, receiverId, transactionId}
                const saved = await chatService.create(msg)

                // broadcast ke semua user didalam room
                if (saved.transactionId) {

                    // fallback: kirim direct ke server
                    this.io?.to(saved.receiverId.toString()).emit('newMessage', saved)
                }
            })

            socket.on('disconnect', () => {
                console.log('User disconnected : ', socket.id)
            })
        })
    }

    private initErrorHandlers(): void {
        this.app.use((err: unknown, req: Request, res: Response) => {
            errorResponse(res, err)
        })
    }

    private initMiddlewares(): void {
        this.app.use(express.json())
    }

    private initRoutes(): void {
        this.app.use('/api/products', new ProductRouter().getRouter())
        this.app.use('/api/carts', new CartRouter().getRouter())
        this.app.use('/api/users', new UserRouter().getRouter())
        this.app.use('/api/transactions', new TransactionRouter().getRouter())
    }

    public listen(): void {
        const server = createServer(this.app)
        this.initSocket(server)

        server.listen(this.port, () => {
            console.log(`Server running at http://localhost:${this.port}`)
        })
    }
}

const server = new App(8000)
server.listen()