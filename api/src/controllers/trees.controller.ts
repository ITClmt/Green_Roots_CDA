import Elysia, { t } from "elysia";
import { treesService } from "@/services/trees.service";
import { ok, fail } from "@/utils/response";
import { API_BASE } from "@/config/constants";
import { requireAuth } from "@/middlewares/auth.middleware";
import { createTreeSchema, updateTreeSchema } from "@/models/tree";
import { ForbiddenError } from "@/utils/errors";

const uuidParam = t.Object({ id: t.String({ format: "uuid" }) });

export const treesController = new Elysia({ prefix: `${API_BASE}/trees` })
  .get(
    "/",
    async ({ query }) => {
      const result = await treesService.findAll({
        page: Number(query.page),
        limit: Number(query.limit),
        sortBy: query.sortBy,
        sortOrder: query.sortOrder ?? "asc",
      });
      return ok(result);
    },
    {
      query: t.Object({
        page: t.Numeric({ default: 1, minimum: 1 }),
        limit: t.Numeric({ default: 10, minimum: 1, maximum: 100 }),
        sortBy: t.Optional(
          t.Union([t.Literal("species"), t.Literal("location"), t.Literal("price"), t.Literal("stock")]),
        ),
        sortOrder: t.Optional(
          t.Union([t.Literal("asc"), t.Literal("desc")], { default: "asc" }),
        ),
      }),
    },
  )

  .get(
    "/:id",
    async ({ params: { id }, set }) => {
      const tree = await treesService.findById(id);
      if (!tree) {
        set.status = 404;
        return fail(`Tree with id "${id}" not found`);
      }
      return ok(tree);
    },
    { params: uuidParam },
  )

  .guard({}, (app) =>
    app
      .use(requireAuth)
      .onBeforeHandle(({ user }) => {
        if (user!.role !== "ADMIN") throw new ForbiddenError();
      })
      .post(
        "/",
        async ({ body, set }) => {
          const created = await treesService.create(body);
          set.status = 201;
          return ok(created);
        },
        { body: createTreeSchema },
      )

      .patch(
        "/:id",
        async ({ params, body, set }) => {
          const updated = await treesService.update(params.id, body);
          if (!updated) {
            set.status = 404;
            return fail(`Tree with id "${params.id}" not found`);
          }
          return ok(updated);
        },
        { params: uuidParam, body: updateTreeSchema },
      )

      .delete(
        "/:id",
        async ({ params, set }) => {
          await treesService.delete(params.id);
          set.status = 204;
        },
        { params: uuidParam },
      ),
  );
