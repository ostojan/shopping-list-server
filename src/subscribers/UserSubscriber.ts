import { EntityValidator } from "src/validators/EntityValidator";
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from "typeorm";
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";
import { User } from "../entities/User";
import { ArgonPasswordHasher } from "../utils/ArgonPasswordHasher";
import { PasswordHasher } from "../utils/PasswordHasher";
import { UserValidator } from "../validators/UserValidator";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
    private readonly userValidator: EntityValidator<User> = new UserValidator();
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
        const errors = this.userValidator.validateSelectedFields(user, updatedFields);
        if (errors.length !== 0) {
            throw new Error();
        }
        if (updatedFields.includes("password")) {
            user.password = await this.passwordHasher.hash(user.password);
        }
    }

    async beforeInsert({ entity: user }: InsertEvent<User>) {
        await this.handleInsert(user);
    }

    async handleInsert(user: User) {
        const errors = this.userValidator.validateAllFields(user);
        if (errors.length !== 0) {
            throw new Error();
        }
        user.password = await this.passwordHasher.hash(user.password);
    }
}
