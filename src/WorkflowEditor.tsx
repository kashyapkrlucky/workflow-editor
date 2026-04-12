import { NavBar } from "./components/NavBar";
import { Toolbar } from "./components/Toolbar";
import { CanvasEditor } from "./components/CanvasEditor";
import { Sidebar } from "./components/Sidebar";

export function WorkflowEditor() {
  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <main className="flex-1 flex flex-row">
        <Toolbar />
        <section className="w-full flex-1 relative">
          <CanvasEditor />
        </section>
        <Sidebar />
      </main>
    </div>
  )
}