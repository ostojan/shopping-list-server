import request from "supertest";
import { mocked } from "ts-jest/utils";
import { getCustomRepository } from "typeorm";
import app from "../../src/app";

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

describe("UserRouter", () => {
    const getCustomRepositoryMock = mocked(getCustomRepository);
    const MockedRepository = {
        create: jest.fn(),
        save: jest.fn(),
    };
    const MockedEntity = {
        toJSON: jest.fn(),
    };

    beforeEach(() => {
        jest.resetAllMocks();
        getCustomRepositoryMock.mockReturnValueOnce(MockedRepository);
    });

    describe("POST /users", () => {
        const path = "/users";

        it("should call getCustomRepository only once", async () => {
            await request(app).post(path).send();
            expect(getCustomRepositoryMock).toBeCalledTimes(1);
        });

        it("should call create on UserRepository only once", async () => {
            await request(app).post(path).send();
            expect(MockedRepository.create).toBeCalledTimes(1);
        });

        it("should call create on UserRepository with passed data", async () => {
            const data = { data: "data" };
            await request(app).post(path).send(data);
            expect(MockedRepository.create).toBeCalledWith(data);
        });

        it("should call save on UserRepository only once", async () => {
            await request(app).post(path).send();
            expect(MockedRepository.save).toBeCalledTimes(1);
        });

        it("should call save on UserRepository with value returned by call create on UserRepository", async () => {
            MockedRepository.create.mockReturnValue(MockedEntity);
            await request(app).post(path).send();
            expect(MockedRepository.save).toBeCalledWith(MockedEntity);
        });

        it("should resonse with status 400 when call save on UserRepository threw error", async () => {
            MockedRepository.save.mockRejectedValue(new Error());
            await request(app).post(path).send().expect(400);
        });

        it("should call toJSON on User only once when call save on UserRepository returned User", async () => {
            MockedRepository.create.mockReturnValue(MockedEntity);
            await request(app).post(path).send();
            expect(MockedEntity.toJSON).toBeCalledTimes(1);
        });

        it("should send value retruned by call toJSON on User when call save on UserRepository returned User", async () => {
            const jsonData = { data: "data" };
            MockedRepository.create.mockReturnValue(MockedEntity);
            MockedEntity.toJSON.mockReturnValue(jsonData);
            const { body } = await request(app).post(path).send();
            expect(body).toEqual(jsonData);
        });

        it("should resonse with status 200 when call save on UserRepository returned User", async () => {
            MockedRepository.create.mockReturnValue(MockedEntity);
            await request(app).post(path).send().expect(200);
        });
    });
});
