import { create } from "zustand";

export type NotifyType = "success" | "error" | "warning" | "info";

type NotifyItem = {
  id: string;
  message: string;
  type: NotifyType;
  duration?: number;
};

interface NotifyStore {
  items: NotifyItem[];
  addNotify: (message: string, type: NotifyType, duration?: number) => void;
  removeNotify: (id: string) => void;
}

export const notifyStore = create<NotifyStore>((set) => ({
  items: [],
  addNotify: (message, type, duration = 3000) => {
    const id = new Date().getTime().toString();
    set((state) => ({
      items: [...state.items, { id, message, type, duration }],
    }));
  },
  removeNotify: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },
}));
