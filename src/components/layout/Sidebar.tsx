import { useWorkflowStore } from "@/store/workflowStore";
import type { NodeType } from "@/types/domain";
import { useEffect, useState } from "react";
import { Modal } from "../common/Modal";

export function Sidebar() {
  const { workflow, selectedNodeId, updateNode, deleteNode } =
    useWorkflowStore();

  const selectedNode = selectedNodeId
    ? workflow.nodes.find((node) => node.id === selectedNodeId)
    : null;

  const nodeTypeOptions: NodeType[] = [
    "start",
    "task",
    "end",
    "custom",
    "create_policy",
    "send_email",
  ];

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form state for editing - use single state object to avoid cascading renders
  const [formData, setFormData] = useState({
    nodeType: selectedNode?.type || "",
    nodeName: selectedNode?.name || "",
    nodeVariables: JSON.stringify(selectedNode?.variables || {}, null, 2),
  });

  // Sync form state when selected node changes
  useEffect(() => {
    const payload = selectedNode
      ? {
          nodeType: selectedNode.type,
          nodeName: selectedNode.name,
          nodeVariables: JSON.stringify(selectedNode.variables || {}, null, 2),
        }
      : {
          nodeType: "",
          nodeName: "",
          nodeVariables: "{}",
        };
    // Use setTimeout to avoid cascading renders
    setTimeout(() => setFormData(payload), 0);
  }, [selectedNodeId, selectedNode]);

  const handleSaveChanges = () => {
    if (selectedNodeId) {
      try {
        const variables = JSON.parse(formData.nodeVariables);
        updateNode(selectedNodeId, {
          name: formData.nodeName,
          type: formData.nodeType as NodeType,
          variables,
        });
      } catch (error) {
        console.error("Invalid JSON:", error);
      }
    }
  };

  const handleDeleteNode = () => {
    if (selectedNodeId) {
      deleteNode(selectedNodeId);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="w-64 border-l border-gray-200 p-4">
      <p className="text-xs mb-2 uppercase font-medium text-gray-700">
        Node Actions
      </p>
      {selectedNode ? (
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2">
            <input
              id="node-name"
              type="text"
              placeholder="Node name"
              className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
              value={formData.nodeName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  nodeName: e.target.value,
                })
              }
            />
            <select
              id="node-type"
              className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
              value={formData.nodeType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  nodeType: e.target.value as NodeType,
                })
              }
            >
              <option value="">Select Node Type</option>
              {nodeTypeOptions.map((nodeType) => (
                <option key={nodeType} value={nodeType}>
                  {nodeType}
                </option>
              ))}
            </select>
          </div>
          <div>
            <textarea
              id="node-variables"
              className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs code"
              placeholder="Variables (JSON)"
              rows={5}
              value={formData.nodeVariables}
              onChange={(e) =>
                setFormData({ ...formData, nodeVariables: e.target.value })
              }
            ></textarea>
          </div>
          <div className="flex flex-row gap-2">
            <button
              className="px-2 py-1 bg-blue-500 text-white rounded-md text-xs"
              onClick={handleSaveChanges}
            >
              Save Changes
            </button>
            <button
              className="px-2 py-1 bg-red-500 text-white rounded-md text-xs"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div className="min-h-28 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-2 text-xs text-gray-500 text-center">
          Select a node to update or delete
        </div>
      )}

      <p className="text-xs mt-4 mb-2 uppercase font-medium text-gray-700">
        Workflow Json
      </p>
      <textarea
        className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
        rows={10}
        value={JSON.stringify(workflow, null, 2)}
        placeholder="Workflow JSON"
        readOnly
      ></textarea>

      <Modal
        isOpen={isDeleteModalOpen}
        title="Delete Node"
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <div>
          <p className="py-2 text-sm">Are you sure you want to delete this node?</p>
          <div className="flex flex-row justify-end gap-2 mt-2">
            <button
              className="px-3 py-1.5 bg-red-500 text-white rounded-md text-sm"
              onClick={handleDeleteNode}
            >
              Yes
            </button>
            <button
              className="px-3 py-1.5 bg-gray-500 text-white rounded-md text-sm"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              No
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
