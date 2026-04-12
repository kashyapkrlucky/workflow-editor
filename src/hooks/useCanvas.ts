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

  return { setupCanvas };
};