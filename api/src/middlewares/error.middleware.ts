import Elysia from "elysia";
import {
  AppError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
} from "@/utils/errors";
import { fail } from "@/utils/response";
import { logger } from "@/utils/logger";

export const errorMiddleware = new Elysia({ name: "error-middleware" })
  .error({
    NOT_FOUND: NotFoundError,
    UNAUTHORIZED: UnauthorizedError,
    FORBIDDEN: ForbiddenError,
    CONFLICT: ConflictError,
  })
  .onError({ as: "global" }, ({ code, error, set }) => {
    if (error instanceof AppError) {
      set.status = error.statusCode;
      return fail(error.message);
    }

    if (code === "VALIDATION") {
      set.status = 422;
      return fail(error.message);
    }

    if (code === "NOT_FOUND") {
      set.status = 404;
      return fail("Route not found");
    }

    logger.error({ code, message: error instanceof Error ? error.message : String(error) }, "Unhandled error");
    set.status = 500;
    return fail("Internal server error");
  });
