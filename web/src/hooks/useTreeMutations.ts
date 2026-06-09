import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTree, updateTree, deleteTree } from "../api/trees";
import type { TreePayload } from "../types/tree";
import { useAuth } from "../features/auth/AuthContext";
import { withRefresh } from "../utils/withRefresh";

function useInvalidateTrees() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["trees"] });
}

export function useCreateTree() {
  const { accessToken, refreshSession } = useAuth();
  const invalidateTrees = useInvalidateTrees();

  return useMutation({
    mutationFn: (payload: TreePayload) => {
      if (!accessToken) throw new Error("Non authentifié");
      return withRefresh(
        (t) => createTree(payload, t),
        accessToken,
        refreshSession,
      );
    },
    onSuccess: invalidateTrees,
  });
}

export function useUpdateTree() {
  const { accessToken, refreshSession } = useAuth();
  const invalidateTrees = useInvalidateTrees();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<TreePayload>;
    }) => {
      if (!accessToken) throw new Error("Non authentifié");
      return withRefresh(
        (t) => updateTree(id, payload, t),
        accessToken,
        refreshSession,
      );
    },
    onSuccess: invalidateTrees,
  });
}

export function useDeleteTree() {
  const { accessToken, refreshSession } = useAuth();
  const invalidateTrees = useInvalidateTrees();

  return useMutation({
    mutationFn: (id: string) => {
      if (!accessToken) throw new Error("Non authentifié");
      return withRefresh((t) => deleteTree(id, t), accessToken, refreshSession);
    },
    onSuccess: invalidateTrees,
  });
}
