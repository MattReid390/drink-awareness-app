// Design system spacing tokens - doc 10
// Used to maintain consistent layout across all screens

export const Spacing = {
    // Base spacing units
    xs: 4,      // Tight gaps, icon-to-text
    sm: 8,      // Gap between cards, pills
    md: 12,     // Internal card padding (top/bottom)
    lg: 16,     // Screen edge padding, section padding
    xl: 24,     // Section gaps
    xxl: 32,    // Large section separation

    // Component-specific spacing
    cardPaddingVertical: 10,        // Stat card top/bottom padding
    cardPaddingHorizontal: 12,      // Stat card left/right padding
    cardBorderRadius: 8,            // Standard card corner radius
    pillBorderRadius: 20,           // Preset pill corner radius
    inputBorderRadius: 6,           // Form input corner radius
    avatarBorderRadius: 50,         // Circular elements (e.g. empty state icon)

    // Fixed heights - match wireframe zone specs
    statusBar: 44,
    appBar: 55,
    bottomNav: 56,
    sectionHeader: 33,
    dateStrip: 40,
    rowHeight: 56,
    buttonHeight: 48,
    inputHeight: 32,
    accentBarWidth: 3,      // Left accent bar on drink entry rows
} as const;