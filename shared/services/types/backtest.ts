import { Strategy } from "./strategy";

export interface Backtest {
  id: number;
  strategy_id: number;
  strategy: Strategy;
  start_date: Date;
  end_date: Date;
  status: "pending" | "running" | "completed" | "failed";
  results: BacktestResults | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BacktestResults {
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  win_rate: number;
  profit_factor: number;
  max_drawdown: number;
  total_return: number;
  sharpe_ratio: number;
  trades: BacktestTrade[];
}

export interface BacktestTrade {
  entry_date: Date;
  exit_date: Date;
  entry_price: number;
  exit_price: number;
  position_size: number;
  pnl: number;
  pnl_percentage: number;
  type: "long" | "short";
}

export type BacktestListItem = Pick<
  Backtest,
  "id" | "strategy_id" | "start_date" | "end_date" | "status"
>;
