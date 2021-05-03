import "reflect-metadata";
import app from "./app";
import { PORT } from "./constants";
import { connection } from "./db/connection";

const main = async () => {
    try {
        await connection.create();
        app.listen(PORT, () => {
            console.log(`Server is up and running on port ${PORT}`);
        });
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
};

main();
