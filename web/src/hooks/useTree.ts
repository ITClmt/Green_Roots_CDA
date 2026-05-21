import { useQuery } from "@tanstack/react-query";
import { fetchTreeById } from "../api/trees";

export function useTree(id: string) {
  return useQuery({
    queryKey: ["tree", id],
    queryFn: () => fetchTreeById(id),
    enabled: !!id,
  });
}
