import { Repository } from "typeorm";
import "typeorm/repository/Repository";
import { UserRepository } from "../../src/repositories/UserRepository";
import { ArgonPasswordHasher } from "../../src/utils/ArgonPasswordHasher";
import {
    anotherValidPassword,
    anotherValidUsername,
    createValidUser,
    validPassword,
    validUsername,
} from "../fixtures/entities/User";

describe("UserRepository", () => {
    const findOneMock = jest.fn();
    const verifyMock = jest.fn();
    let userRepository: UserRepository;

    beforeAll(() => {
        jest.mock("typeorm/repository/Repository");
        Repository.prototype.findOne = findOneMock;
        jest.mock("../../src/utils/ArgonPasswordHasher");
        ArgonPasswordHasher.prototype.verify = verifyMock;
    });

    beforeEach(async () => {
        userRepository = new UserRepository();
        jest.resetAllMocks();
    });

    describe("findByUsernameAndPassword", () => {
        it("should call findOne only once", async () => {
            await userRepository.findByUsernameAndPassword(validUsername, validPassword);
            expect(findOneMock).toBeCalledTimes(1);
        });

        it("should call findOne with passed username", async () => {
            await userRepository.findByUsernameAndPassword(validUsername, validPassword);
            expect(findOneMock).toBeCalledWith({ username: validUsername });
        });

        it("should not call verify on PasswordHasher when findOne returned undefined", async () => {
            findOneMock.mockResolvedValue(undefined);
            await userRepository.findByUsernameAndPassword(anotherValidUsername, anotherValidPassword);
            expect(verifyMock).not.toBeCalled();
        });

        it("should return undefined when findOne returned undefined", async () => {
            findOneMock.mockResolvedValue(undefined);
            const user = await userRepository.findByUsernameAndPassword(anotherValidUsername, anotherValidPassword);
            expect(user).toBe(undefined);
        });

        it("should call verify on PasswordHasher only once when findOne returned user", async () => {
            findOneMock.mockResolvedValue(createValidUser());
            await userRepository.findByUsernameAndPassword(anotherValidUsername, anotherValidPassword);
            expect(verifyMock).toBeCalledTimes(1);
        });

        it("should call verify on PasswordHasher with passed password and password value of user returned by findOne when findOne returned user", async () => {
            const findOneUser = createValidUser();
            findOneMock.mockResolvedValue(findOneUser);
            await userRepository.findByUsernameAndPassword(anotherValidUsername, anotherValidPassword);
            expect(verifyMock).toBeCalledWith(anotherValidPassword, findOneUser.password);
        });

        it("should return undefined when findOne returned user and PasswordHasher verify returned false", async () => {
            verifyMock.mockResolvedValue(false);
            findOneMock.mockResolvedValue(createValidUser());
            const user = await userRepository.findByUsernameAndPassword(validUsername, anotherValidPassword);
            expect(user).toBe(undefined);
        });

        it("should return user returned by findOne when findOne returned user and PasswordHasher verify returned true", async () => {
            verifyMock.mockResolvedValue(true);
            const findOneUser = createValidUser();
            findOneMock.mockResolvedValue(createValidUser());
            const user = await userRepository.findByUsernameAndPassword(validUsername, anotherValidPassword);
            expect(user).toEqual(findOneUser);
        });
    });
});
