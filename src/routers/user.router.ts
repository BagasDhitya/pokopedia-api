import { Router } from "express";
import { UserController } from "../controllers/user.controller";

export class UserRouter {
    private router: Router;
    private userController: UserController;

    constructor() {
        this.router = Router();
        this.userController = new UserController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post("/", this.userController.create);
        this.router.get("/", this.userController.getAll);
        this.router.get("/:id", this.userController.getById);
        this.router.put("/:id", this.userController.update);
        this.router.delete("/:id", this.userController.delete);
    }

    public getRouter(): Router {
        return this.router;
    }
}
