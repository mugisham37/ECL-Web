"use client";

import {
  useQuery,
  useMutation,
  type UseQueryResult,
  type UseMutationResult,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { useApiSession } from "@/hooks/use-api-session";
import type { ApiError } from "@/lib/api/client";

type AuthedQueryOptions<T> = Omit<
  UseQueryOptions<T, ApiError>,
  "queryKey" | "queryFn" | "enabled"
> & {
  enabled?: boolean;
};

export function useAuthedQuery<T>(
  queryKey: unknown[],
  fetcher: (token: string, tenantId: string) => Promise<T>,
  options?: AuthedQueryOptions<T>,
): UseQueryResult<T, ApiError> {
  const { token, tenantId, isLoading: sessionLoading, isAuthenticated } = useApiSession();

  const { enabled: optEnabled = true, ...rest } = options ?? {};

  return useQuery<T, ApiError>({
    queryKey,
    queryFn: () => fetcher(token!, tenantId!),
    enabled: isAuthenticated && !sessionLoading && !!token && !!tenantId && optEnabled,
    ...rest,
  });
}

type AuthedMutationOptions<TVariables, TResult> = Omit<
  UseMutationOptions<TResult, ApiError, TVariables>,
  "mutationFn"
>;

export function useAuthedMutation<TVariables, TResult = void>(
  mutationFn: (token: string, tenantId: string, variables: TVariables) => Promise<TResult>,
  options?: AuthedMutationOptions<TVariables, TResult>,
): UseMutationResult<TResult, ApiError, TVariables> {
  const { token, tenantId } = useApiSession();

  return useMutation<TResult, ApiError, TVariables>({
    mutationFn: (variables: TVariables) => mutationFn(token!, tenantId!, variables),
    ...options,
  });
}
