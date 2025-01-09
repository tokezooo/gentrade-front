import { useMutation, useQuery } from "@tanstack/react-query";
import { API } from "../services/api-client";
import {
  StrategyDraft,
  StrategyDraftAdd,
  StrategyDraftListItem,
} from "../services/types/strategy";
import { getQueryClient } from "../lib/use-query/get-query-client";

export const useUserStrategies = () => {
  const queryClient = getQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["strategies"],
    staleTime: Infinity,
    queryFn: async () => {
      const response = await API.strategies.getUserStrategies();
      return response ?? [];
    },
  });

  const { mutate: mutateAddStrategy, isPending: isPendingAddStrategy } =
    useMutation({
      mutationKey: ["strategies", "add"],
      mutationFn: async (strategy: StrategyDraftAdd) => {
        const response = await API.strategies.addStrategy(strategy);
        return response;
      },
      onMutate: async (strategy: StrategyDraftAdd) => {
        await queryClient.cancelQueries({ queryKey: ["strategies"] });
        const previousStrategies = queryClient.getQueryData<
          StrategyDraftListItem[]
        >(["strategies"]);
        queryClient.setQueryData(
          ["strategies"],
          (old: StrategyDraftListItem[]) => {
            return [strategy, ...old];
          }
        );
        return { previousStrategies };
      },
      onError: (context: any) => {
        queryClient.setQueryData(["strategies"], context.previousStrategies);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["strategies"] });
      },
    });

  const { mutate: mutateUpdateStrategy, isPending: isPendingUpdateStrategy } =
    useMutation({
      mutationKey: ["mutateUpdateStrategy"],
      mutationFn: async (strategy: StrategyDraft) => {
        const response = await API.strategies.updateStrategy(strategy);
        return response;
      },
    });

  const { mutate: mutateDeleteStrategy, isPending: isPendingDeleteStrategy } =
    useMutation({
      mutationKey: ["mutateDeleteStrategy"],
      mutationFn: async (id: string) => {
        await API.strategies.deleteStrategy(id);
      },
      onMutate: async (id: string) => {
        await queryClient.cancelQueries({ queryKey: ["getUserStrategies"] });
        const previousStrategies = queryClient.getQueryData<
          StrategyDraftListItem[]
        >(["getUserStrategies"]);

        queryClient.setQueryData(
          ["getUserStrategies"],
          (old: StrategyDraftListItem[]) => {
            return old.filter((strategy) => strategy.id !== id);
          }
        );

        return { previousStrategies };
      },
      onError: (context: any) => {
        queryClient.setQueryData(["strategies"], context.previousStrategies);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["strategies"] });
      },
    });

  return {
    userStrategyList: data || [],
    isLoading,
    error,
    mutateAddStrategy,
    isPendingAddStrategy,
    mutateUpdateStrategy,
    isPendingUpdateStrategy,
    mutateDeleteStrategy,
    isPendingDeleteStrategy,
  };
};
