export const CANVAS_CONSTANTS = {
  GRID_SIZE: 20,
  GRID_COLOR: "#e5e7eb",
  GRID_DOT_SIZE: 1,
  BACKGROUND_COLOR: "#FCFCFC",
  NODE_SHADOW: 'rgba(0, 0, 0, 0.1) 0 4px 6px -1px',
  NODE_WIDTH: 180,
  NODE_HEIGHT: 100,
  NODE_HEADER_HEIGHT: 40,
  NODE_PADDING: 12,
  HANDLE_RADIUS: 6,
  HANDLE_DOT_RADIUS: 3,
} as const;



/**
 * Node type colors
 */
export const NODE_COLORS = {
  start: '#10b981',
  task: '#3b82f6', 
  end: '#ef4444',
  custom: '#8b5cf6',
} as const;

/**
 * Edge colors
 */
export const EDGE_COLORS = {
  DEFAULT: '#12d7f1',
  HOVER: '#f59e0b',
  TEMP: '#9ca3af',
} as const;

/**
 * Typography
 */
export const TYPOGRAPHY = {
  FONT_FAMILY: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  FONT_SIZE: {
    TITLE: 12,
    BODY: 10,
    JSON: 9,
  },
  COLORS: {
    TITLE: '#111827',
    BODY: '#4b5563',
    JSON: '#6b7280',
    LABEL: '#374151',
  },
} as const;

/**
 * Z-index layers
 */
export const Z_INDEX = {
  GRID: 1,
  EDGES: 2,
  NODES: 3,
  HANDLES: 4,
} as const;


/**
 * AI Assistant Content
 */
export const CONTENT = {
  assistant: {
    name: "Workflow Assistant",
    description: "Powered by OpenAI",
    initialMessage: "Hello! How can I help you today?",
  },
} as const;


/**
 * Notify Colors
 */
export const NOTIFY_COLORS = {
  success: "bg-green-600",
  error: "bg-red-600",
  info: "bg-blue-600",
  warning: "bg-amber-600",
} as const;
