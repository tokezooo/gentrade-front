import { StrategyDraft } from "./strategy-draft";

export interface Strategy {
  id: number;
  name: string;
  draft: StrategyDraft;
  createdAt: Date;
  updatedAt: Date;
}

export type StrategyListItem = Pick<Strategy, "id" | "name">;
