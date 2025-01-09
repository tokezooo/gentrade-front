export interface StrategyDraft {
  id?: string;
  name: string;
  description: string;
  can_short: boolean;
  max_positions: number;
  max_drawdown: number;
  risk_reward: number;
  win_rate: number;
  profit_factor: number;
  max_correlation: number;
  min_trades_per_month: number;
}

export type StrategyDraftAdd = Omit<StrategyDraft, "id">;
export type StrategyDraftListItem = Pick<
  StrategyDraft,
  "id" | "name" | "description"
>;
