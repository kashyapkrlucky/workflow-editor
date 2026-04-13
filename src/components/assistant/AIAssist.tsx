import { ChatInterface } from "./ChatInterface";
import { useState } from "react";
import { MessageCircleIcon, XIcon } from "lucide-react";
import { aiService } from "@/services/AiService";
import { useWorkflowStore } from "@/store/workflowStore";
import type { NodeType } from "@/types/domain";
import notifyService from "@/services/NotifyService";

export function AIAssist() {
  const [isOpen, setIsOpen] = useState(false);
  const { workflow } = useWorkflowStore();

  const workflowJson = JSON.stringify(workflow);

  const handleSendMessage = async (message: string) => {
    try {
      const response = await aiService.processWorkflowModification(
        message,
        workflowJson,
      );
      
      // Handle API key missing error
      if (!response.success && response.message.includes("OpenAI API key")) {
        notifyService.error(response.message);
        return response.message;
      }

      // If we have modifications, apply them to the workflow
      if (response.modifications && response.modifications.length > 0) {
        const { addNode, connectNodes, deleteNode } = useWorkflowStore.getState();
        let nodesAdded = 0;
        let connectionsAdded = 0;

        // Process each modification
        for (const modification of response.modifications) {
          switch (modification.type) {
            case "add_node":
              if (modification.data.position && modification.data.name) {
                const position = modification.data.position as { x: number; y: number };
                
                addNode({
                  id: modification.data.id,
                  x: position.x,
                  y: position.y,
                  name: modification.data.name as string,
                  type: (modification.data.type as NodeType) || "task",
                  variables: (modification.data.variables as Record<string, string>) || {},
                });
                nodesAdded++;
              }
              break;

            case "connect_nodes":
              if (modification.data.from && modification.data.to) {
                const source = modification.data.from as string;
                const target = modification.data.to as string;
                // Get fresh workflow state to see newly added nodes
                const freshWorkflow = useWorkflowStore.getState().workflow;
                const nodeFrom = freshWorkflow.nodes.find((node) => node.id === source);
                const nodeTo = freshWorkflow.nodes.find((node) => node.id === target);
                // Only connect if both nodes exist
                if (nodeFrom && nodeTo) {
                  connectNodes(source, target);
                  connectionsAdded++;
                }
              }
              break;

            case "delete_node":
              if (modification.data.id) {
                const nodeId = modification.data.id as string;
                deleteNode(nodeId);
              }
              break;
          }
        }

        // Show success notification
        if (nodesAdded > 0 || connectionsAdded > 0) {
          notifyService.success(
            `Workflow Updated: Added ${nodesAdded} node(s) and ${connectionsAdded} connection(s)`,
          );
        }
      } else if (!response.success) {
        // Show error notification for failed requests
        notifyService.error("Could not process your request. Please try rephrasing your command.");
      }

      return response.message;
    } catch (error) {
      notifyService.error(`An unexpected error occurred. Please try again. ${error}`);
      return "Sorry, I encountered an error processing your request.";
    }
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
