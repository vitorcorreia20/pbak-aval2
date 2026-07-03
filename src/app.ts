import "express-async-errors";
import express from "express";
import { errorMiddleware } from "./middlewares/error-middleware";

export const app = express();
app.use(express.json());

app.use(errorMiddleware);
