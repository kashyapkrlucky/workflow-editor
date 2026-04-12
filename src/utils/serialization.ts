import type { Workflow, Node, Edge } from '@/types/domain';

export const exportWorkflow = (workflow: Workflow): string => {
  return JSON.stringify(workflow, null, 2);
};

export const validateWorkflow = (data: unknown): data is Workflow => {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const workflow = data as Record<string, unknown>;

  // Check required structure
  if (!('nodes' in workflow) || !('edges' in workflow)) {
    return false;
  }

  // Validate nodes
  if (!validateNodes(workflow.nodes)) {
    return false;
  }

  // Validate edges
  if (!validateEdges(workflow.edges)) {
    return false;
  }

  return true;
};

const validateNodes = (nodes: unknown): nodes is Node[] => {
  if (!Array.isArray(nodes)) {
    return false;
  }

  for (const [index, node] of nodes.entries()) {
    if (!validateNode(node)) {
      console.error(`Invalid node at index ${index}:`, node);
      return false;
    }
  }

  return true;
};

const validateNode = (node: unknown): node is Node => {
  if (typeof node !== 'object' || node === null) {
    return false;
  }

  const nodeObj = node as Record<string, unknown>;

  // Check required properties
  const requiredProps = ['id', 'type', 'x', 'y'];
  for (const prop of requiredProps) {
    if (!(prop in nodeObj)) {
      console.error(`Missing required property: ${prop}`);
      return false;
    }
  }

  // Validate types
  if (typeof nodeObj.id !== 'string') return false;
  if (!['start', 'task', 'end', 'custom', 'create policy', 'send email'].includes(nodeObj.type as string)) return false;
  if (typeof nodeObj.x !== 'number') return false;
  if (typeof nodeObj.y !== 'number') return false;

  // Optional variables validation
  if ('variables' in nodeObj && nodeObj.variables !== undefined) {
    if (typeof nodeObj.variables !== 'object' || nodeObj.variables === null) {
      console.error('Variables must be an object');
      return false;
    }
  }

  return true;
};

const validateEdges = (edges: unknown): edges is Edge[] => {
  if (!Array.isArray(edges)) {
    return false;
  }

  for (const [index, edge] of edges.entries()) {
    if (!validateEdge(edge)) {
      console.error(`Invalid edge at index ${index}:`, edge);
      return false;
    }
  }

  return true;
};

const validateEdge = (edge: unknown): edge is Edge => {
  if (typeof edge !== 'object' || edge === null) {
    return false;
  }

  const edgeObj = edge as Record<string, unknown>;

  // Check required properties
  const requiredProps = ['id', 'source', 'target'];
  for (const prop of requiredProps) {
    if (!(prop in edgeObj)) {
      console.error(`Missing required edge property: ${prop}`);
      return false;
    }
  }

  // Validate types
  if (typeof edgeObj.id !== 'string') return false;
  if (typeof edgeObj.source !== 'string') return false;
  if (typeof edgeObj.target !== 'string') return false;

  return true;
};

export const importWorkflow = (jsonString: string): Workflow | null => {
  try {
    const data = JSON.parse(jsonString);
    
    if (!validateWorkflow(data)) {
      console.error('Invalid workflow format:', data);
      return null;
    }

    return data as Workflow;
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return null;
  }
};
