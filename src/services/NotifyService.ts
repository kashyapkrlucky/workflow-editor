import { notifyStore } from "../store/notifyStore";

export const notifyService = {
  success: (message: string, duration?: number) => {
    notifyStore.getState().addNotify(message, "success", duration);
  },
  error: (message: string, duration?: number) => {
    notifyStore.getState().addNotify(message, "error", duration);
  },
  warning: (message: string, duration?: number) => {
    notifyStore.getState().addNotify(message, "warning", duration);
  },
  info: (message: string, duration?: number) => {
    notifyStore.getState().addNotify(message, "info", duration);
  },
};

export default notifyService;