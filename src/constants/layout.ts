export const LAYOUT = {
  HEADER_HEIGHT: '64px',
  SIDEBAR_WIDTH: '280px',
  CHAT_INPUT_HEIGHT: '80px',
  CONTAINER_MAX_WIDTH: '1280px',
  Z_INDEX: {
    HEADER: 100,
    SIDEBAR: 200,
    MODAL: 300,
    DROPDOWN: 400,
    TOOLTIP: 500,
  },
} as const;

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const; 