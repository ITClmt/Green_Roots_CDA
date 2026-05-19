import Elysia from "elysia";
import { z } from "zod";
import { requireAuth } from "@/middlewares/auth.middleware";
import { usersService } from "@/services/users.service";
import { updateUserSchema } from "@/models/user";
import { ok } from "@/utils/response";
import { ForbiddenError } from "@/utils/errors";
import { API_BASE } from "@/config/constants";


const paramsSchema = z.object({ id: z.uuid() });

export const usersController = new Elysia({ prefix: `${API_BASE}/users` })
  .use(requireAuth)

  .get("/me", async ({ user }) => {
    const me = await usersService.findById(user!.sub as string);
    return ok(me);
  })

  .guard(
    {
      params: paramsSchema,
      beforeHandle: ({ params, user }) => {
        if (!user || (user.sub !== params.id && user.role !== "ADMIN"))
          throw new ForbiddenError();
      },
    },
    (app) =>
      app
        .get("/:id", async ({ params }) => {
          const found = await usersService.findById(params.id);
          return ok(found);
        })

        .patch("/:id", async ({ params, body }) => {
          const updated = await usersService.update(params.id, body);
          return ok(updated);
        }, { body: updateUserSchema })

        .delete("/:id", async ({ params, set }) => {
          await usersService.delete(params.id);
          set.status = 204;
        })
  );
