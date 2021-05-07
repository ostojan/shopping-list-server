import * as argon2 from "argon2";
import { ARGON2_SECRET } from "../constants";
import { PasswordHasher } from "./PasswordHasher";

export class ArgonPasswordHasher implements PasswordHasher {
    private readonly argonOptions = { secret: Buffer.from(ARGON2_SECRET) };

    async hash(password: string): Promise<string> {
        return await argon2.hash(password, this.argonOptions);
    }

    async verify(password: string, hash: string): Promise<boolean> {
        try {
            return await argon2.verify(hash, password, this.argonOptions);
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}
