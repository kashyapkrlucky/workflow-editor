import { XIcon } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      tabIndex={0}
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <header className="flex flex-row justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose}>
            <XIcon />
          </button>
        </header>
        <section className="mt-4">{children}</section>
      </div>
    </div>
  );
}
