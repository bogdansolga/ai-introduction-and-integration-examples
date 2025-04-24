import fs from 'fs/promises';
import path from 'path';
import Papa from 'papaparse';

// Define types
export interface LLMData {
    [key: string]: string | boolean;
}

export interface DataResult {
    llmData: LLMData[];
    headers: string[];
    hasDataError: boolean;
}

// Central function to load LLM data from CSV
export async function loadLLMData(): Promise<DataResult> {
    try {
        // Get the path to the CSV file
        const CSV_FILE_PATH = path.join(process.cwd(), 'public', 'llms-data.csv');

        // Read the CSV file
        const fileContent = await fs.readFile(CSV_FILE_PATH, 'utf8');

        // Parse the CSV file
        const result = Papa.parse(fileContent, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            transformHeader: (header) => header.trim() // Ensure headers are trimmed
        });

        // Extract headers and data
        const headers = result.meta.fields || [];
        const llmData = result.data as LLMData[];

        return {
            llmData,
            headers,
            hasDataError: false
        };
    } catch (error) {
        console.error('Error loading LLM data:', error);

        // Return empty data with error flag
        return {
            llmData: [],
            headers: [],
            hasDataError: true
        };
    }
}