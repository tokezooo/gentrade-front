"use server";
import axios from "axios";
import { ApiEndpoints } from "./common/constants";
import { getInstance } from "./common/instance";
import { Backtest, BacktestListItem } from "./types/backtest";
import { DateRange } from "react-day-picker";

/**
 * Fetches all backtests for a specific strategy.
 * @param strategy_id The ID of the strategy to fetch backtests for
 * @returns {Promise<BacktestListItem[]>} A promise that resolves to an array of BacktestListItem objects.
 */
export const getStrategyBacktests = async (
  strategy_id: number
): Promise<BacktestListItem[]> => {
  try {
    const axiosInstance = await getInstance();
    const response = await axiosInstance.get(
      `${ApiEndpoints.BACKTESTS}?strategy_id=${strategy_id}`
    );

    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

/**
 * Creates a new backtest for a strategy.
 *
 * @param strategy_id The ID of the strategy to backtest
 * @param start_date The start date of the backtest period
 * @param end_date The end date of the backtest period
 * @returns {Promise<number>} A promise that resolves to the ID of the created backtest
 */
export const createBacktest = async (
  strategy_id: number,
  date_range: string
): Promise<number> => {
  const axiosInstance = await getInstance();
  const response = await axiosInstance.post(ApiEndpoints.BACKTESTS, {
    strategy_id: strategy_id,
    date_range: date_range,
  });
  return response.data.id;
};

/**
 * Fetches a specific backtest by its ID.
 *
 * @param id The ID of the backtest to fetch
 * @returns The backtest data or null if not found
 */
export const getBacktest = async (id: string): Promise<Backtest | null> => {
  try {
    const axiosInstance = await getInstance();
    const response = await axiosInstance.get<Backtest>(
      `${ApiEndpoints.BACKTESTS}/${id}`
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

/**
 * Deletes a specific backtest by its ID.
 *
 * @param id The ID of the backtest to delete
 * @returns A promise that resolves when the backtest is deleted
 */
export const deleteBacktest = async (id: number): Promise<void> => {
  const axiosInstance = await getInstance();
  await axiosInstance.delete(`${ApiEndpoints.BACKTESTS}/${id}`);
};
