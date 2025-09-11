import express, { Application, Request, Response } from 'express'
import { errorResponse } from './helpers/response.helper'

import { ProductRouter } from './routers/product.router'
import { CartRouter } from './routers/cart.router'
import { UserRouter } from './routers/user.router'
import { TransactionRouter } from './routers/transaction.router'

class App {
    private app: Application
    private port: number

    constructor(port: number) {
        this.app = express()
        this.port = port

        this.initMiddlewares()
        this.initRoutes()
        this.initErrorHandlers()
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
        this.app.listen(this.port, () => {
            console.log(`Server running at http://localhost:${this.port}`)
        })
    }
}

const server = new App(8000)
server.listen()