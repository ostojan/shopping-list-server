import validator from "validator";
import { User } from "../entities/User";
import { EntityValidator, ValidationError } from "./EntityValidator";

export class UserValidator implements EntityValidator<User> {
    validateAllFields(user: User): ValidationError[] {
        return this.validateSelectedFields(user, Object.getOwnPropertyNames(user));
    }

    validateSelectedFields(user: User, fields: string[]): ValidationError[] {
        const errors: ValidationError[] = [];

        fields.forEach((field: string) => {
            switch (field) {
                case "username":
                    if (user.username.length < 2 || user.username.length > 255) {
                        errors.push({ field, message: "Incorrect username" });
                    }
                    break;
                case "email":
                    if (!validator.isEmail(user.email)) {
                        errors.push({ field, message: "Incorrect email" });
                    }
                    break;
                case "password":
                    if (
                        !validator.isStrongPassword(user.password, {
                            minLength: 8,
                            minLowercase: 1,
                            minUppercase: 1,
                            minNumbers: 1,
                            minSymbols: 1,
                        }) ||
                        user.password.length > 32
                    ) {
                        errors.push({ field, message: "Password does not meet password requirements" });
                    }
                    break;
            }
        });

        return errors;
    }
}
