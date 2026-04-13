import { notifyStore } from "@/store/notifyStore";
import { NotifyCard } from "./NotifyCard";

export function Notifications() {
  const { items, removeNotify } = notifyStore();
  return (
    <div className="fixed bottom-4 right-[50%] translate-x-[50%] z-50 min-w-[20rem]">
      {items.map((item) => (    
        <NotifyCard
          key={item.id}
          message={item.message}
          type={item.type}
          duration={item.duration}
          onClose={() => removeNotify(item.id)}
        />
      ))}
    </div>
  );
}
