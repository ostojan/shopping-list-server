import { User } from "../../src/entities/User";
import { UserSubscriber } from "../../src/subscribers/UserSubscriber";
import { ArgonPasswordHasher } from "../../src/utils/ArgonPasswordHasher";
import {
    anotherValidEmail,
    anotherValidPassword,
    anotherValidUsername,
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
import { expectNotToThrow } from "../test-utils/expectNotToThrow";
import { expectToThrow } from "../test-utils/expectToThrow";

describe("UserSubscriber", () => {
    const passwordHasher = new ArgonPasswordHasher();
    const userSubscriber = new UserSubscriber();

    describe("listenTo", () => {
        it("should return User class", () => {
            expect(userSubscriber.listenTo()).toBe(User);
        });
    });

    describe("handleInput", () => {
        const user = createValidUser();

        it.each`
            description                        | value
            ${"is empty"}                      | ${emptyUsername}
            ${"is shorter than 2 characters"}  | ${tooShortUsername}
            ${"is longer than 255 characters"} | ${tooLongUsername}
        `("should throw an error when user username $description", async ({ value }) => {
            user.username = value;
            await expectToThrow(() => userSubscriber.handleInsert(user));
        });

        it.each`
            description                        | value
            ${"is empty"}                      | ${empytEmail}
            ${"is not an email"}               | ${notAnEmail}
            ${"is longer than 255 characters"} | ${tooLongEmail}
        `("should throw an error when user email $description", async ({ value }) => {
            user.email = value;
            await expectToThrow(() => userSubscriber.handleInsert(user));
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
            await expectToThrow(() => userSubscriber.handleInsert(user));
        });

        it("should not throw an error when all user fields are valid", async () => {
            user.username = anotherValidUsername;
            user.email = anotherValidEmail;
            user.password = anotherValidPassword;
            await expectNotToThrow(() => userSubscriber.handleInsert(user));
        });

        it("should replace user password with hash verifiable by ArgonPasswordHasher", async () => {
            user.password = anotherValidPassword;
            await userSubscriber.handleInsert(user);
            expect(user.password).not.toBe(anotherValidPassword);
            expect(await passwordHasher.verify(anotherValidPassword, user.password)).toBe(true);
        });
    });

    describe("handleUpdate", () => {
        const user = createValidUser();

        const throwAnErrorDescription =
            "should throw an error when user $field $description and $field is passed as updated field";

        it.each`
            description                        | value               | field
            ${"is empty"}                      | ${emptyUsername}    | ${"username"}
            ${"is shorter than 2 characters"}  | ${tooShortUsername} | ${"username"}
            ${"is longer than 255 characters"} | ${tooLongUsername}  | ${"username"}
        `(throwAnErrorDescription, async ({ value, field }) => {
            user.username = value;
            await expectToThrow(() => userSubscriber.handleUpdate(user, [field]));
        });

        it.each`
            description                        | value           | field
            ${"is empty"}                      | ${empytEmail}   | ${"email"}
            ${"is not an email"}               | ${notAnEmail}   | ${"email"}
            ${"is longer than 255 characters"} | ${tooLongEmail} | ${"email"}
        `(throwAnErrorDescription, async ({ value, field }) => {
            user.email = value;
            await expectToThrow(() => userSubscriber.handleUpdate(user, [field]));
        });

        it.each`
            description                           | value                              | field
            ${"is empty"}                         | ${emptyPassword}                   | ${"password"}
            ${"is shorter than 8 characters"}     | ${tooShortPassword}                | ${"password"}
            ${"is longer than 32 characters"}     | ${tooLongPassword}                 | ${"password"}
            ${"contains no lowercase characters"} | ${passwordWithoutLowercase}        | ${"password"}
            ${"contains no uppercase characters"} | ${passwordWithoutUppercase}        | ${"password"}
            ${"contains no number characters"}    | ${passwordWithoutNumber}           | ${"password"}
            ${"contains no special characters"}   | ${passwordWithoutSpecialCharacter} | ${"password"}
        `(throwAnErrorDescription, async ({ value, field }) => {
            user.password = value;
            await expectToThrow(() => userSubscriber.handleUpdate(user, [field]));
        });

        it("should not throw an error when all user fields are valid and all fields are passed as updated fields", async () => {
            user.username = anotherValidUsername;
            user.email = anotherValidEmail;
            user.password = anotherValidPassword;
            await expectNotToThrow(() => userSubscriber.handleUpdate(user, Object.getOwnPropertyNames(user)));
        });

        it("should replace user password with hash verifiable by ArgonPasswordHasher when password is valid and password is passed as updated field", async () => {
            user.password = anotherValidPassword;
            await userSubscriber.handleUpdate(user, ["password"]);
            expect(user.password).not.toBe(anotherValidPassword);
            expect(await passwordHasher.verify(anotherValidPassword, user.password)).toBe(true);
        });
    });
});
