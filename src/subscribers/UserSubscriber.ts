import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from "typeorm";
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";
import { User } from "../entities/User";
import { ArgonPasswordHasher } from "../utils/ArgonPasswordHasher";
import { PasswordHasher } from "../utils/PasswordHasher";
import { UserValidator } from "../validators/UserValidator";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
    private readonly passwordHasher: PasswordHasher = new ArgonPasswordHasher();

    listenTo() {
        return User;
    }

    async beforeUpdate({ entity: user, updatedColumns }: UpdateEvent<User>) {
        const updatedFileds = updatedColumns.map((value: ColumnMetadata) => value.propertyName);
        UserValidator.validate(user, updatedFileds);
        if (updatedFileds.includes("password")) {
            user.password = await this.passwordHasher.hash(user.password);
        }
    }

    async beforeInsert({ entity: user }: InsertEvent<User>) {
        UserValidator.validate(user);
        user.password = await this.passwordHasher.hash(user.password);
    }
}
