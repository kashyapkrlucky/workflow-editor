import type { Node } from "@/types/domain";

/**
 * Get node color based on type
 */
export const getNodeColor = (type: Node["type"]): string => {
  const colors = {
    start: "#10b981",
    task: "#3b82f6",
    end: "#ef4444",
    custom: "#8b5cf6",
  };
  return colors[type] || colors.task;
};
