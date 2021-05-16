import { mocked } from "ts-jest/utils";
import { getCustomRepository } from "typeorm";
import { TypeormUserDataSource } from "../../../src/datasources/typeorm/TypeormUserDataSource";
import { User } from "../../../src/entities/User";
import { createValidUser, validId, validPassword, validUsername } from "../../fixtures/entities/User";
import { expectToThrow } from "../../test-utils/expectToThrow";

jest.mock("typeorm", () => ({
    __esModule: true,
    getCustomRepository: jest.fn(),
    PrimaryGeneratedColumn: jest.fn(),
    Column: jest.fn(),
    CreateDateColumn: jest.fn(),
    UpdateDateColumn: jest.fn(),
    Entity: jest.fn(),
    EntityRepository: jest.fn(),
    Repository: jest.fn(),
}));

describe("TypeormUserDataSource", () => {
    const getCustomRepositoryMock = mocked(getCustomRepository);
    let dataSource: TypeormUserDataSource;

    beforeEach(() => {
        dataSource = new TypeormUserDataSource();
        jest.resetAllMocks();
    });

    describe("findByUsernameAndPassword", () => {
        const MockedRepository = {
            findByUsernameAndPassword: jest.fn(),
        };

        beforeEach(() => {
            getCustomRepositoryMock.mockReturnValue(MockedRepository);
        });

        it("should call getCustomRepository only once", async () => {
            await dataSource.findByUsernameAndPassword(validUsername, validPassword);
            expect(getCustomRepositoryMock).toBeCalledTimes(1);
        });

        it("should call findByUsernameAndPassword on UserRepository only once", async () => {
            await dataSource.findByUsernameAndPassword("username", "password");
            expect(MockedRepository.findByUsernameAndPassword).toBeCalledTimes(1);
        });

        it("should call findByUsernameAndPassword on UserRepository with passed username and password", async () => {
            await dataSource.findByUsernameAndPassword(validUsername, validPassword);
            expect(MockedRepository.findByUsernameAndPassword).toBeCalledWith(validUsername, validPassword);
        });

        it("should return User returned by call findByUsernameAndPassword on UserRepository when it returned User", async () => {
            const user = createValidUser();
            MockedRepository.findByUsernameAndPassword.mockReturnValue(user);
            const result = await dataSource.findByUsernameAndPassword(validUsername, validPassword);
            expect(result).toBe(user);
        });

        it("should return undefined when call findByUsernameAndPassword on UserRepository returned undefined", async () => {
            MockedRepository.findByUsernameAndPassword.mockReturnValue(undefined);
            const result = await dataSource.findByUsernameAndPassword(validUsername, validPassword);
            expect(result).toBeUndefined();
        });
    });

    describe("findById", () => {
        const MockedRepository = {
            findOne: jest.fn(),
        };

        beforeEach(() => {
            getCustomRepositoryMock.mockReturnValue(MockedRepository);
        });

        it("should call getCustomRepository only once", async () => {
            await dataSource.findById(validId);
            expect(getCustomRepositoryMock).toBeCalledTimes(1);
        });

        it("should call findOne on UserRepository only once", async () => {
            await dataSource.findById(validId);
            expect(MockedRepository.findOne).toBeCalledTimes(1);
        });

        it("should call findOne on UserRepository with passed id", async () => {
            await dataSource.findById(validId);
            expect(MockedRepository.findOne).toBeCalledWith(validId);
        });

        it("should return User returned by call findOne on UserRepository when it returned User", async () => {
            const user = createValidUser();
            MockedRepository.findOne.mockReturnValue(user);
            const result = await dataSource.findById(validId);
            expect(result).toBe(user);
        });

        it("should return undefined when call findOne on UserRepository returned undefined", async () => {
            MockedRepository.findOne.mockReturnValue(undefined);
            const result = await dataSource.findById(validId);
            expect(result).toBeUndefined();
        });
    });

    describe("find", () => {
        const MockedRepository = {
            find: jest.fn(),
        };
        const findData: Partial<User> = {
            username: validUsername,
        };

        beforeEach(() => {
            getCustomRepositoryMock.mockReturnValue(MockedRepository);
        });

        it("should call getCustomRepository only once", async () => {
            await dataSource.find(findData);
            expect(getCustomRepositoryMock).toBeCalledTimes(1);
        });

        it("should call find on UserRepository only once", async () => {
            await dataSource.find(findData);
            expect(MockedRepository.find).toBeCalledTimes(1);
        });

        it("should call find on UserRepository with passed data", async () => {
            await dataSource.find(findData);
            expect(MockedRepository.find).toBeCalledWith(findData);
        });

        it("should return Users array returned by call find on UserRepository when it returned Users array", async () => {
            const users = [createValidUser(), createValidUser()];
            MockedRepository.find.mockReturnValue(users);
            const result = await dataSource.find(findData);
            expect(result).toBe(users);
        });

        it("should return empty arry when call find on UserRepository returned empty array", async () => {
            MockedRepository.find.mockReturnValue([]);
            const result = await dataSource.find(findData);
            expect(result).toHaveLength(0);
        });
    });

    describe("insert", () => {
        const MockedRepository = {
            save: jest.fn(),
        };
        const user = createValidUser();

        beforeEach(() => {
            getCustomRepositoryMock.mockReturnValue(MockedRepository);
        });

        it("should call getCustomRepository only once", async () => {
            await dataSource.insert(user);
            expect(getCustomRepositoryMock).toBeCalledTimes(1);
        });

        it("should call save on UserRepository only once", async () => {
            await dataSource.insert(user);
            expect(MockedRepository.save).toBeCalledTimes(1);
        });

        it("should call save on UserRepository with passed data", async () => {
            await dataSource.insert(user);
            expect(MockedRepository.save).toBeCalledWith(user);
        });

        it("should return User returned by call save on UserRepository when it returned User", async () => {
            const newUser = createValidUser();
            MockedRepository.save.mockReturnValue(newUser);
            const result = await dataSource.insert(user);
            expect(result).toBe(newUser);
        });

        it("should throw Error thrown by call save on UserRepository when it thrown Error", async () => {
            const error = new Error("Error");
            MockedRepository.save.mockRejectedValue(error);
            expectToThrow(async () => await dataSource.insert(user), error);
        });
    });

    describe("remove", () => {
        const MockedRepository = {
            remove: jest.fn(),
        };
        const user = createValidUser();

        beforeEach(() => {
            getCustomRepositoryMock.mockReturnValue(MockedRepository);
            MockedRepository.remove.mockReturnValue({});
        });

        it("should call getCustomRepository only once", async () => {
            await dataSource.remove(user);
            expect(getCustomRepositoryMock).toBeCalledTimes(1);
        });

        it("should call delete on UserRepository only once", async () => {
            await dataSource.remove(user);
            expect(MockedRepository.remove).toBeCalledTimes(1);
        });

        it("should call delete on UserRepository with passed user", async () => {
            await dataSource.remove(user);
            expect(MockedRepository.remove).toBeCalledWith(user);
        });

        it("should return User returned by call save on UserRepository when it returned User", async () => {
            const deletedUser = createValidUser();
            MockedRepository.remove.mockReturnValue(deletedUser);
            const result = await dataSource.remove(user);
            expect(result).toBe(deletedUser);
        });

        it("should throw Error thrown by call delete on UserRepository when it thrown Error", async () => {
            const error = new Error("Error");
            MockedRepository.remove.mockRejectedValue(error);
            expectToThrow(async () => await dataSource.remove(user), error);
        });
    });

    describe("update", () => {
        const MockedRepository = {
            save: jest.fn(),
        };
        const user = createValidUser();

        beforeEach(() => {
            getCustomRepositoryMock.mockReturnValue(MockedRepository);
        });

        it("should call getCustomRepository only once", async () => {
            await dataSource.update(user);
            expect(getCustomRepositoryMock).toBeCalledTimes(1);
        });

        it("should call save on UserRepository only once", async () => {
            await dataSource.update(user);
            expect(MockedRepository.save).toBeCalledTimes(1);
        });

        it("should call save on UserRepository with passed data", async () => {
            await dataSource.update(user);
            expect(MockedRepository.save).toBeCalledWith(user);
        });

        it("should return User returned by call save on UserRepository when it returned User", async () => {
            const newUser = createValidUser();
            MockedRepository.save.mockReturnValue(newUser);
            const result = await dataSource.update(user);
            expect(result).toBe(newUser);
        });

        it("should throw Error thrown by call save on UserRepository when it thrown Error", async () => {
            const error = new Error("Error");
            MockedRepository.save.mockRejectedValue(error);
            expectToThrow(async () => await dataSource.update(user), error);
        });
    });
});
