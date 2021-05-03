import { createConnection } from "typeorm";
import {
    DATABASE_ADDRESS,
    DATABASE_NAME,
    DATABASE_PASSWORD,
    DATABASE_PORT,
    DATABASE_USER,
    IS_PRODUCTION,
} from "../constants";

export const connection = {
    async create() {
        await createConnection({
            type: "postgres",
            host: DATABASE_ADDRESS,
            port: DATABASE_PORT,
            username: DATABASE_USER,
            password: DATABASE_PASSWORD,
            database: DATABASE_NAME,
            logging: !IS_PRODUCTION,
            synchronize: !IS_PRODUCTION,
        });
    },
};
