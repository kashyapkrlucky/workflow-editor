import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isWebComponent = mode === "web-component";

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: isWebComponent
      ? {
          lib: {
            entry: "src/index.ts",
            name: "WorkflowEditor",
            fileName: "workflow-editor",
            formats: ["es", "umd"],
          },
          rollupOptions: {
            // No external dependencies - bundle everything
          },
        }
      : undefined,
    define: {
      ...(isWebComponent
        ? {
            "process.env.NODE_ENV": JSON.stringify("production"),
          }
        : {}),
    },
  };
});
