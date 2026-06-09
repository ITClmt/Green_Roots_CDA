import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchTrees, fetchTreeById } from "../api/trees";

export function useTree(id: string) {
  return useQuery({
    queryKey: ["tree", id],
    queryFn: () => fetchTreeById(id),
    enabled: !!id,
  });
}

export function useTrees(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["trees", page, limit],
    queryFn: () => fetchTrees(page, limit),
  });
}

export function useInfiniteTrees(limit = 9) {
  return useInfiniteQuery({
    queryKey: ["trees", "infinite", limit],
    queryFn: ({ pageParam }) => fetchTrees(pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
  });
}
