import * as argon2 from "argon2";
import { EntityRepository, getConnection, Repository } from "typeorm";
import { ARGON2_SECRET } from "../constants";
import { User } from "../entities/User";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async findByUsernameAndPassword(username: string, password: string): Promise<User | undefined> {
        const userRepository = getConnection().getCustomRepository(UserRepository);
        const user = await userRepository.findOne({ username });
        if (!user) {
            return undefined;
        }
        return (await argon2.verify(user.password, password, { secret: Buffer.from(ARGON2_SECRET) }))
            ? user
            : undefined;
    }
}
