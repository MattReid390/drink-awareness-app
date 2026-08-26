// Design system color tokens - doc 10
// Used across all components and screens

export const Colors = {
  //Primary brand colors
  navy: '#1B3A5C', // App bars, headings, primary text
  blue: '#2E6DA4', // Buttons, active icons, links, borders
  lightBlue: '#D6E8F7', // Insight cards, preset pills, info surfaces

  // Surface colors
  white: '#FFFFFF', // Screen backgrounds, cards, nav bar
  surfaceGrey: '#F2F5F8', // Section headers, strips, inactive fields
  border: '#C5D8EC', // Dividers, card borders, muted icons

  // Semantic colors - used sparingly and only or meaning
  green: '#1A5C35', // Success states only
  amber: '#7A5C00', // Warning states only
  red: '#5C1A1A', // Destructive actions only (e.g. reset data)
  errorBg: '#F9E8E8', // Light red background for error messages

  // Text roles - named by purpose rather than appearance
  textPrimary: '#1B3A5C', // Main context text
  textAccent: '#2E6DA4', // Secondary text, labels, sub-labels
  textLight: '#D6E8F7', // Text on dark backgrounds (e.g. age confirmation screen)
  textMuted: '#C5D8EC', // Inactive nav labels, placeholder text

  // Grayscale - used for inputs, placeholders, and borders
  gray: '#8B95A8', // Input placeholder text, secondary labels
  lightGray: '#D1D9E3', // Light borders, disabled elements
} as const;

// Allows TypeScript to validate color references throughout the app
export type ColorKey = keyof typeof Colors;
