// Configuration options for the LLM visualization

// Visualization options
export const VISUALIZATION_CONFIG = {
    // Date displayed in the visualization header
    displayDate: 'May 19 2025',

    // Minimum context window size (in tokens) thresholds for color coding
    contextWindowThresholds: {
        high: 100, // Green
        medium: 20, // Yellow
        low: 0,    // Orange
    },

    // Enable or disable specific visualizations
    showContextWindowChart: true,

    // Number of models to display per row in the context window chart
    modelsPerRow: 6,
};