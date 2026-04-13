import { ChatInterface } from "./ChatInterface";
import { useState } from "react";
import { MessageCircleIcon, XIcon } from "lucide-react";
import { aiService } from "@/services/AiService";

export function AIAssist() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSendMessage = async (message: string) => {
    const response = await aiService.processUserQuery(message);
    return response.message;
  };

  return (
    <>
      {isOpen && <ChatInterface onSendMessage={handleSendMessage} />}
      <div className="fixed bottom-4 right-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-t from-indigo-600 to-blue-600  text-white rounded-full shadow-lg  transition-all duration-300 hover:scale-110 ${isOpen ? "rotate-180" : ""}`}
          title={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
        >
          {isOpen ? (
            <XIcon className="w-6 h-6" />
          ) : (
            <MessageCircleIcon className="w-6 h-6" />
          )}
        </button>
      </div>
    </>
  );
}
