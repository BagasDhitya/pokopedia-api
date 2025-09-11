import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { successResponse, AppError } from "../helpers/response.helper";

export class UserController {
    private userService: UserService

    constructor() {
        this.userService = new UserService()

        this.create = this.create.bind(this)
        this.update = this.update.bind(this)
        this.delete = this.delete.bind(this)
        this.getAll = this.getAll.bind(this)
        this.getById = this.getById.bind(this)
    }
    public async create(req: Request, res: Response): Promise<void> {
        const { email, password, image, role } = req.body;
        if (!email || !password) throw new AppError("Email and password are required", 400);

        const user = await this.userService.createUser({ email, password, image, role });
        successResponse(res, user, "User created", 201);
    }

    public async getAll(req: Request, res: Response): Promise<void> {
        const users = await this.userService.getAllUsers();
        successResponse(res, users, "Users retrieved");
    }

    public async getById(req: Request, res: Response): Promise<void> {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new AppError("Invalid user ID", 400);

        const user = await this.userService.getUserById(id);
        if (!user) throw new AppError("User not found", 404);

        successResponse(res, user, "User retrieved");
    }

    public async update(req: Request, res: Response): Promise<void> {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new AppError("Invalid user ID", 400);

        const updated = await this.userService.updateUser(id, req.body);
        if (!updated) throw new AppError("User not found", 404);

        successResponse(res, updated, "User updated");
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new AppError("Invalid user ID", 400);

        const deleted = await this.userService.deleteUser(id);
        if (!deleted) throw new AppError("User not found", 404);

        successResponse(res, null, "User deleted");
    }
}
