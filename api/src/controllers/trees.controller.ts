import Elysia from "elysia";
import { treesService } from "@/services/trees.service";
import { ok } from "@/utils/response";
import { API_BASE } from "@/config/constants";

export const treesController = new Elysia({ prefix: `${API_BASE}/trees` })

  .get("/", async () => {
    const trees = await treesService.findAll();
    return ok(trees);
  });
