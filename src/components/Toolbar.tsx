import { useWorkflowStore } from "@/store/workflowStore";
import type { Node, NodeType } from "@/types/domain";
import {
  PanelLeftIcon,
  PanelLeftCloseIcon,
  StepForwardIcon,
  SquareIcon,
  PlusCircleIcon,
  CircleIcon,
} from "lucide-react";
import { useState, useCallback } from "react";

export function Toolbar() {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);

  const { addNode } = useWorkflowStore();
  const buttons: { icon: React.ReactNode; label: string; action: NodeType }[] = [
    {
      icon: <StepForwardIcon className="w-6 h-6 text-gray-600" />,
      label: "Start",
      action: "start",
    },
    {
      icon: <SquareIcon className="w-6 h-6 text-gray-600" />,
      label: "Task",
      action: "task",
    },
    {
      icon: <PlusCircleIcon className="w-6 h-6 text-gray-600" />,
      label: "Custom",
      action: "custom",
    },
    {
      icon: <CircleIcon className="w-6 h-6 text-gray-600" />,
      label: "End",
      action: "end",
    },
  ];

  const handleButtonClick = useCallback((type: NodeType) => {
    const newNode: Node = {
      id: Date.now().toString(),
      type: type,
      x: Math.random() * 100,
      y: Math.random() * 100,
      variables: {},
    };
    addNode(newNode);
    setIsLeftSidebarOpen(false);
  }, [addNode, setIsLeftSidebarOpen]);

  return (
    <div className="w-12 relative">
      <div
        className={`absolute top-0 left-0 h-full ${isLeftSidebarOpen ? "w-64" : "w-12"} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col z-10 overflow-y-auto p-2`}
      >
        <div className="py-2 border-b border-gray-200">
          <button
            onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
            className="p-1 cursor-pointer flex items-center gap-2"
          >
            {isLeftSidebarOpen ? (
              <>
                <PanelLeftCloseIcon />
                <span className="text-sm uppercase">Toolbar</span>
              </>
            ) : (
              <PanelLeftIcon />
            )}
          </button>
        </div>

        {/* JSON Data Content */}
        {isLeftSidebarOpen && (
          <div className="flex-1 p-2">
            <div className="grid grid-cols-2 gap-2">
              {buttons.map((button) => (
                <div
                  className="h-16 flex flex-col justify-center items-center gap-2 p-2 border border-gray-200 rounded bg-white hover:bg-gray-50 cursor-pointer"
                  key={button.label}
                  onClick={() => handleButtonClick(button.action)}
                >
                  {button.icon}
                  <span className="">{button.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
