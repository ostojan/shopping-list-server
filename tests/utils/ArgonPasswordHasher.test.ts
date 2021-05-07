import { ArgonPasswordHasher } from "../../src/utils/ArgonPasswordHasher";

describe("ArgonPasswordHasher", () => {
    const passwordHasher = new ArgonPasswordHasher();

    describe("hash", () => {
        it("should not return plaintext password", async () => {
            const password = "password";
            const hash = await passwordHasher.hash(password);
            expect(hash).not.toBe(password);
        });
    });

    describe("verify", () => {
        let password: string;
        let hash: string;

        beforeEach(async () => {
            password = "password";
            hash = await passwordHasher.hash(password);
        });

        it("should return true when password is valid", async () => {
            const result = await passwordHasher.verify(password, hash);
            expect(result).toBe(true);
        });

        it("should return false when password is invalid", async () => {
            const invalidPassword = "notAPassword";
            const result = await passwordHasher.verify(invalidPassword, hash);
            expect(result).toBe(false);
        });
    });
});
