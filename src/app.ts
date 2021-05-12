import express from "express";
import UserRouter from "./routers/UserRouter";

const app = express();

app.use(UserRouter);

export default app;
