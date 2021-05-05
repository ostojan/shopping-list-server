import validator from "validator";
import { User } from "../entities/User";

export const UserValidator = {
    validate(user: User, fields: string[] = Object.getOwnPropertyNames(user)) {
        fields.forEach((field: string) => {
            switch (field) {
                case "username":
                    if (user.username.length < 2 || user.username.length > 255) {
                        throw Error("Incorrect username");
                    }
                    break;
                case "email":
                    if (!validator.isEmail(user.email)) {
                        throw Error("Incorrect email");
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
                        throw Error("Password does not meet password requirements");
                    }
                    break;
                default:
                    break;
            }
        });
    },
};
