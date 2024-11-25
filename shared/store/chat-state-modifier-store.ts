import { create } from "zustand";
import { Strategy } from "../lib/validation";

interface ChatModifier {
  state: "editing" | "deleting" | "idle" | null;
  subject: Strategy | null;
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
