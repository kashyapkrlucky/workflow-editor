import { useCanvas } from "@/hooks/useCanvas";
import { useEffect, useRef } from "react";

export function CanvasEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setupCanvas } = useCanvas(canvasRef);

  useEffect(() => {
    setupCanvas();
  }, [setupCanvas]);

  return <canvas className="w-full h-full bg-gray-50" ref={canvasRef}></canvas>;
}
