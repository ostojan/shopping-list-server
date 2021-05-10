import { User } from "../../src/entities/User";
import { createValidUser } from "../fixtures/entities/User";

describe("User", () => {
    let user: User;

    beforeEach(() => {
        user = createValidUser();
    });

    describe("toJSON", () => {
        it("should not return object containing password field", () => {
            const result = user.toJSON();
            expect(result).not.toEqual(expect.objectContaining({ password: user.password }));
        });

        it("should not return object containing createdAt field", () => {
            const result = user.toJSON();
            expect(result).not.toEqual(expect.objectContaining({ createdAt: user.createdAt }));
        });

        it("should not return object containing updatedAt field", () => {
            const result = user.toJSON();
            expect(result).not.toEqual(expect.objectContaining({ updatedAt: user.updatedAt }));
        });

        it("should return object containing id field with user id", () => {
            const result = user.toJSON();
            expect(result).toEqual(expect.objectContaining({ id: user.id }));
        });

        it("should return object containing username field with user username", () => {
            const result = user.toJSON();
            expect(result).toEqual(expect.objectContaining({ username: user.username }));
        });

        it("should return object containing email field with user email", () => {
            const result = user.toJSON();
            expect(result).toEqual(expect.objectContaining({ email: user.email }));
        });
    });
});
