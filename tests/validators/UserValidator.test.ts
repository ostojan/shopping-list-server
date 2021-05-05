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
} from "../fixtures/entities/User";

describe("UserValidator", () => {
    describe("validate", () => {
        describe("without field argument", () => {
            it("should throw an error when user username is empty", () => {
                const user = createValidUser();
                user.username = emptyUsername;
                expect(() => UserValidator.validate(user)).toThrowError();
            });

            it("should throw an error when user username is shorter than 2 characters", () => {
                const user = createValidUser();
                user.username = tooShortUsername;
                expect(() => UserValidator.validate(user)).toThrowError();
            });

            it("should throw an error when user username is longer than 255 characters", () => {
                const user = createValidUser();
                user.username = tooLongUsername;
                expect(() => UserValidator.validate(user)).toThrowError();
            });

            it("should throw an error when user email is empty", () => {
                const user = createValidUser();
                user.email = empytEmail;
                expect(() => UserValidator.validate(user)).toThrowError();
            });

            it("should throw an error when user email is not an email", () => {
                const user = createValidUser();
                user.email = notAnEmail;
                expect(() => UserValidator.validate(user)).toThrowError();
            });

            it("should throw an error when user email is longer than 255 characters", () => {
                const user = createValidUser();
                user.username = tooLongEmail;
                expect(() => UserValidator.validate(user)).toThrowError();
            });

            it("should throw an error when user password is empty", () => {
                const user = createValidUser();
                user.password = emptyPassword;
                expect(() => UserValidator.validate(user)).toThrowError();
            });

            it("should throw an error when user password is shorter than 8 characters", () => {
                const user = createValidUser();
                user.password = tooShortPassword;
                expect(() => UserValidator.validate(user)).toThrowError();
            });

            it("should throw an error when user password is longer than 32 characters", () => {
                const user = createValidUser();
                user.password = tooLongPassword;
                expect(() => UserValidator.validate(user)).toThrowError();
            });

            it("should throw an error when user password contains no lowercase characters", () => {
                const user = createValidUser();
                user.password = passwordWithoutLowercase;
                expect(() => UserValidator.validate(user)).toThrowError();
            });

            it("should throw an error when user password contains no uppercase characters", () => {
                const user = createValidUser();
                user.password = passwordWithoutUppercase;
                expect(() => UserValidator.validate(user)).toThrowError();
            });

            it("should throw an error when user password contains no number characters", () => {
                const user = createValidUser();
                user.password = passwordWithoutNumber;
                expect(() => UserValidator.validate(user)).toThrowError();
            });

            it("should throw an error when user password contains no special characters", () => {
                const user = createValidUser();
                user.password = passwordWithoutSpecialCharacter;
                expect(() => UserValidator.validate(user)).toThrowError();
            });

            it("should not throw an error when all user fields are valid", () => {
                const user = createValidUser();
                expect(() => UserValidator.validate(user)).not.toThrowError();
            });
        });

        describe("with field argument", () => {
            it("should throw an error when user username is invalid and username field is passed", () => {
                const user = createInvalidUser();
                expect(() => UserValidator.validate(user, ["username"])).toThrowError();
            });

            it("should not throw an error when user username is invalid and username field is not passed", () => {
                const user = createInvalidUser();
                expect(() => UserValidator.validate(user, [])).not.toThrowError();
            });

            it("should throw an error when user email is invalid and email field is passed", () => {
                const user = createInvalidUser();
                expect(() => UserValidator.validate(user, ["email"])).toThrowError();
            });

            it("should not throw an error when user email is invalid and email field is not passed", () => {
                const user = createInvalidUser();
                expect(() => UserValidator.validate(user, [])).not.toThrowError();
            });

            it("should throw an error when user password is invalid and password field is passed", () => {
                const user = createInvalidUser();
                expect(() => UserValidator.validate(user, ["password"])).toThrowError();
            });

            it("should not throw an error when user password is invalid and password field is not passed", () => {
                const user = createInvalidUser();
                expect(() => UserValidator.validate(user, [])).not.toThrowError();
            });
        });
    });
});
