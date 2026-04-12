import { CANVAS_CONSTANTS } from "@/constants";
import { useCanvas } from "@/hooks/useCanvas";
import { useCallback, useEffect, useRef } from "react";

export function CanvasEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setupCanvas, clearCanvas } = useCanvas(canvasRef);

  // Get canvas context
  const getCanvasContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    return ctx;
  };

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
  }, [clearCanvas, drawGrid]);

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

  return <canvas className="w-full h-full bg-gray-50" ref={canvasRef}></canvas>;
}
