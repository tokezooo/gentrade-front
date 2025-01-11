import { createContext, useContext, ReactNode } from "react";
import { StrategyDraft } from "@/shared/services/types/strategy-draft";

interface StrategyDraftContextType {
  handleStrategyDraftUpdate: (updatedStrategyDraft: StrategyDraft) => void;
}

const StrategyDraftContext = createContext<
  StrategyDraftContextType | undefined
>(undefined);

export function StrategyDraftProvider({
  children,
  handleStrategyDraftUpdate,
}: {
  children: ReactNode;
  handleStrategyDraftUpdate: (updatedStrategyDraft: StrategyDraft) => void;
}) {
  return (
    <StrategyDraftContext.Provider value={{ handleStrategyDraftUpdate }}>
      {children}
    </StrategyDraftContext.Provider>
  );
}

export function useStrategyDraft() {
  const context = useContext(StrategyDraftContext);
  if (context === undefined) {
    throw new Error(
      "useStrategyDraft must be used within a StrategyDraftProvider"
    );
  }
  return context;
}
