// Configuration options for the LLM visualization

// Data loading method options:
// - 'csv': Load CSV data directly from the public directory
// - 'api': Load data from the API endpoint
export const DATA_LOADING_METHOD = 'csv';

// Path to the CSV file (relative to the public directory)
export const CSV_FILE_PATH = 'llms-data.csv';

// API endpoint for loading data
export const API_ENDPOINT = '/api/llms-data';

// Visualization options
export const VISUALIZATION_CONFIG = {
    // Date displayed in the visualization header
    displayDate: 'April 27 2025',

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