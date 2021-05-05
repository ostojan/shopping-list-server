import { getConnection } from "typeorm";
import { connection } from "../../src/db/connection";
import { User } from "../../src/entities/User";

export const dbHelper = {
    async createConnection() {
        await connection.create();
    },
    async clearDatabase() {
        await getConnection().getRepository(User).delete({});
    },
    async closeConnection() {
        await connection.close();
    },
};
