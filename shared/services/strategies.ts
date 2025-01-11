"use server";
import axios from "axios";
import { ApiEndpoints } from "./common/constants";
import { getInstance } from "./common/instance";
import { StrategyDraft } from "./types/strategy-draft";
import { Strategy, StrategyListItem } from "./types/strategy";

/**
 * Fetches all strategies for the current user.
 * @returns {Promise<StrategyDraftListItem[]>} A promise that resolves to an array of StrategyDraftListItem objects.
 */
export const getUserStrategies = async (): Promise<StrategyListItem[]> => {
  try {
    const axiosInstance = await getInstance();
    const response = await axiosInstance.get<{
      data: StrategyListItem[];
    }>(ApiEndpoints.STRATEGIES);

    return response.data.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

/**
 * Saves a new strategy to the API.
 *
 * @param strategy_draft The strategy draft data to generate a strategy from
 */
export const createStrategyFromDraft = async (
  strategy_draft: StrategyDraft
): Promise<number> => {
  const axiosInstance = await getInstance();
  const response = await axiosInstance.post(
    ApiEndpoints.STRATEGIES,
    strategy_draft
  );
  return response.data.id;
};

/**
 * Updates an existing strategy in the API.
 *
 * @param strategy The strategy data to update
 */
export const updateStrategy = async (strategy: Strategy): Promise<void> => {
  const axiosInstance = await getInstance();
  await axiosInstance.patch(ApiEndpoints.STRATEGIES, strategy);
};

/**
 * Fetches a specific strategy by its ID.
 *
 * @param id The ID of the strategy to fetch
 * @returns The strategy data or null if not found
 */
export const getStrategy = async (
  id: string
): Promise<StrategyDraft | null> => {
  try {
    const axiosInstance = await getInstance();
    const response = await axiosInstance.get<{
      data: StrategyDraft;
    }>(`${ApiEndpoints.STRATEGIES}/${id}`);

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

/**
 * Deletes a specific strategy by its ID.
 *
 * @param id The ID of the strategy to delete
 * @returns A promise that resolves when the strategy is deleted
 */
export const deleteStrategy = async (id: number): Promise<void> => {
  const axiosInstance = await getInstance();
  await axiosInstance.delete(`${ApiEndpoints.STRATEGIES}/${id}`);
};
