import { useWorkflowStore } from "@/store/workflowStore";
import { exportWorkflow, importWorkflow } from "@/utils/serialization";

export function NavBar() {
  const { workflow, setWorkflow } = useWorkflowStore();

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
      <div className="flex gap-2">
        <button
          className="px-2 py-1 bg-gray-500 text-white rounded-md text-xs cursor-pointer"
          onClick={handleExport}
        >
          Export
        </button>
        <label
          className="px-2 py-1 bg-gray-500 text-white rounded-md text-xs cursor-pointer"
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
