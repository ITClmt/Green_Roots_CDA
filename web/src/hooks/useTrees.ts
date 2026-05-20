import { useQuery } from "@tanstack/react-query";
import { fetchTrees } from "../api/trees";

export function useTrees() {
  return useQuery({
    queryKey: ["trees"],
    queryFn: fetchTrees,
  });
}
