import { ApiError } from "./ApiError";

export async function withRefresh<T>(
  fn: (token: string) => Promise<T>,
  token: string,
  refreshSession: () => Promise<string>,
): Promise<T> {
  try {
    return await fn(token);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      const newToken = await refreshSession();
      return fn(newToken);
    }
    throw error;
  }
}
