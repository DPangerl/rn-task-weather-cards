/**
 * Medical-themed color palette for Skinster Health Environment Tracker
 * Colors are designed to convey trust, professionalism, and health-focused branding
 */

// Medical blue - trustworthy and professional
const tintColorLight = "#2E7D8F"; // Medical teal blue
const tintColorDark = "#4A9FB0"; // Lighter medical blue for dark mode

// Secondary medical colors
const medicalGreen = "#2D8659"; // Health/wellness green
const medicalBlue = "#1E5B7A"; // Deep medical blue

export const Colors = {
  light: {
    text: "#1A2B33", // Dark blue-gray for professional text
    background: "#FFFFFF", // Clean white background
    tint: tintColorLight, // Medical teal blue
    icon: "#5A7A85", // Muted blue-gray for icons
    tabIconDefault: "#7A8B94", // Lighter blue-gray for inactive tabs
    tabIconSelected: tintColorLight, // Medical teal for active tabs
    // Additional medical theme colors
    accent: medicalGreen, // Health green accent
    secondary: medicalBlue, // Deep medical blue
    surface: "#F8FAFB", // Very light blue-gray surface
    border: "#E1E8EB", // Light border color
  },
  dark: {
    text: "#E8F1F4", // Light blue-tinted text
    background: "#0F1619", // Dark blue-black background
    tint: tintColorDark, // Lighter medical blue
    icon: "#8FA5B0", // Muted light blue for icons
    tabIconDefault: "#6B8591", // Darker blue-gray for inactive tabs
    tabIconSelected: tintColorDark, // Light medical blue for active tabs
    // Additional medical theme colors for dark mode
    accent: "#3FA86B", // Brighter health green for dark mode
    secondary: "#4A8FB0", // Lighter medical blue
    surface: "#1A2328", // Dark blue surface
    border: "#2A3B42", // Dark border color
  },
};
