// Central palette shared by every screen and module.
// Add new semantic colors here rather than inlining hex values elsewhere.

export interface Palette {
  bg: string;
  panel: string;
  panelBorder: string;
  titlebar: string;
  dot: string;
  text: string;
  textDim: string;
  textMuted: string;
  cursor: string;
  error: string;
  amber: string;
  powderBlue: string;
}

export const COLORS: Palette = {
  bg: '#1b1d1b',
  panel: '#242624',
  panelBorder: '#3a3d3a',
  titlebar: '#2c2f2c',
  dot: '#ffa657',
  text: '#6fef6f',
  textDim: '#3f8f42',
  textMuted: '#5a6b5a',
  cursor: '#6fef6f',
  error: '#ff5c5c',
  amber: '#ffb454',
  powderBlue: '#b0e0e6',
};

export const TERMINAL_FONT_STACK: string =
  '"JetBrains Mono", "Fira Code", ui-monospace, "SF Mono", "Cascadia Code", Menlo, Consolas, monospace';
