import { create } from "zustand";

interface ChatModifier {
  state: "editing" | "deleting" | null;
  subject: string | null;
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
