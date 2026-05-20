import { createPinoLogger } from "@bogeychan/elysia-logger";
import { env } from "@/config/env";
import { IS_PROD, IS_TEST } from "@/config/constants";

export const logger = createPinoLogger({
  level: IS_TEST ? "silent" : env.LOG_LEVEL,
  transport: IS_PROD
    ? undefined
    : {
        target: "pino-pretty",
        options: {
          colorize: true,
          ignore: "pid,hostname",
          translateTime: "SYS:HH:MM:ss",
        },
      },
});
