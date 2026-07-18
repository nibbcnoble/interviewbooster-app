import { COLORS, TERMINAL_FONT_STACK } from '../colors';

describe('COLORS palette', () => {
  const requiredKeys = [
    'bg',
    'panel',
    'panelBorder',
    'titlebar',
    'dot',
    'text',
    'textDim',
    'textMuted',
    'cursor',
    'error',
    'amber',
    'powderBlue',
  ];

  it('defines every semantic colour key', () => {
    requiredKeys.forEach((key) => {
      expect(COLORS).toHaveProperty(key);
    });
  });

  it('uses valid hex colour values throughout', () => {
    Object.values(COLORS).forEach((value) => {
      expect(value).toMatch(/^#[0-9a-fA-F]{3,8}$/);
    });
  });
});

describe('TERMINAL_FONT_STACK', () => {
  it('is a monospace font stack', () => {
    expect(typeof TERMINAL_FONT_STACK).toBe('string');
    expect(TERMINAL_FONT_STACK).toContain('monospace');
  });
});
