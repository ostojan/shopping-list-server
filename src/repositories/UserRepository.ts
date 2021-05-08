import { EntityRepository, Repository } from "typeorm";
import { User } from "../entities/User";
import { ArgonPasswordHasher } from "../utils/ArgonPasswordHasher";
import { PasswordHasher } from "../utils/PasswordHasher";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    private readonly passwordHasher: PasswordHasher = new ArgonPasswordHasher();

    async findByUsernameAndPassword(username: string, password: string): Promise<User | undefined> {
        const user = await this.findOne({ username });
        if (!user) {
            return undefined;
        }
        return (await this.passwordHasher.verify(password, user.password)) ? user : undefined;
    }
}
