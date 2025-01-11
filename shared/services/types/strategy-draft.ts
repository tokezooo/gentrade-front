import { z } from "zod";

export const strategyDraftSchema = z.object({
  name: z
    .string()
    .min(1, "Strategy name is required")
    .describe("The name of the strategy."),
  description: z
    .string()
    .min(1, "Strategy description is required")
    .describe("A brief description of the strategy."),
  indicators: z
    .string()
    .min(1, "Indicators are required")
    .describe("Indicators are the technical indicators used in the strategy."),
  entry_signals: z
    .string()
    .min(1, "Entry signals are required")
    .describe(
      "Entry signals are the signals that trigger the entry into a trade."
    ),
  exit_signals: z
    .string()
    .min(1, "Exit signals are required")
    .describe(
      "Exit signals are the signals that trigger the exit from a trade."
    ),
  minimal_roi: z
    .string()
    .min(1, "Minimal ROI is required")
    .describe(
      "Minimal ROI is the minimum return on investment that the strategy aims to achieve."
    ),
  stoploss: z
    .string()
    .min(1, "Stoploss is required")
    .describe("Stoploss is the maximum loss that the strategy can tolerate."),
  timeframe: z
    .string()
    .min(1, "Timeframe is required")
    .describe(
      "Timeframe is the time period over which the strategy is evaluated."
    ),
  can_short: z
    .boolean()
    .describe("Can Short is whether the strategy can short the asset."),
});

export type StrategyDraft = z.infer<typeof strategyDraftSchema> & {
  toolCallId?: string;
  strategyId?: number;
};

// Utility function to extract descriptions
export const getStrategyDraftDescriptions = () => {
  return Object.fromEntries(
    Object.entries(strategyDraftSchema.shape).map(([key, schema]) => [
      key,
      schema._def.description,
    ])
  );
};
