import "express-async-errors"; // Tem de ser o primeiro import
import express from "express";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error-middleware";

dotenv.config();

const app = express();
app.use(express.json());

// --- AQUI ENTRARÃO AS ROTAS DEPOIS --- //

// --- MIDDLEWARE DE ERROS (Tem de ser o último 'app.use') --- //
app.use(errorMiddleware);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
