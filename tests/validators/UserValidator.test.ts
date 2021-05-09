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
        const userValidator = new UserValidator();

        describe("validateAllFields", () => {
            let user: User;

            beforeEach(() => {
                user = createValidUser();
            });

            it.each`
                description                        | value               | fieldName
                ${"is empty"}                      | ${emptyUsername}    | ${"username"}
                ${"is shorter than 2 characters"}  | ${tooShortUsername} | ${"username"}
                ${"is longer than 255 characters"} | ${tooLongUsername}  | ${"username"}
            `("should return error for field $fieldName when user $fieldName $description", ({ value, fieldName }) => {
                user.username = value;
                const result = userValidator.validateAllFields(user);
                expect(result).toContainEqual(expect.objectContaining({ field: fieldName }));
            });

            it.each`
                description                        | value           | fieldName
                ${"is empty"}                      | ${empytEmail}   | ${"email"}
                ${"is not an email"}               | ${notAnEmail}   | ${"email"}
                ${"is longer than 255 characters"} | ${tooLongEmail} | ${"email"}
            `("should return error for field $fieldName when user $fieldName $description", ({ value, fieldName }) => {
                user.email = value;
                const result = userValidator.validateAllFields(user);
                expect(result).toContainEqual(expect.objectContaining({ field: fieldName }));
            });

            it.each`
                description                           | value                              | fieldName
                ${"is empty"}                         | ${emptyPassword}                   | ${"password"}
                ${"is shorter than 8 characters"}     | ${tooShortPassword}                | ${"password"}
                ${"is longer than 32 characters"}     | ${tooLongPassword}                 | ${"password"}
                ${"contains no lowercase characters"} | ${passwordWithoutLowercase}        | ${"password"}
                ${"contains no uppercase characters"} | ${passwordWithoutUppercase}        | ${"password"}
                ${"contains no number characters"}    | ${passwordWithoutNumber}           | ${"password"}
                ${"contains no special characters"}   | ${passwordWithoutSpecialCharacter} | ${"password"}
            `("should return error for field $fieldName when user $fieldName $description", ({ value, fieldName }) => {
                user.password = value;
                const result = userValidator.validateAllFields(user);
                expect(result).toContainEqual(expect.objectContaining({ field: fieldName }));
            });

            it.each`
                fieldName
                ${"username"}
                ${"email"}
                ${"password"}
            `("should not return error for field $fieldName when user $fieldName is valid", ({ fieldName }) => {
                const result = userValidator.validateAllFields(user);
                expect(result).not.toContainEqual(expect.objectContaining({ field: fieldName }));
            });

            it("should not return any errors when all user fields are valid", () => {
                const result = userValidator.validateAllFields(user);
                expect(result).toHaveLength(0);
            });
        });

        describe("with field argument", () => {
            let user: User;

            beforeEach(() => {
                user = createInvalidUser();
            });

            it.each`
                fieldName
                ${"username"}
                ${"email"}
                ${"password"}
            `(
                "should return an error for field $fieldName when user $fieldName is invalid and $fieldName field is passed",
                ({ fieldName }) => {
                    const result = userValidator.validateSelectedFields(user, [fieldName]);
                    expect(result).toContainEqual(expect.objectContaining({ field: fieldName }));
                }
            );

            it.each`
                fieldName
                ${"username"}
                ${"email"}
                ${"password"}
            `(
                "should not return an error for field $fieldName when user $fieldName is invalid and $fieldName field is not passed",
                ({ fieldName }) => {
                    const result = userValidator.validateSelectedFields(user, []);
                    expect(result).not.toContainEqual(expect.objectContaining({ field: fieldName }));
                }
            );

            it.each`
                fieldName     | value
                ${"username"} | ${validUsername}
                ${"email"}    | ${validEmail}
                ${"password"} | ${validPassword}
            `(
                "should not return an error for field $fieldName when user $fieldName is valid and $fieldName field is passed",
                ({ value, fieldName }) => {
                    switch (fieldName) {
                        case "username":
                            user.username = value;
                            break;
                        case "email":
                            user.email = value;
                            break;
                        case "password":
                            user.password = value;
                            break;
                    }
                    const result = userValidator.validateSelectedFields(user, [fieldName]);
                    expect(result).not.toContainEqual(expect.objectContaining({ field: fieldName }));
                }
            );

            it("should not return any errors when all user fields are valid and all fields are passed", () => {
                user = createValidUser();
                const result = userValidator.validateSelectedFields(user, Object.getOwnPropertyNames(user));
                expect(result).toHaveLength(0);
            });
        });
    });
});
