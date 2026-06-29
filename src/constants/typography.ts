// Design system typography tokens - doc 10
// Used across all components and screens

export const Typography = {
    // Font family
    fontFamily: 'Arial',

    // Font sizes
    fontSize: {
        heading: 28,    // Screen headings
        appBar: 18,     // App bar title
        body: 18,       // Body text (doc 10 default)
        label: 14,      // Row labels, field labels
        subLabel: 13,   // Secondary text, insight and card body
        small: 12,      // Sub-labels, unit counts, distances
        tiny: 11,       // Stat card labels, data-basis tags
        micro: 10,      // Nav tab labels, bar chart labels
    },

    // Font weights - React Native uses strings for weights
    fontWeight: {
        regular: '400' as const,    // Body text, inactive nav
        medium: '500' as const,     // Headings, buttons, active nav, card values
    },

    // Line heights
    lineHeight: {
        tight: 1,       // Large numbers in stat cards
        normal: 1.3,    // General text
        relaxed: 1.5,   // Insight card body copy
    },
} as const;