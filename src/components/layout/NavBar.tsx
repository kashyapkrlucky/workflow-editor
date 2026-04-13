import { useWorkflowStore } from "@/store/workflowStore";
import { exportWorkflow, importWorkflow } from "@/utils/serialization";
import { notifyStore } from "@/store/notifyStore";
import { NotifyCard } from "./NotifyCard";

export function NavBar() {
  const { workflow, setWorkflow } = useWorkflowStore();
  const { items, removeNotify } = notifyStore();
  const handleExport = () => {
    const dataStr = exportWorkflow(workflow);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = "workflow.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const workflow = importWorkflow(content);
          if (workflow) {
            setWorkflow(workflow);
          } else {
            alert("Invalid workflow format. Please check the file structure.");
          }
        } catch (error) {
          console.error("Failed to import workflow:", error);
          alert(
            "Failed to import workflow file. Please check the file format.",
          );
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <header className="border-b border-gray-200 p-4 h-12 flex items-center justify-between">
      <div>Workflow Editor</div>
      <div className="flex gap-2 items-center">

        {/* Notifications */}
        {items.map((item) => (
          <NotifyCard key={item.id} message={item.message} type={item.type} onClose={() => removeNotify(item.id)} />
        ))}

        {/* Export Button */}
        <button
          className="px-3 py-1.5 border border-gray-300 rounded-md text-xs cursor-pointer"
          onClick={handleExport}
        >
          Export
        </button>

        {/* Import Button */}
        <label
          className="px-3 py-2 bg-gradient-to-t from-indigo-600 to-blue-600 text-white rounded-md text-xs cursor-pointer"
          title="Import Workflow"
        >
          <span>Import</span>
          <input
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
          />
        </label>
        
      </div>
    </header>
  );
}
