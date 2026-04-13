import { type NotifyType } from "../../store/notifyStore";
import { useEffect, useCallback } from "react";
import { NOTIFY_COLORS } from "../../constants";

interface NotifyCardProps {
  message: string;
  type: NotifyType;
  duration?: number;
  onClose?: () => void;
}
export const NotifyCard = ({ message, type, duration = 3000, onClose }: NotifyCardProps) => {
  const memoizedOnClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    const t = setTimeout(memoizedOnClose, duration)
    return () => clearTimeout(t)
  }, [duration, memoizedOnClose])
  
  return (
    <div className={`${NOTIFY_COLORS[type]} text-white text-xs py-4 px-6 rounded-lg shadow-lg flex flex-row justify-between items-center shadow-lg animate-slide-up`}>
      {message}
      <button className="ml-2 text-white hover:text-gray-200" onClick={memoizedOnClose}>✕</button>
    </div>
  );
};
