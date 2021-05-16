import { User } from "src/entities/User";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../../repositories/UserRepository";
import { UserDataSource } from "../UserDataSource";

export class TypeormUserDataSource implements UserDataSource {
    async findByUsernameAndPassword(username: string, password: string): Promise<User | undefined> {
        return await this.getRepository().findByUsernameAndPassword(username, password);
    }

    async findById(id: any): Promise<User | undefined> {
        return await this.getRepository().findOne(id);
    }

    async find(params: Partial<User>): Promise<User[]> {
        return await this.getRepository().find(params);
    }

    async insert(body: Partial<User>): Promise<User> {
        return await this.getRepository().save(body);
    }

    async remove(entity: User): Promise<User> {
        return await this.getRepository().remove(entity);
    }

    async update(entity: User): Promise<User> {
        return await this.getRepository().save(entity);
    }

    private getRepository(): UserRepository {
        return getCustomRepository(UserRepository);
    }
}
