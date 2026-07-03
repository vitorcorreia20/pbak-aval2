import "express-async-errors";
import express from "express";
import { errorMiddleware } from "./middlewares/error-middleware";
import { tripRequestRoutes } from "./modules/trip-requests/trip-requests.routes";
import { holidayRoutes } from "./modules/holidays/holidays.routes";

export const app = express();
app.use(express.json());

app.use("/trip-requests", tripRequestRoutes);
app.use("/holidays", holidayRoutes);

app.use(errorMiddleware);
