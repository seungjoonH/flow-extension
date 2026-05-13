import express from "express";
import router from "#src/routers";
import { NotFoundError } from "#src/response/error";
import { sendError } from "#src/response/send";
import { MESSAGES, STATUS } from "#src/response/status";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use(router);

app.use((_req, _res, next) => next(new NotFoundError()));

app.use((err, _req, res, _next) => {
  const status = err.status ?? STATUS.INTERNAL_SERVER_ERROR;
  const message = status >= 500 ? MESSAGES.INTERNAL_SERVER_ERROR : err.message;
  sendError(res, status, message);
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
