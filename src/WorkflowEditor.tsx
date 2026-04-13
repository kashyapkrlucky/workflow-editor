import { NavBar } from "./components/layout/NavBar";
import { Toolbar } from "./components/layout/Toolbar";
import { CanvasEditor } from "./components/canvas/CanvasEditor";
import { Sidebar } from "./components/layout/Sidebar";
import { AIAssist } from "./components/assistant/AIAssist";

interface WorkflowEditorProps {
  aiConfig?: {
    apiKey?: string;
    model: string;
  };
}

export function WorkflowEditor({ aiConfig }: WorkflowEditorProps) {
  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <main className="flex-1 flex flex-row">
        <Toolbar />
        <section className="w-full flex-1">
          <CanvasEditor />
        </section>
        <Sidebar />
      </main>
      <AIAssist aiConfig={aiConfig} />
    </div>
  );
}
