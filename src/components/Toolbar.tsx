import { PanelLeftIcon, PanelLeftCloseIcon } from "lucide-react";
import { useState } from "react";

export function Toolbar() {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  return (
    <div className="w-12 relative">
      <div
        className={`absolute top-0 left-0 h-full ${isLeftSidebarOpen ? "w-64" : "w-12"} bg-gray-100 border-r border-gray-200 transition-all duration-300 flex flex-col z-10 overflow-y-auto`}
      >
        <div className="p-2 border-b border-gray-200">
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
          <div className="flex-1 p-4">
            
          </div>
        )}
      </div>
    </div>
  );
}
