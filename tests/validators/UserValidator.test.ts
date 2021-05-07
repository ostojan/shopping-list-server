import { User } from "../../src/entities/User";
import { UserValidator } from "../../src/validators/UserValidator";
import {
    createInvalidUser,
    createValidUser,
    emptyPassword,
    emptyUsername,
    empytEmail,
    notAnEmail,
    passwordWithoutLowercase,
    passwordWithoutNumber,
    passwordWithoutSpecialCharacter,
    passwordWithoutUppercase,
    tooLongEmail,
    tooLongPassword,
    tooLongUsername,
    tooShortPassword,
    tooShortUsername,
    validEmail,
    validPassword,
    validUsername,
} from "../fixtures/entities/User";

describe("UserValidator", () => {
    describe("validate", () => {
        describe("without field argument", () => {
            let user: User;

            beforeEach(() => {
                user = createValidUser();
            });

            it.each`
                description                        | value
                ${"is empty"}                      | ${emptyUsername}
                ${"is shorter than 2 characters"}  | ${tooShortUsername}
                ${"is longer than 255 characters"} | ${tooLongUsername}
            `("should throw an error when user username $description", ({ value }) => {
                user.username = value;
                expect(() => UserValidator.validate(user)).toThrowError();
            });

            it.each`
                description                        | value
                ${"is empty"}                      | ${empytEmail}
                ${"is not an email"}               | ${notAnEmail}
                ${"is longer than 255 characters"} | ${tooLongEmail}
            `("should throw an error when user email $description", ({ value }) => {
                user.email = value;
                expect(() => UserValidator.validate(user)).toThrowError();
            });

            it.each`
                description                           | value
                ${"is empty"}                         | ${emptyPassword}
                ${"is shorter than 8 characters"}     | ${tooShortPassword}
                ${"is longer than 32 characters"}     | ${tooLongPassword}
                ${"contains no lowercase characters"} | ${passwordWithoutLowercase}
                ${"contains no uppercase characters"} | ${passwordWithoutUppercase}
                ${"contains no number characters"}    | ${passwordWithoutNumber}
                ${"contains no special characters"}   | ${passwordWithoutSpecialCharacter}
            `("should throw an error when user password $description", async ({ value }) => {
                user.password = value;
                expect(() => UserValidator.validate(user)).toThrowError();
            });

            it("should not throw an error when all user fields are valid", () => {
                expect(() => UserValidator.validate(user)).not.toThrowError();
            });
        });

        describe("with field argument", () => {
            let user: User;

            beforeEach(() => {
                user = createInvalidUser();
            });

            it.each`
                field
                ${"username"}
                ${"email"}
                ${"password"}
            `("should throw an error when user $field is invalid and $field field is passed", ({ field }) => {
                expect(() => UserValidator.validate(user, [field])).toThrowError();
            });

            it.each`
                field
                ${"username"}
                ${"email"}
                ${"password"}
            `("should not throw an error when user $field is invalid and $field field is not passed", () => {
                expect(() => UserValidator.validate(user, [])).not.toThrowError();
            });

            it("should not throw an error when user username is valid and username field is passed", () => {
                user.username = validUsername;
                expect(() => UserValidator.validate(user, ["username"])).not.toThrowError();
            });

            it("should not throw an error when user email is valid and email field is passed", () => {
                user.email = validEmail;
                expect(() => UserValidator.validate(user, ["email"])).not.toThrowError();
            });

            it("should not throw an error when user password is valid and password field is passed", () => {
                user.password = validPassword;
                expect(() => UserValidator.validate(user, ["password"])).not.toThrowError();
            });
        });
    });
});
