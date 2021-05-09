import { User } from "../../src/entities/User";
import { UserSubscriber } from "../../src/subscribers/UserSubscriber";
import { ArgonPasswordHasher } from "../../src/utils/ArgonPasswordHasher";
import { ValidationError } from "../../src/validators/EntityValidator";
import { UserValidator } from "../../src/validators/UserValidator";
import { createValidUser } from "../fixtures/entities/User";
import { expectNotToThrow } from "../test-utils/expectNotToThrow";
import { expectToThrow } from "../test-utils/expectToThrow";

describe("UserSubscriber", () => {
    const validateAllMock = jest.fn();
    const validateSelectedMock = jest.fn();
    const hashMock = jest.fn();
    const validateError: ValidationError[] = [{ field: "field", message: "error" }];
    let userSubscriber: UserSubscriber;
    let user: User;

    beforeAll(() => {
        jest.mock("../../src/validators/UserValidator");
        UserValidator.prototype.validateAllFields = validateAllMock;
        UserValidator.prototype.validateSelectedFields = validateSelectedMock;
        jest.mock("../../src/utils/ArgonPasswordHasher");
        ArgonPasswordHasher.prototype.hash = hashMock;
    });

    beforeEach(() => {
        userSubscriber = new UserSubscriber();
        user = createValidUser();
        jest.resetAllMocks();
    });

    describe("listenTo", () => {
        it("should return User class", () => {
            expect(userSubscriber.listenTo()).toBe(User);
        });
    });

    describe("handleInsert", () => {
        it("should call validateAllFields on EntityValidator only once", async () => {
            try {
                await userSubscriber.handleInsert(user);
            } catch {
            } finally {
                expect(validateAllMock).toBeCalledTimes(1);
            }
        });

        it("should call validateAllFields on EntityValidator with passed user", async () => {
            try {
                await userSubscriber.handleInsert(user);
            } catch {
            } finally {
                expect(validateAllMock).toBeCalledWith(user);
            }
        });

        it("should not call hash on PasswordHasher when validateAllFields on EntityValidator returned any error", async () => {
            try {
                validateAllMock.mockReturnValue(validateError);
                await userSubscriber.handleInsert(user);
            } catch {
            } finally {
                expect(hashMock).not.toBeCalled();
            }
        });

        it("should throw Error when validateAllFields on EntityValidator returned any error", async () => {
            validateAllMock.mockReturnValue(validateError);
            expectToThrow(() => userSubscriber.handleInsert(user));
        });

        it("should not throw Error when validateAllFields on EntityValidator returned no errors", async () => {
            validateAllMock.mockReturnValue([]);
            expectNotToThrow(() => userSubscriber.handleInsert(user));
        });

        it("should call hash on PasswordHaser only once when validateAllFields on EntityValidator returned no errors", async () => {
            validateAllMock.mockReturnValue([]);
            await userSubscriber.handleInsert(user);
            expect(hashMock).toBeCalledTimes(1);
        });

        it("should call hash on PasswordHaser with passed username password when validateAllFields on EntityValidator returned no errors", async () => {
            validateAllMock.mockReturnValue([]);
            const password = user.password;
            await userSubscriber.handleInsert(user);
            expect(hashMock).toBeCalledWith(password);
        });

        it("should store returned value of call of hash on PasswordHasher as user password when validateAllFields on EntityValidator returned no errors", async () => {
            validateAllMock.mockReturnValue([]);
            const hash = "hash";
            hashMock.mockResolvedValue(hash);
            await userSubscriber.handleInsert(user);
            expect(user.password).toBe(hash);
        });
    });

    describe("handleUpdate", () => {
        let fields: string[];

        beforeEach(() => {
            fields = ["fields"];
        });

        it("should call validateSelectedFields on EntityValidator only once", async () => {
            try {
                await userSubscriber.handleUpdate(user, fields);
            } catch {
            } finally {
                expect(validateSelectedMock).toBeCalledTimes(1);
            }
        });

        it("should call validateSelectedFields on EntityValidator with passed user and fields", async () => {
            try {
                await userSubscriber.handleUpdate(user, fields);
            } catch {
            } finally {
                expect(validateSelectedMock).toBeCalledWith(user, fields);
            }
        });

        it("should not call hash on PasswordHasher when validateSelectedFields on EntityValidator returned any error", async () => {
            try {
                validateSelectedMock.mockReturnValue(validateError);
                await userSubscriber.handleUpdate(user, fields);
            } catch {
            } finally {
                expect(hashMock).not.toBeCalled();
            }
        });

        it("should throw Error when validateSelectedFields on EntityValidator returned any error", async () => {
            validateSelectedMock.mockReturnValue(validateError);
            expectToThrow(() => userSubscriber.handleUpdate(user, fields));
        });

        it("should not throw Error when validateSelectedFields on EntityValidator returned no errors", async () => {
            validateSelectedMock.mockReturnValue([]);
            expectNotToThrow(() => userSubscriber.handleUpdate(user, fields));
        });

        it("should not call hash on PasswordHasher when validateSelectedFields on EntityValidator returned no errors and password field was not passed", async () => {
            try {
                validateSelectedMock.mockReturnValue([]);
                await userSubscriber.handleUpdate(user, fields);
            } catch {
            } finally {
                expect(hashMock).not.toBeCalled();
            }
        });

        it("should call hash on PasswordHaser only once when validateSelectedFields on EntityValidator returned no errors and password field was passed", async () => {
            validateSelectedMock.mockReturnValue([]);
            await userSubscriber.handleUpdate(user, ["password"]);
            expect(hashMock).toBeCalledTimes(1);
        });

        it("should call hash on PasswordHaser with passed username password when validateSelectedFields on EntityValidator returned no errors and password field was passed", async () => {
            validateSelectedMock.mockReturnValue([]);
            const password = user.password;
            await userSubscriber.handleUpdate(user, ["password"]);
            expect(hashMock).toBeCalledWith(password);
        });

        it("should store returned value of call of hash on PasswordHasher as user password when validateAllFields on EntityValidator returned no errors and password field was passed", async () => {
            validateSelectedMock.mockReturnValue([]);
            const hash = "hash";
            hashMock.mockResolvedValue(hash);
            await userSubscriber.handleUpdate(user, ["password"]);
            expect(user.password).toBe(hash);
        });
    });
});
