import express, { Application, Request, Response } from 'express'
import { errorResponse } from './helpers/response.helper'

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
        this.app.use('/', (req: Request, res: Response) => {
            res.status(200).send({ message: 'Hello PokoPedia!' })
        })
    }

    public listen(): void {
        this.app.listen(this.port, () => {
            console.log(`Server running at http://localhost:${this.port}`)
        })
    }
}

const server = new App(8000)
server.listen()