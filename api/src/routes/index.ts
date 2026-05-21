import Elysia from "elysia";
import { authController } from "@/controllers/auth.controller";
import { usersController } from "@/controllers/users.controller";
import { treesController } from "@/controllers/trees.controller";
import { healthRoute } from "./health";
import { orderController } from "@/controllers/order.controller";

export const routes = new Elysia()
  .use(healthRoute)
  .use(authController)
  .use(usersController)
  .use(treesController)
  .use(orderController);
