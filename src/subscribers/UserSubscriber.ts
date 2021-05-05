import * as argon2 from "argon2";
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from "typeorm";
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";
import { ARGON2_SECRET } from "../constants";
import { User } from "../entities/User";
import { UserValidator } from "../validators/UserValidator";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
    listenTo() {
        return User;
    }

    async beforeUpdate({ entity: user, updatedColumns }: UpdateEvent<User>) {
        const updatedFileds = updatedColumns.map((value: ColumnMetadata) => value.propertyName);
        UserValidator.validate(user, updatedFileds);
        if (updatedFileds.includes("password")) {
            user.password = await this.hashPassword(user.password);
        }
    }

    async beforeInsert({ entity: user }: InsertEvent<User>) {
        UserValidator.validate(user);
        user.password = await this.hashPassword(user.password);
    }

    async hashPassword(password: string): Promise<string> {
        return argon2.hash(password, { secret: Buffer.from(ARGON2_SECRET) });
    }
}
