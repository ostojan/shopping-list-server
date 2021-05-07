import * as argon2 from "argon2";
import { getConnection } from "typeorm";
import { ARGON2_SECRET } from "../../src/constants";
import { User } from "../../src/entities/User";
import { UserRepository } from "../../src/repositories/UserRepository";
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
    saveValidUser,
    tooLongEmail,
    tooLongPassword,
    tooLongUsername,
    tooShortPassword,
    tooShortUsername,
} from "../fixtures/entities/User";
import { expectNotToThrow } from "../test-utils/expectNotToThrow";
import { expectToThrow } from "../test-utils/expectToThrow";
import "../test-utils/setupDatabase";

describe("UserSubscriber", () => {
    let userRepository: UserRepository;

    beforeEach(async () => {
        userRepository = getConnection().getCustomRepository(UserRepository);
        await userRepository.delete({});
    });

    describe.each`
        method            | createUser
        ${"beforeInsert"} | ${createValidUser}
        ${"beforeUpdate"} | ${saveValidUser}
    `("$method", ({ createUser }) => {
        let user: User;

        beforeEach(async () => {
            user = await createUser();
        });

        it.each`
            description                        | value
            ${"is empty"}                      | ${emptyUsername}
            ${"is shorter than 2 characters"}  | ${tooShortUsername}
            ${"is longer than 255 characters"} | ${tooLongUsername}
        `("should throw an error when user username $description", async ({ value }) => {
            user.username = value;
            await expectToThrow(() => userRepository.save(user));
        });

        it.each`
            description                        | value
            ${"is empty"}                      | ${empytEmail}
            ${"is not an email"}               | ${notAnEmail}
            ${"is longer than 255 characters"} | ${tooLongEmail}
        `("should throw an error when user email $description", async ({ value }) => {
            user.email = value;
            await expectToThrow(() => userRepository.save(user));
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
            await expectToThrow(() => userRepository.save(user));
        });

        it("should not throw an error when all user fields are valid", async () => {
            user.username = anotherValidUsername;
            user.email = anotherValidEmail;
            user.password = anotherValidPassword;
            await expectNotToThrow(() => userRepository.save(user));
        });

        it("should not store password in plaintext", async () => {
            user.password = anotherValidPassword;
            await userRepository.save(user);
            expect(user.password).not.toBe(anotherValidPassword);
        });

        it("should store password as a string verifiable by Argon2", async () => {
            user.password = anotherValidPassword;
            await userRepository.save(user);
            expect(
                await argon2.verify(user.password, anotherValidPassword, { secret: Buffer.from(ARGON2_SECRET) })
            ).toBe(true);
        });
    });
});
