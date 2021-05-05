import * as argon2 from "argon2";
import { getConnection } from "typeorm";
import { ARGON2_SECRET } from "../../src/constants";
import { User } from "../../src/entities/User";
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
import { dbHelper } from "../utils/dbHelper";
import { expectNotToThrow } from "../utils/expectNotToThrow";
import { expectToThrow } from "../utils/expectToThrow";

beforeEach(async () => {
    await dbHelper.createConnection();
    await dbHelper.clearDatabase();
});

afterEach(async () => {
    await dbHelper.closeConnection();
});

describe("UserSubscriber", () => {
    describe("beforeInsert", () => {
        it("should throw an error when user username is empty", async () => {
            const user = createValidUser();
            user.username = emptyUsername;
            const userRepository = getConnection().getRepository(User);
            await expectToThrow(() => userRepository.save(user));
        });

        it("should throw an error when user username is shorter than 2 characters", async () => {
            const user = createValidUser();
            user.username = tooShortUsername;
            const userRepository = getConnection().getRepository(User);
            await expectToThrow(() => userRepository.save(user));
        });

        it("should throw an error when user username is longer than 255 characters", async () => {
            const user = createValidUser();
            user.username = tooLongUsername;
            const userRepository = getConnection().getRepository(User);
            await expectToThrow(() => userRepository.save(user));
        });

        it("should throw an error when user email is empty", async () => {
            const user = createValidUser();
            user.email = empytEmail;
            const userRepository = getConnection().getRepository(User);
            await expectToThrow(() => userRepository.save(user));
        });

        it("should throw an error when user email is not an email", async () => {
            const user = createValidUser();
            user.email = notAnEmail;
            const userRepository = getConnection().getRepository(User);
            await expectToThrow(() => userRepository.save(user));
        });

        it("should throw an error when user email is longer than 255 characters", async () => {
            const user = createValidUser();
            user.email = tooLongEmail;
            const userRepository = getConnection().getRepository(User);
            await expectToThrow(() => userRepository.save(user));
        });

        it("should throw an error when user password is empty", async () => {
            const user = createValidUser();
            user.password = emptyPassword;
            const userRepository = getConnection().getRepository(User);
            await expectToThrow(() => userRepository.save(user));
        });

        it("should throw an error when user password is shorter than 8 characters", async () => {
            const user = createValidUser();
            user.password = tooShortPassword;
            const userRepository = getConnection().getRepository(User);
            await expectToThrow(() => userRepository.save(user));
        });

        it("should throw an error when user password is longer than 32 characters", async () => {
            const user = createValidUser();
            user.password = tooLongPassword;
            const userRepository = getConnection().getRepository(User);
            await expectToThrow(() => userRepository.save(user));
        });

        it("should throw an error when user password contains no lowercase characters", async () => {
            const user = createValidUser();
            user.password = passwordWithoutLowercase;
            const userRepository = getConnection().getRepository(User);
            await expectToThrow(() => userRepository.save(user));
        });

        it("should throw an error when user password contains no uppercase characters", async () => {
            const user = createValidUser();
            user.password = passwordWithoutUppercase;
            const userRepository = getConnection().getRepository(User);
            await expectToThrow(() => userRepository.save(user));
        });

        it("should throw an error when user password contains no number characters", async () => {
            const user = createValidUser();
            user.password = passwordWithoutNumber;
            const userRepository = getConnection().getRepository(User);
            await expectToThrow(() => userRepository.save(user));
        });

        it("should throw an error when user password contains no special characters", async () => {
            const user = createValidUser();
            user.password = passwordWithoutSpecialCharacter;
            const userRepository = getConnection().getRepository(User);
            await expectToThrow(() => userRepository.save(user));
        });

        it("should throw an error when all user fields are valid", async () => {
            const user = createValidUser();
            const userRepository = getConnection().getRepository(User);
            await expectNotToThrow(() => userRepository.save(user));
        });

        it("should not store password in plaintext", async () => {
            const user = createValidUser();
            const plaintextPassword = user.password;
            const userRepository = getConnection().getRepository(User);
            await userRepository.save(user);
            expect(user.password).not.toBe(plaintextPassword);
        });

        it("should store password as a string verifiable by Argon2", async () => {
            const user = createValidUser();
            const plaintextPassword = user.password;
            const userRepository = getConnection().getRepository(User);
            await userRepository.save(user);
            expect(await argon2.verify(user.password, plaintextPassword, { secret: Buffer.from(ARGON2_SECRET) })).toBe(
                true
            );
        });
    });

    describe("beforeUpdate", () => {
        let user: User;

        beforeEach(async () => {
            user = await saveValidUser();
        });

        it("should throw an error when user username is empty", async () => {
            user.username = emptyUsername;
            const userRepository = getConnection().getRepository(User);
            await expectToThrow(() => userRepository.save(user));
        });

        it("should throw an error when user username is shorter than 2 characters", async () => {
            user.username = tooShortUsername;
            const userRepository = getConnection().getRepository(User);
            await expectToThrow(() => userRepository.save(user));
        });

        it("should throw an error when user username is longer than 255 characters", async () => {
            user.username = tooLongUsername;
            const userRepository = getConnection().getRepository(User);
            await expectToThrow(() => userRepository.save(user));
        });

        it("should throw an error when user email is empty", async () => {
            user.email = empytEmail;
            const userRepository = getConnection().getRepository(User);
            await expectToThrow(() => userRepository.save(user));
        });

        it("should throw an error when user email is not an email", async () => {
            user.email = notAnEmail;
            const userRepository = getConnection().getRepository(User);
            await expectToThrow(() => userRepository.save(user));
        });

        it("should throw an error when user email is longer than 255 characters", async () => {
            user.email = tooLongEmail;
            const userRepository = getConnection().getRepository(User);
            await expectToThrow(() => userRepository.save(user));
        });

        it("should throw an error when user password is empty", async () => {
            user.password = emptyPassword;
            const userRepository = getConnection().getRepository(User);
            await expectToThrow(() => userRepository.save(user));
        });

        it("should throw an error when user password is shorter than 8 characters", async () => {
            user.password = tooShortPassword;
            const userRepository = getConnection().getRepository(User);
            await expectToThrow(() => userRepository.save(user));
        });

        it("should throw an error when user password is longer than 32 characters", async () => {
            user.password = tooLongPassword;
            const userRepository = getConnection().getRepository(User);
            await expectToThrow(() => userRepository.save(user));
        });

        it("should throw an error when user password contains no lowercase characters", async () => {
            user.password = passwordWithoutLowercase;
            const userRepository = getConnection().getRepository(User);
            await expectToThrow(() => userRepository.save(user));
        });

        it("should throw an error when user password contains no uppercase characters", async () => {
            user.password = passwordWithoutUppercase;
            const userRepository = getConnection().getRepository(User);
            await expectToThrow(() => userRepository.save(user));
        });

        it("should throw an error when user password contains no number characters", async () => {
            user.password = passwordWithoutNumber;
            const userRepository = getConnection().getRepository(User);
            await expectToThrow(() => userRepository.save(user));
        });

        it("should throw an error when user password contains no special characters", async () => {
            user.password = passwordWithoutSpecialCharacter;
            const userRepository = getConnection().getRepository(User);
            await expectToThrow(() => userRepository.save(user));
        });

        it("should throw an error when all user fields are valid", async () => {
            user.username = anotherValidUsername;
            user.email = anotherValidEmail;
            user.password = anotherValidPassword;
            const userRepository = getConnection().getRepository(User);
            await expectNotToThrow(() => userRepository.save(user));
        });

        it("should not store password in plaintext", async () => {
            user.password = anotherValidPassword;
            const userRepository = getConnection().getRepository(User);
            await userRepository.save(user);
            expect(user.password).not.toBe(anotherValidPassword);
        });

        it("should store password as a string verifiable by Argon2", async () => {
            user.password = anotherValidPassword;
            const userRepository = getConnection().getRepository(User);
            await userRepository.save(user);
            expect(
                await argon2.verify(user.password, anotherValidPassword, { secret: Buffer.from(ARGON2_SECRET) })
            ).toBe(true);
        });
    });
});
