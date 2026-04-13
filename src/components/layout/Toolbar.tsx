import { useWorkflowStore } from "@/store/workflowStore";
import type { Node, NodeType } from "@/types/domain";
import {
  PanelLeftIcon,
  PanelLeftCloseIcon,
  StepForwardIcon,
  SquareIcon,
  PlusCircleIcon,
  CircleIcon,
  FilePlus2Icon,
  MailIcon,
  UserPlus2Icon,
} from "lucide-react";
import { useState, useCallback } from "react";

export function Toolbar() {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);

  const { addNode } = useWorkflowStore();
  const buttons: { icon: React.ReactNode; label: string; action: NodeType }[] = [
    {
      icon: <StepForwardIcon className="w-4 h-4 text-gray-600" />,
      label: "Start",
      action: "start",
    },
    {
      icon: <SquareIcon className="w-4 h-4 text-gray-600" />,
      label: "Task",
      action: "task",
    },
    {
      icon: <PlusCircleIcon className="w-4 h-4 text-gray-600" />,
      label: "Custom",
      action: "custom",
    },
    {
      icon: <UserPlus2Icon className="w-4 h-4 text-gray-600" />,
      label: "Create Account",
      action: "custom",
    },
    {
      icon: <FilePlus2Icon className="w-4 h-4 text-gray-600" />,
      label: "Create Policy",
      action: "custom",
    },
    {
      icon: <FilePlus2Icon className="w-4 h-4 text-gray-600" />,
      label: "Create Document",
      action: "custom",
    },
    {
      icon: <MailIcon className="w-4 h-4 text-gray-600" />,
      label: "Send Email",
      action: "custom",
    },
    {
      icon: <CircleIcon className="w-4 h-4 text-gray-600" />,
      label: "End",
      action: "end",
    },
  ];

  const handleButtonClick = useCallback((type: NodeType, label: string) => {
    const newNode: Node = {
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: label,
      type: type,
      x: Math.random() * 100,
      y: Math.random() * 100,
      variables: {},
    };
    addNode(newNode);
    setIsLeftSidebarOpen(false);
  }, [addNode, setIsLeftSidebarOpen]);

  return (
    <div className="w-12 relative select-none">
      <div
        className={`absolute top-0 left-0 h-full ${isLeftSidebarOpen ? "w-72" : "w-12"} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col z-10 overflow-y-auto p-2`}
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
            <p className="text-xs text-gray-600 mb-2 py-2">Click on a node to add it to the workflow</p>
            <div className="grid grid-cols-2 gap-1">
              {buttons.map((button) => (
                <div
                  className="h-16 flex flex-col justify-center items-center gap-2 p-1 border border-gray-200 rounded bg-white hover:bg-gray-50 cursor-pointer"
                  key={button.label}
                  onClick={() => handleButtonClick(button.action, button.label)}
                >
                  {button.icon}
                  <span className="text-xs">{button.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
