import { User } from "../entities/User";
import { GenericDataSource } from "./GenericDataSource";

export interface UserDataSource extends GenericDataSource<User> {
    findByUsernameAndPassword(username: string, password: string): Promise<User | undefined>;
}
