import { Router } from "express";
import { CartController } from "../controllers/cart.controller";

export class CartRouter {
    private router: Router;
    private cartController: CartController;

    constructor() {
        this.router = Router();
        this.cartController = new CartController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post("/", this.cartController.create);
        this.router.get("/user/:userId", this.cartController.getByUserId);
        this.router.get("/:id", this.cartController.getById);
        this.router.put("/:id", this.cartController.update);
        this.router.delete("/:id", this.cartController.delete);
    }

    public getRouter(): Router {
        return this.router;
    }
}
