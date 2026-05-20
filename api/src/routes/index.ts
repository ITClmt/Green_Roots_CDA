import Elysia from "elysia";
import { authController } from "@/controllers/auth.controller";
import { usersController } from "@/controllers/users.controller";
import { healthRoute } from "./health";

export const routes = new Elysia()
  .use(healthRoute)
  .use(authController)
  .use(usersController);
