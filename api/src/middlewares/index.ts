import Elysia from "elysia";
import { errorMiddleware } from "./error.middleware";
import { loggingMiddleware } from "./logging.middleware";

export const middlewares = new Elysia()
  .use(errorMiddleware)
  .use(loggingMiddleware);
