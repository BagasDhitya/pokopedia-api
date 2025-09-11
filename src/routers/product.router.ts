import { Router } from "express";
import { ProductController } from "../controllers/product.controller";

export class ProductRouter {
    private router: Router;
    private productController: ProductController;

    constructor() {
        this.router = Router();
        this.productController = new ProductController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post("/", this.productController.create);
        this.router.get("/", this.productController.getAll);
        this.router.get("/:id", this.productController.getById);
        this.router.put("/:id", this.productController.update);
        this.router.delete("/:id", this.productController.delete);
    }

    public getRouter(): Router {
        return this.router;
    }
}
