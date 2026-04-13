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
    <div className={`${NOTIFY_COLORS[type]} text-white text-xs animate-fade-in py-1 px-2 rounded-md`}>
      {message}
      <button className="ml-2 text-white hover:text-gray-200" onClick={memoizedOnClose}>✕</button>
    </div>
  );
};
