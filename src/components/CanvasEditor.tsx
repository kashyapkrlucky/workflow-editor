import { CANVAS_CONSTANTS, TYPOGRAPHY } from "@/constants";
import {
  useCanvas,
  useMousePosition,
  useNodeAtPosition,
} from "@/hooks/useCanvas";
import { useNodes, useWorkflowStore } from "@/store/workflowStore";
import type { Node } from "@/types/domain";
import { getNodeColor } from "@/utils/canvas";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";

export function CanvasEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setupCanvas, clearCanvas } = useCanvas(canvasRef);
  const { selectedNodeId, setSelectedNode, updateNode } = useWorkflowStore();

  const [isDragging, setIsDragging] = useState(false);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const nodes = useNodes();
  const { getMousePosition } = useMousePosition(canvasRef);
  const { getNodeAtPosition } = useNodeAtPosition(nodes);
  // Get canvas context
  const getCanvasContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    return ctx;
  };

  const drawNode = useCallback(
    (ctx: CanvasRenderingContext2D, node: Node) => {
      const { x, y, type, variables } = node;
      const nodeColor = getNodeColor(type);

      //
      ctx.shadowColor = CANVAS_CONSTANTS.NODE_SHADOW;
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;

      // Draw node background
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(
        x,
        y,
        CANVAS_CONSTANTS.NODE_WIDTH,
        CANVAS_CONSTANTS.NODE_HEIGHT,
        8,
      );
      ctx.fill();

      // Draw node border
      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw header
      ctx.fillStyle = nodeColor;
      ctx.beginPath();
      ctx.roundRect(
        x,
        y,
        CANVAS_CONSTANTS.NODE_WIDTH,
        CANVAS_CONSTANTS.NODE_HEADER_HEIGHT,
        [8, 8, 0, 0],
      );
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = `${TYPOGRAPHY.FONT_SIZE.TITLE}px ${TYPOGRAPHY.FONT_FAMILY}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(type.toUpperCase(), x + 30, y + 20);

      // Draw more menu indicator (three dots)
      ctx.fillStyle = "#ffffff";
      ctx.font = "16px sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText("...", x + CANVAS_CONSTANTS.NODE_WIDTH - 15, y + 20);

      // Draw content area
      ctx.fillStyle = TYPOGRAPHY.COLORS.BODY;
      ctx.font = `${TYPOGRAPHY.FONT_SIZE.BODY}px ${TYPOGRAPHY.FONT_FAMILY}`;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText(
        "Variables",
        x + CANVAS_CONSTANTS.NODE_PADDING,
        y + CANVAS_CONSTANTS.NODE_HEADER_HEIGHT + 12,
      );

      // Draw JSON preview
      ctx.fillStyle = TYPOGRAPHY.COLORS.JSON;
      ctx.font = `${TYPOGRAPHY.FONT_SIZE.JSON}px ${TYPOGRAPHY.FONT_FAMILY}`;
      const jsonStr = JSON.stringify(variables || {});
      const lines = jsonStr.match(/.{1,30}/g) || [];
      lines.slice(0, 3).forEach((line, index) => {
        ctx.fillText(
          line,
          x + CANVAS_CONSTANTS.NODE_PADDING,
          y + CANVAS_CONSTANTS.NODE_HEADER_HEIGHT + 30 + index * 12,
        );
      });

      if (type !== "end") {
        // Draw connection handles
        // Source handle (right)
        ctx.fillStyle = nodeColor;
        ctx.beginPath();
        ctx.arc(
          x + CANVAS_CONSTANTS.NODE_WIDTH,
          y + CANVAS_CONSTANTS.NODE_HEADER_HEIGHT / 2,
          CANVAS_CONSTANTS.HANDLE_RADIUS,
          0,
          Math.PI * 2,
        );
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(
          x + CANVAS_CONSTANTS.NODE_WIDTH,
          y + CANVAS_CONSTANTS.NODE_HEADER_HEIGHT / 2,
          CANVAS_CONSTANTS.HANDLE_DOT_RADIUS,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }

      if (type !== "start") {
        // Target handle (left)
        ctx.fillStyle = nodeColor;
        ctx.beginPath();
        ctx.arc(
          x,
          y + CANVAS_CONSTANTS.NODE_HEADER_HEIGHT / 2,
          CANVAS_CONSTANTS.HANDLE_RADIUS,
          0,
          Math.PI * 2,
        );
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(
          x,
          y + CANVAS_CONSTANTS.NODE_HEADER_HEIGHT / 2,
          CANVAS_CONSTANTS.HANDLE_DOT_RADIUS,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }

      // Highlight selected node
      if (selectedNodeId === node.id) {
        ctx.strokeStyle = nodeColor;
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.roundRect(
          x - 2,
          y - 2,
          CANVAS_CONSTANTS.NODE_WIDTH + 4,
          CANVAS_CONSTANTS.NODE_HEIGHT + 4,
          8,
        );
        ctx.stroke();
        ctx.setLineDash([]);
      }
    },
    [selectedNodeId],
  );

  // Draw grid on canvas
  const drawGrid = useCallback(() => {
    const ctx = getCanvasContext();
    if (!ctx) return;

    // set bg color
    ctx.fillStyle = CANVAS_CONSTANTS.BACKGROUND_COLOR;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // draw dotted grid
    ctx.fillStyle = CANVAS_CONSTANTS.GRID_COLOR;
    const spacing = CANVAS_CONSTANTS.GRID_SIZE;

    for (let x = spacing; x < ctx.canvas.width; x += spacing) {
      for (let y = spacing; y < ctx.canvas.height; y += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, CANVAS_CONSTANTS.GRID_DOT_SIZE, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, []);

  // Initialize canvas with grid
  const initializeCanvas = useCallback(() => {
    const ctx = getCanvasContext();
    if (!ctx) return;
    clearCanvas();
    drawGrid();

    // Draw nodes
    Object.values(nodes).forEach((node) => {
      drawNode(ctx, node);
    });
  }, [clearCanvas, drawGrid, drawNode, nodes]);

  // Handle context menu (right-click) on canvas
  const handleContextMenu = useCallback((e: MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
  }, []);

  // Handle mouse down
  const handleMouseDown = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const node = getNodeAtPosition(x, y);

      if (node) {
        setSelectedNode(node.id);
        setIsDragging(true);
        setDraggedNode(node.id);
        setDragOffset({ x: x - node.x, y: y - node.y });
      } else {
        setSelectedNode(null);
      }
    },
    [getNodeAtPosition, setSelectedNode],
  );

  // Handle mouse move
  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const { x, y } = getMousePosition(e);

      // Handle dragging
      if (isDragging && draggedNode) {
        const node = nodes.find((n) => n.id === draggedNode);
        if (node) {
          updateNode(node.id, { x: x - dragOffset.x, y: y - dragOffset.y });
        }
      }
    },
    [isDragging, draggedNode, nodes, dragOffset, getMousePosition, updateNode],
  );

  // Handle mouse up
  const handleMouseUp = useCallback((e: MouseEvent<HTMLCanvasElement>) => {
    console.log("Mouse up", e);
    setIsDragging(false);
    setDraggedNode(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  // Setup canvas and drawing
  useEffect(() => {
    setupCanvas();
  }, [setupCanvas]);

  // Handle window resize to update canvas size
  useEffect(() => {
    const handleResize = () => {
      setupCanvas();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setupCanvas]);

  useEffect(() => {
    initializeCanvas();
  }, [initializeCanvas]);

  return (
    <canvas
      className="w-full h-full bg-gray-50"
      ref={canvasRef}
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    ></canvas>
  );
}
