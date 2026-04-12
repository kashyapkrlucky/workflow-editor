import { create } from "zustand";

import { type Workflow, type Node, type Edge } from "@/types/domain";

/**
 * Interface defining the shape of the workflow store state.
 * Contains the workflow data, selection state, and all actions to manipulate the workflow.
 */
interface WorkflowState {
  workflow: Workflow;                                    // Current workflow with nodes and edges
  selectedNodeId: string | null;                        // ID of the currently selected node
  
  // Node management actions
  addNode: (node: Node) => void;                        // Add a new node to the workflow
  updateNode: (nodeId: string, updates: Partial<Node>) => void; // Update existing node properties
  deleteNode: (nodeId: string) => void;                 // Remove a node from the workflow
  
  // Selection and connection actions
  setSelectedNode: (nodeId: string | null) => void;      // Set the currently selected node
  connectNodes: (fromNodeId: string, toNodeId: string) => void; // Create an edge between two nodes
}

/**
 * Zustand store for managing workflow state.
 * Provides centralized state management for nodes, edges, and selection.
 */
export const useWorkflowStore = create<WorkflowState>((set) => ({
  // Initial state
  workflow: {
    nodes: [],    // Empty array of nodes initially
    edges: [],    // Empty array of edges initially
  },
  selectedNodeId: null,  // No node selected initially
  
  /**
   * Adds a new node to the workflow.
   * @param node - The node to add to the workflow
   */
  addNode: (node: Node) =>
    set((state) => ({
      workflow: {
        ...state.workflow,
        nodes: [...state.workflow.nodes, node],
      },
    })),
    
  /**
   * Updates an existing node with new properties.
   * @param nodeId - The ID of the node to update
   * @param updates - Partial node properties to merge with existing node
   */
  updateNode: (nodeId: string, updates: Partial<Node>) =>
    set((state) => ({
      workflow: {
        ...state.workflow,
        nodes: state.workflow.nodes.map((node) =>
          node.id === nodeId ? { ...node, ...updates } : node,
        ),
      },
    })),
  /**
   * Removes a node from the workflow by its ID.
   * @param nodeId - The ID of the node to remove
   */
  deleteNode: (nodeId: string) =>
    set((state) => ({
      workflow: {
        ...state.workflow,
        nodes: state.workflow.nodes.filter((node) => node.id !== nodeId),
      },
    })),
    
  /**
   * Sets the currently selected node.
   * @param nodeId - The ID of the node to select, or null to deselect
   */
  setSelectedNode: (nodeId: string | null) => {
    console.log("Setting selected node:", nodeId);
    set({ selectedNodeId: nodeId });
  },

  /**
   * Creates an edge connection between two nodes.
   * Prevents duplicate connections between the same nodes.
   * @param fromNodeId - The ID of the source node
   * @param toNodeId - The ID of the target node
   */
  connectNodes: (fromNodeId: string, toNodeId: string) => {
    set((state) => {
      const edgeId = `${fromNodeId}-${toNodeId}`;
      const existingEdge = Object.values(state.workflow.edges).find(
        (edge: Edge) => edge.source === fromNodeId && edge.target === toNodeId
      );

      // Don't create duplicate edges
      if (existingEdge) return state;

      const newEdge: Edge = {
        id: edgeId,
        source: fromNodeId,
        target: toNodeId
      };

      return {
        workflow: {
          ...state.workflow,
          edges: {
            ...state.workflow.edges,
            [edgeId]: newEdge
          }
        }
      };
    });
  },
}));

// Selector hooks for accessing specific parts of the store state

/**
 * Selector hook to get all nodes from the workflow.
 * @returns Array of all nodes in the current workflow
 */
export const useNodes = () => useWorkflowStore((state) => state.workflow.nodes);

/**
 * Selector hook to get all edges from the workflow.
 * @returns Array of all edges in the current workflow
 */
export const useEdges = () => useWorkflowStore((state) => state.workflow.edges);

/**
 * Selector hook to get the currently selected node ID.
 * @returns The ID of the currently selected node, or null if none is selected
 */
export const useSelectedNodeId = () =>
  useWorkflowStore((state) => state.selectedNodeId);
