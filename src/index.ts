import app from "./app";
import { PORT } from "./constants";

const main = async () => {
    app.listen(PORT, () => {
        console.log(`Server is up and running on port ${PORT}`);
    });
};

main();
