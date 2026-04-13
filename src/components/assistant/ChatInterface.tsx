import { CONTENT } from "@/constants";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { type Message } from "@/types/domain";
import {
  AlertCircleIcon,
  BotIcon,
  CheckCircleIcon,
  UserIcon,
} from "lucide-react";

interface ChatInterfaceProps {
  onSendMessage: (message: string) => Promise<string>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export function ChatInterface({ onSendMessage, messages, setMessages }: ChatInterfaceProps) {
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState("");
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        content: message,
        type: "user",
        timestamp: new Date(),
      },
    ]);
    setMessage("");
    setIsLoading(true);
    const response = await onSendMessage(message);
    if (response) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: response,
          type: "assistant",
          timestamp: new Date(),
        },
      ]);
    }
    setIsLoading(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getStatusIcon = (status?: "success" | "error" | "info") => {
    switch (status) {
      case "success":
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case "error":
        return <AlertCircleIcon className="w-4 h-4 text-red-500" />;
      case "info":
      default:
        return null;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="fixed bottom-24 right-4 w-96 h-[500px] bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col">
      <header className="p-4 bg-white border-b border-gray-200 flex justify-between items-center rounded-t-lg">
        <h2 className="text-lg font-semibold text-gray-900">
          {CONTENT.assistant.name}
        </h2>
        <span className="text-xs text-gray-600">
          {CONTENT.assistant.description}
        </span>
      </header>
      <div className="flex-1 overflow-y-auto h-36 p-4 space-y-4 hide-scrollbar">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.type === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <BotIcon className="w-4 h-4 text-blue-600" />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.type === "user"
                  ? "bg-gradient-to-t from-indigo-600 to-blue-600 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <div className="whitespace-pre-wrap text-xs">
                {message.content}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-xs ${
                    message.type === "user" ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {message.type === "assistant" && getStatusIcon(message.status)}
              </div>
            </div>

            {message.type === "user" && (
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-4 h-4 text-gray-600" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
        {isLoading && (
          <div className="flex flex-row gap-3 justify-center">
            <BotIcon className="w-4 h-4 text-blue-600" />
            <span className="text-xs">Processing...</span>
          </div>
        )}
      </div>
      <form
        className="h-14 border-t border-gray-300 flex flex-row gap-2 p-2"
        onSubmit={onSubmit}
      >
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="bg-gradient-to-t from-indigo-600 to-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </form>
    </div>
  );
}
