import { Request, Response, Router } from "express";
import { getCustomRepository } from "typeorm";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";

const UserRouter = Router();

UserRouter.post("/users", async ({ body }: Request, res: Response) => {
    try {
        const userRepository = getCustomRepository(UserRepository);
        const user = userRepository.create({ ...body } as User);
        await userRepository.save(user);
        res.send(user.toJSON());
    } catch (error) {
        res.status(400).send();
    }
});

export default UserRouter;
