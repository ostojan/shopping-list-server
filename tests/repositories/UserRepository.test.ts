import { getConnection } from "typeorm";
import { UserRepository } from "../../src/repositories/UserRepository";
import {
    anotherValidPassword,
    anotherValidUsername,
    saveValidUser,
    validPassword,
    validUsername,
} from "../fixtures/entities/User";
import { dbHelper } from "../utils/dbHelper";

beforeEach(async () => {
    await dbHelper.createConnection();
    await dbHelper.clearDatabase();
});

afterEach(async () => {
    await dbHelper.closeConnection();
});

describe("UserRepository", () => {
    describe("findByUsernameAndPassword", () => {
        let userRepository: UserRepository;

        beforeEach(async () => {
            await saveValidUser();
            userRepository = getConnection().getCustomRepository(UserRepository);
        });

        it("should return undefined when there is no user with provided username", async () => {
            const user = await userRepository.findByUsernameAndPassword(anotherValidUsername, anotherValidPassword);
            expect(user).toBe(undefined);
        });

        it("should return undefined when user has different password than provided", async () => {
            const user = await userRepository.findByUsernameAndPassword(validUsername, anotherValidPassword);
            expect(user).toBe(undefined);
        });

        it("should return user when both provided username and password are valid", async () => {
            const user = await userRepository.findByUsernameAndPassword(validUsername, validPassword);
            expect(user).not.toBe(undefined);
        });
    });
});
