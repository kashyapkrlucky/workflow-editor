import { CANVAS_CONSTANTS, EDGE_COLORS, TYPOGRAPHY } from "@/constants";
import {
  useCanvas,
  useMousePosition,
  useNodeAtPosition,
} from "@/hooks/useCanvas";
import { useEdges, useNodes, useWorkflowStore } from "@/store/workflowStore";
import type { Edge, Node } from "@/types/domain";
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
  const { selectedNodeId, setSelectedNode, updateNode, connectNodes } =
    useWorkflowStore();

  const [isDragging, setIsDragging] = useState(false);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [isConnecting, setIsConnecting] = useState(false);
  const [sourceNode, setSourceNode] = useState<string | null>(null);
  const [connectionStart, setConnectionStart] = useState({ x: 0, y: 0 });
  const [connectionEnd, setConnectionEnd] = useState({ x: 0, y: 0 });

  const nodes = useNodes();
  const edges = useEdges();
  const { getMousePosition } = useMousePosition(canvasRef);
  const { getNodeAtPosition, getConnectionHandleAtPosition } =
    useNodeAtPosition(nodes);

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
      const { x, y, name, type, variables } = node;
      const nodeColor = getNodeColor(type);

      const isPillNode = type === "start" || type === "end" || type === "task";

      if (isPillNode) {
        // Draw basic node as pill-like design
        const pillWidth = 120;
        const pillHeight = 40;
        const pillRadius = pillHeight / 2;

        // Draw shadow
        ctx.shadowColor = CANVAS_CONSTANTS.NODE_SHADOW;
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;

        // Draw pill background
        ctx.fillStyle = nodeColor;
        ctx.beginPath();
        ctx.roundRect(x, y, pillWidth, pillHeight, pillRadius);
        ctx.fill();

        // Reset shadow
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Draw text
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${TYPOGRAPHY.FONT_SIZE.TITLE}px ${TYPOGRAPHY.FONT_FAMILY}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          name.toUpperCase(),
          x + pillWidth / 2,
          y + pillHeight / 2,
        );

        // Draw connection handles
        // Source handle (right) - only for start and end
        if (type !== 'end') {
          ctx.fillStyle = "#ffffff";
          ctx.strokeStyle = nodeColor;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x + pillWidth, y + pillHeight / 2, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = nodeColor;
          ctx.beginPath();
          ctx.arc(x + pillWidth, y + pillHeight / 2, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Target handle (left) - only for end
        if (type !== 'start') {
          ctx.fillStyle = "#ffffff";
          ctx.strokeStyle = nodeColor;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x, y + pillHeight / 2, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = nodeColor;
          ctx.beginPath();
          ctx.arc(x, y + pillHeight / 2, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Highlight selected basic node
        if (selectedNodeId === node.id) {
          ctx.strokeStyle = nodeColor;
          ctx.lineWidth = 3;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.roundRect(x - 3, y - 3, pillWidth + 6, pillHeight + 6, pillRadius + 3);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      } else {
        // Draw custom node with current design
        // Draw node shadow
        ctx.shadowColor = CANVAS_CONSTANTS.NODE_SHADOW;
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;

        // Draw node background with gradient
        const gradient = ctx.createLinearGradient(
          x,
          y,
          x,
          y + CANVAS_CONSTANTS.NODE_HEIGHT,
        );
        gradient.addColorStop(0, "#ffffff");
        gradient.addColorStop(1, "#f8fafc");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(
          x,
          y,
          CANVAS_CONSTANTS.NODE_WIDTH,
          CANVAS_CONSTANTS.NODE_HEIGHT,
          8,
        );
        ctx.fill();

        // Reset shadow
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Draw border
        ctx.strokeStyle = nodeColor;
        ctx.lineWidth = 2;
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

        // Draw title
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${TYPOGRAPHY.FONT_SIZE.TITLE}px ${TYPOGRAPHY.FONT_FAMILY}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          name.toUpperCase(),
          x + CANVAS_CONSTANTS.NODE_WIDTH / 2,
          y + CANVAS_CONSTANTS.NODE_HEADER_HEIGHT / 2,
        );

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

        // Highlight selected custom node
        if (selectedNodeId === node.id) {
          ctx.strokeStyle = nodeColor;
          ctx.lineWidth = 3;
          ctx.setLineDash([5, 5]);
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
      }
    },
    [selectedNodeId],
  );

  /**
   * Draw edge with arrow
   */
  const drawEdge = useCallback(
    (ctx: CanvasRenderingContext2D, edge: Edge) => {
      const fromNode = nodes.find((node) => node.id === edge.source);
      const toNode = nodes.find((node) => node.id === edge.target);
      if (!fromNode || !toNode) return;

      const isFromPillNode = fromNode.type === "start" || fromNode.type === "end" || fromNode.type === "task";
      const isToPillNode = toNode.type === "start" || toNode.type === "end" || toNode.type === "task";

      const startX = isFromPillNode 
        ? fromNode.x + CANVAS_CONSTANTS.NODE_PILL_WIDTH 
        : fromNode.x + CANVAS_CONSTANTS.NODE_WIDTH;
      const startY = isFromPillNode 
        ? fromNode.y + CANVAS_CONSTANTS.NODE_PILL_HEIGHT / 2 
        : fromNode.y + CANVAS_CONSTANTS.NODE_HEADER_HEIGHT / 2;
      const endX = toNode.x;
      const endY = isToPillNode 
        ? toNode.y + CANVAS_CONSTANTS.NODE_PILL_HEIGHT / 2 
        : toNode.y + CANVAS_CONSTANTS.NODE_HEADER_HEIGHT / 2;

      // Calculate control points for bezier curve
      const dx = endX - startX;
      const cx1 = startX + dx * 0.5;
      const cy1 = startY;
      const cx2 = startX + dx * 0.5;
      const cy2 = endY;

      // Draw curved path
      ctx.strokeStyle = EDGE_COLORS.DEFAULT;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.bezierCurveTo(cx1, cy1, cx2, cy2, endX, endY);
      ctx.stroke();

      // Draw arrowhead
      const angle = Math.atan2(endY - cy2, endX - cx2);
      ctx.save();
      ctx.translate(endX, endY);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-10, -5);
      ctx.lineTo(-10, 5);
      ctx.closePath();
      ctx.fillStyle = EDGE_COLORS.DEFAULT;
      ctx.fill();
      ctx.restore();
    },
    [nodes],
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

    // Draw edges
    Object.values(edges).forEach((edge) => {
      drawEdge(ctx, edge);
    });

    // Draw temporary connection
    if (isConnecting && connectionStart && connectionEnd) {
      ctx.strokeStyle = EDGE_COLORS.TEMP;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(connectionStart.x, connectionStart.y);
      ctx.lineTo(connectionEnd.x, connectionEnd.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw nodes
    Object.values(nodes).forEach((node) => {
      drawNode(ctx, node);
    });
  }, [
    clearCanvas,
    drawGrid,
    drawNode,
    nodes,
    isConnecting,
    connectionStart,
    connectionEnd,
    edges,
    drawEdge,
  ]);

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

      // Check for connection handles
      const handle = getConnectionHandleAtPosition(x, y);
      if (handle && handle.type === "source") {
        setIsConnecting(true);
        setSourceNode(handle.node.id);
        setConnectionStart({ x: handle.x, y: handle.y });
        setConnectionEnd({ x: handle.x, y: handle.y });
        return;
      }
      if (node) {
        setSelectedNode(node.id);
        setIsDragging(true);
        setDraggedNode(node.id);
        setDragOffset({ x: x - node.x, y: y - node.y });
      } else {
        setSelectedNode(null);
      }
    },
    [getNodeAtPosition, setSelectedNode, getConnectionHandleAtPosition],
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
      } else if (isConnecting && connectionStart) {
        setConnectionEnd({ x, y });
      }
    },
    [
      isDragging,
      draggedNode,
      nodes,
      dragOffset,
      getMousePosition,
      updateNode,
      isConnecting,
      connectionStart,
    ],
  );

  // Handle mouse up
  const handleMouseUp = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      if (isConnecting && sourceNode) {
        const { x, y } = getMousePosition(e);
        const handle = getConnectionHandleAtPosition(x, y);
        if (
          handle &&
          handle.type === "target" &&
          handle.node.id !== sourceNode
        ) {
          connectNodes(sourceNode, handle.node.id);
        }
      }
      setIsDragging(false);
      setDraggedNode(null);
      setDragOffset({ x: 0, y: 0 });
      setIsConnecting(false);
      setConnectionStart({ x: 0, y: 0 });
      setConnectionEnd({ x: 0, y: 0 });
      setSourceNode(null);
    },
    [
      isConnecting,
      sourceNode,
      getConnectionHandleAtPosition,
      getMousePosition,
      connectNodes,
    ],
  );

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
      className="bg-gray-50 w-full h-full"
      ref={canvasRef}
      width="1366"
      height="768"
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    ></canvas>
  );
}
