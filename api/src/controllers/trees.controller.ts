import Elysia, { t } from "elysia";
import { treesService } from "@/services/trees.service";
import { ok, fail } from "@/utils/response";
import { API_BASE } from "@/config/constants";

export const treesController = new Elysia({ prefix: `${API_BASE}/trees` })

  .get("/", async () => {
    const trees = await treesService.findAll();
    return ok(trees);
  })

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
    {
      params: t.Object({ id: t.String({ format: "uuid" }) }),
    }
  );

