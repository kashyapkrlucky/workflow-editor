/**
 * Defines the different types of nodes that can exist in a workflow.
 * Each node type represents a specific action or state in the workflow.
 */
export type NodeType =
  | "start"           // Entry point of the workflow
  | "task"            // Generic task node
  | "end"             // Exit point of the workflow
  | "custom"          // Custom user-defined node type
  | "create_policy"   // Node for creating policies
  | "send_email";     // Node for sending emails

/**
 * Represents a single node in the workflow graph.
 * Nodes are the building blocks of workflows and contain position and type information.
 */
export type Node = {
  id: string;                    // Unique identifier for the node
  name: string;                  // Name of the node
  type: NodeType;               // The type/functionality of this node
  x: number;                    // X coordinate position on the canvas
  y: number;                    // Y coordinate position on the canvas
  variables?: Record<string, string>; // Optional key-value pairs for node configuration
};

/**
 * Represents a connection between two nodes in the workflow.
 * Edges define the flow and dependencies between nodes.
 */
export type Edge = {
  id: string;        // Unique identifier for this edge
  source: string;    // ID of the source node (where the edge originates)
  target: string;    // ID of the target node (where the edge ends)
};

/**
 * Represents the complete workflow structure.
 * A workflow is composed of nodes and the edges that connect them.
 */
export type Workflow = {
  nodes: Node[];    // Array of all nodes in the workflow
  edges: Edge[];    // Array of all edges connecting the nodes
};

/**
 * Represents a connection handle on a node.
 * Handles are the visual points where edges can be attached to nodes.
 */
export interface ConnectionHandle {
  x: number;                    // X coordinate of the handle position
  y: number;                    // Y coordinate of the handle position
  type: "source" | "target";    // Whether this handle outputs or accepts connections
  node: Node;                   // Reference to the parent node this handle belongs to
}