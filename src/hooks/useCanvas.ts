import { CANVAS_CONSTANTS } from "@/constants";
import type { ConnectionHandle, Node } from "@/types/domain";
import { useCallback, useRef } from "react";

export const useCanvas = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
  /**
   * Handle canvas resize with proper DPI scaling
   */
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    ctx.scale(dpr, dpr);
  }, [canvasRef]);

  /**
   * Clear canvas with white background
   */
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = CANVAS_CONSTANTS.BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [canvasRef]);

  return { setupCanvas, clearCanvas };
};

/**
 * Custom hook for mouse position tracking
 */
export const useMousePosition = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
) => {
  const mousePosition = useRef({ x: 0, y: 0 });

  const getMousePosition = useCallback(
    (e: React.MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      mousePosition.current = { x, y };
      return { x, y };
    },
    [canvasRef],
  );

  return { getMousePosition, mousePosition };
};

/**
 * Get node at position
 */
export const useNodeAtPosition = (nodes: Node[]) => {
  const getNodeAtPosition = useCallback(
    (x: number, y: number): Node | null => {
      const node = Object.values(nodes).find((node) =>
        isPointInRect(
          x,
          y,
          node.x,
          node.y,
          CANVAS_CONSTANTS.NODE_WIDTH,
          CANVAS_CONSTANTS.NODE_HEIGHT,
        ),
      );
      return node || null;
    },
    [nodes],
  );

  const getConnectionHandleAtPosition = useCallback(
    (x: number, y: number): ConnectionHandle | null => {
      for (const node of Object.values(nodes)) {
        const isPillNode = node.type === "start" || node.type === "end" || node.type === "task";
        
        // Check source handle (right side)
        const sourceHandleX = isPillNode 
          ? node.x + CANVAS_CONSTANTS.NODE_PILL_WIDTH 
          : node.x + CANVAS_CONSTANTS.NODE_WIDTH;
        const sourceHandleY = isPillNode 
          ? node.y + CANVAS_CONSTANTS.NODE_PILL_HEIGHT / 2 
          : node.y + CANVAS_CONSTANTS.NODE_HEADER_HEIGHT / 2;
        
        if (
          isPointInCircle(
            x,
            y,
            sourceHandleX,
            sourceHandleY,
            CANVAS_CONSTANTS.HANDLE_RADIUS,
          )
        ) {
          return {
            x: sourceHandleX,
            y: sourceHandleY,
            type: "source",
            node,
          };
        }

        // Check target handle (left side)
        const targetHandleY = isPillNode 
          ? node.y + CANVAS_CONSTANTS.NODE_PILL_HEIGHT / 2 
          : node.y + CANVAS_CONSTANTS.NODE_HEADER_HEIGHT / 2;
        
        if (
          isPointInCircle(
            x,
            y,
            node.x,
            targetHandleY,
            CANVAS_CONSTANTS.HANDLE_RADIUS,
          )
        ) {
          return {
            x: node.x,
            y: targetHandleY,
            type: "target",
            node,
          };
        }
      }
      return null;
    },
    [nodes],
  );

  return { getNodeAtPosition, getConnectionHandleAtPosition };
};

/**
 * Check if point is within rectangle bounds
 */
export const isPointInRect = (
  pointX: number,
  pointY: number,
  rectX: number,
  rectY: number,
  rectWidth: number,
  rectHeight: number,
): boolean => {
  return (
    pointX >= rectX &&
    pointX <= rectX + rectWidth &&
    pointY >= rectY &&
    pointY <= rectY + rectHeight
  );
};

/**
 * Check if point is within circle bounds
 */
export const isPointInCircle = (
  pointX: number,
  pointY: number,
  circleX: number,
  circleY: number,
  radius: number,
): boolean => {
  return calculateDistance(pointX, pointY, circleX, circleY) <= radius;
};


export const calculateDistance = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};
