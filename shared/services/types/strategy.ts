export interface Strategy {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export type StrategyListItem = Pick<Strategy, "id" | "name">;
