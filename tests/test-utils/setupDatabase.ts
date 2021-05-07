import { connection } from "../../src/db/connection";

beforeAll(async () => {
    await connection.create();
});

afterAll(async () => {
    await connection.close();
});
