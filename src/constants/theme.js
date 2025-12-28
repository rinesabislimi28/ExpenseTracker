/**
 * Application Color Palette
 * Defines the main brand colors, text hierarchy, and category-specific colors.
 */
export const COLORS = {
  // Brand Colors
  primary: "#4338ca",
  primaryLight: "#6366f1",
  background: "#f8fafc",
  card: "#ffffff",

  // Text Hierarchy
  textPrimary: "#1e293b",
  textSecondary: "#64748b",
  textTertiary: "#94a3b8",

  // Action & Feedback
  danger: "#ef4444",
  error: "#ef4444", // Alias for danger
  success: "#10b981",
  border: "#e2e8f0",

  // Expense Categories
  catFood: "#f59e0b",      // Amber
  catTransport: "#3b82f6",  // Blue
  catEnt: "#8b5cf6",        // Violet
  catShop: "#ec4899",       // Pink
  catBills: "#ef4444",      // Red
  catOther: "#64748b",      // Slate
};

/**
 * Layout & Typography Sizes
 * Standardized padding, border radius, and font sizes.
 */
export const SIZES = {
  padding: 24,
  radius: 20,
  h1: 30,
  h2: 22,
  body: 15,
};

/**
 * Global Shadow Styles
 * Used for cards and containers to provide depth.
 */
export const SHADOWS = {
  soft: {
    shadowColor: "#64748b",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },
  card: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
};