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
        await this.handleUpdate(
            user,
            updatedColumns.map((value: ColumnMetadata) => value.propertyName)
        );
    }

    async handleUpdate(user: User, updatedFields: string[]) {
        UserValidator.validate(user, updatedFields);
        if (updatedFields.includes("password")) {
            user.password = await this.passwordHasher.hash(user.password);
        }
    }

    async beforeInsert({ entity: user }: InsertEvent<User>) {
        await this.handleInsert(user);
    }

    async handleInsert(user: User) {
        UserValidator.validate(user);
        user.password = await this.passwordHasher.hash(user.password);
    }
}
