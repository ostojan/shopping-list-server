import { Request, Response, Router } from "express";
import { getCustomRepository } from "typeorm";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";

const UserRouter = Router();

export default UserRouter;
