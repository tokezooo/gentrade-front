import { create } from "zustand";
import { StrategyListItem } from "../services/types/strategy";
import { ChatListItem } from "../services/types/chat";

interface NavPage {
  rootTitle: string;
  title: string;
  object: StrategyListItem | ChatListItem;
}

interface NavState {
  currentNavState: NavPage | null;
  setCurrentNavState: (state: NavPage | null) => void;
}

export const useNavStore = create<NavState>((set) => ({
  currentNavState: null,
  setCurrentNavState: (state) => set({ currentNavState: state }),
}));
