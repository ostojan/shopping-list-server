import { createConnection, getConnection } from "typeorm";
import {
    DATABASE_ADDRESS,
    DATABASE_NAME,
    DATABASE_PASSWORD,
    DATABASE_PORT,
    DATABASE_USER,
    IS_PRODUCTION,
    IS_TEST,
} from "../constants";
import { User } from "../entities/User";

export const connection = {
    async create() {
        await createConnection({
            type: "postgres",
            host: DATABASE_ADDRESS,
            port: DATABASE_PORT,
            username: DATABASE_USER,
            password: DATABASE_PASSWORD,
            database: DATABASE_NAME,
            logging: !IS_PRODUCTION && !IS_TEST,
            synchronize: !IS_PRODUCTION,
            entities: [User],
        });
    },
    async close() {
        await getConnection().close();
    },
};
