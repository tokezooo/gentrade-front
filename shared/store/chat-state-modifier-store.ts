import { create } from "zustand";
import { StrategyDraft } from "../services/types/strategy-draft";

interface ChatModifier {
  state: "editing" | "deleting" | "idle" | null;
  subject: StrategyDraft | null;
}

interface ChatStateModifierState {
  chatModifier: ChatModifier;
  setChatModifier: (chatModifier: ChatModifier) => void;
}

export const useChatStateModifierStore = create<ChatStateModifierState>(
  (set) => ({
    chatModifier: {
      state: null,
      subject: null,
    },
    setChatModifier: (chatModifier) => set({ chatModifier }),
  })
);
