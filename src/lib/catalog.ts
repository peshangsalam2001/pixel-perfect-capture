import { queryOptions } from "@tanstack/react-query";
import { listProducts } from "./catalog.functions";

export const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: () => listProducts(),
  staleTime: 60_000,
});

export const CATEGORIES = ["all", "streaming", "music", "ai", "gaming", "software"] as const;
