import { CANVAS_CONSTANTS } from "@/constants";
import { useCallback } from "react";

export const useCanvas = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
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