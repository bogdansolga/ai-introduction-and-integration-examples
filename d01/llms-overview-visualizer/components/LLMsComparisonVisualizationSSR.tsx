import React from 'react';
import { VISUALIZATION_CONFIG } from '@/config/config';

// Define a type for our LLM data
interface LLMData {
    [key: string]: string | boolean;
}

interface LLMsComparisonVisualizationProps {
    llmData: LLMData[];
    headers: string[];
}

const LLMsComparisonVisualizationSSR = ({
                                            llmData,
                                            headers
                                        }: LLMsComparisonVisualizationProps) => {

    // Render capability cell with appropriate color
    const CapabilityCell = ({ value }: { value: string | boolean }) => {
        // Convert string values to boolean if needed (handles "Yes"/"No" or "true"/"false")
        let boolValue = false;
        if (typeof value === 'boolean') {
            boolValue = value;
        } else {
            boolValue = value.toLowerCase() === 'yes' ||
                value.toLowerCase() === 'true' ||
                value.toLowerCase().includes('yes') ||
                value.toLowerCase().includes('✓') ||
                value.toLowerCase().includes('advanced') ||
                value.toLowerCase().includes('excellent');
        }

        const bgColor = boolValue ? 'bg-green-100' : 'bg-red-100';
        const textColor = boolValue ? 'text-green-800' : 'text-orange-800';
        const icon = boolValue ? '✓' : '✗';

        return (
            <td className={`${bgColor} ${textColor} text-center p-2 border`}>
                {icon}
            </td>
        );
    };

    // Helper function to get a background color class based on context window size
    const getContextWindowColor = (value: string) => {
        // Extract numeric values if provided in format like "1M" or "128K"
        let size = 0;
        // Try to extract numeric values followed by K, M or other indicators
        const match = value.match(/(\d+)([KMG])?/i);
        if (match) {
            size = parseInt(match[1], 10);
            const unit = match[2]?.toUpperCase();

            // Adjust based on unit (K, M, G)
            if (unit === 'M') size *= 1000;
            if (unit === 'G') size *= 1000000;
        }

        const { high, medium } = VISUALIZATION_CONFIG.contextWindowThresholds;

        if (size >= high) return 'bg-green-100 text-green-800';
        if (size >= medium) return 'bg-yellow-100 text-yellow-800';
        return 'bg-orange-100 text-orange-800';
    };

    // Helper function to get a color for model type
    const getModelTypeColor = (type: string) => {
        const typeLower = type.toLowerCase();
        if (typeLower.includes('commercial')) return 'text-orange-700';
        if (typeLower.includes('open source')) return 'text-green-700';
        if (typeLower.includes('api')) return 'text-blue-700';
        return 'text-purple-700';
    };

    // Helper to determine if a column should be treated as capability column
    const isCapabilityColumn = (colName: string) => {
        const capabilityCols = [
            'image generation',
            'see images',
            'see video',
            'code execution',
            'reasoning'
        ];

        return capabilityCols.some(cap =>
            colName.toLowerCase().includes(cap)
        );
    };

    // Helper to extract context window size from string like "Yes (Good - 131K)"
    const extractContextSize = (value: string) => {
        if (!value) return '0K';

        // Try to find a pattern like "NNK" or "NM" or just digits
        const match = value.match(/(\d+)([KMG])/i);
        if (match) {
            return `${match[1]}${match[2].toUpperCase()}`;
        }

        return value;
    };

    if (headers.length === 0 || llmData.length === 0) {
        return <div className="p-4 text-center">No data available</div>;
    }

    // Find column indices for specific data we need
    const typeIndex = headers.findIndex(h => h.toLowerCase().includes('commercial'));
    const ownerIndex = headers.findIndex(h => h.toLowerCase().includes('owner'));
    const modelIndex = headers.findIndex(h => h.toLowerCase().includes('model'));
    const contextIndex = headers.findIndex(h => h.toLowerCase().includes('docs'));// || h.toLowerCase().includes('context')

    // Calculate max context size for bar chart scaling
    let maxContext = 0;
    llmData.forEach(m => {
        const val = String(m[headers[contextIndex] || ""]);
        const match = val.match(/(\d+)([KMG])/i);
        if (match) {
            let size = parseInt(match[1], 10);
            const unit = match[2]?.toUpperCase();
            if (unit === 'M') size *= 1000;
            if (unit === 'G') size *= 1000000;
            maxContext = Math.max(maxContext, size);
        }
    });

    return (
        <div className="p-4 w-full max-w-screen-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center text-white">LLMs Comparison ({VISUALIZATION_CONFIG.displayDate})</h1>

            {/* Capabilities Matrix */}
            <div className="mb-4">
                <h2 className="text-xl font-semibold mb-3 text-white">LLMs Capabilities Comparison</h2>
                <div className="overflow-x-auto ">
                    <table className="min-w-full bg-white border border-gray-300 rounded">
                        <thead>
                        <tr className="bg-blue-500 text-white">
                            {headers.map((header, index) => (
                                <th key={index} className="p-3 border text-center">
                                    {header.split('/').map((part, i) => (
                                        <React.Fragment key={i}>
                                            {i > 0 && <br/>}
                                            {part.trim()}
                                        </React.Fragment>
                                    ))}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {llmData.map((model, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-blue-100' : 'bg-white'}>
                                {headers.map((header, colIdx) => {
                                    const value = model[header];

                                    if (isCapabilityColumn(header)) {
                                        return <CapabilityCell key={colIdx} value={value} />;
                                    }

                                    if (colIdx === modelIndex) {
                                        return (
                                            <td key={colIdx} className="p-3 border font-medium text-black">
                                                {value}
                                            </td>
                                        );
                                    }

                                    if (colIdx === ownerIndex) {
                                        const modelType = String(model[headers[typeIndex] || ""] || "");
                                        return (
                                            <td key={colIdx} className={`p-3 border font-medium ${getModelTypeColor(modelType)}`}>
                                                {value}
                                            </td>
                                        );
                                    }

                                    if (colIdx === contextIndex) {
                                        return (
                                            <td key={colIdx} className={`p-3 border text-center font-medium ${getContextWindowColor(String(value))}`}>
                                                {extractContextSize(String(value))}
                                            </td>
                                        );
                                    }

                                    return (
                                        <td key={colIdx} className="p-3 border text-black">
                                            {value}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Context Window Visualization */}
            {VISUALIZATION_CONFIG.showContextWindowChart && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-white">Context Window Size Comparison</h2>
                    <div className="relative h-[500px] bg-white p-8 border border-gray-300 rounded">
                        <div className="flex flex-wrap justify-around items-end h-[300px]">
                            {llmData.map((model, idx) => {
                                // Get the context window size from the data
                                const contextValue = String(model[headers[contextIndex] || ""]);
                                const contextSizeMatch = contextValue.match(/(\d+)([KMG])/i);

                                let contextSize = 0;
                                if (contextSizeMatch) {
                                    contextSize = parseInt(contextSizeMatch[1], 10);
                                    const unit = contextSizeMatch[2]?.toUpperCase();

                                    // Adjust based on unit (K, M, G)
                                    if (unit === 'M') contextSize *= 1000;
                                    if (unit === 'G') contextSize *= 1000000;
                                }

                                const heightPercentage = (contextSize / maxContext) * 100;
                                console.log(`${model['Best Available Model']}: ${contextSize} / ${maxContext} = ${heightPercentage}%`);

                                const modelType = String(model[headers[typeIndex] || ""]);
                                //console.log(modelType + ' for ' + model['Best Available Model']);
                                const barColor = modelType.toLowerCase().includes('commercial') ? 'bg-orange-600' : 'bg-green-600';

                                // Get model name for display
                                const modelName = String(model[headers[modelIndex] || ""]);

                                // Calculate width based on config
                                const modelsPerRow = Math.min(VISUALIZATION_CONFIG.modelsPerRow, llmData.length);
                                const widthClass = modelsPerRow <= 4 ? 'w-1/4' : modelsPerRow <= 6 ? 'w-1/6' : 'w-1/8';

                                return (
                                    <div key={idx} className={`${widthClass} flex flex-col items-center`}>
                                        <div className="text-sm font-medium text-center text-gray-700 mb-2">
                                            {extractContextSize(String(contextValue))}
                                        </div>
                                        <div className="w-full h-full flex justify-center items-end">
                                            <div
                                                className={`w-16 ${barColor}`}
                                                style={{
                                                    height: `${heightPercentage}%`,
                                                    minHeight: `${heightPercentage * 1.4}px`
                                                }}
                                            />
                                        </div>
                                        <div className="mt-2 mb-10 text-sm font-medium text-center text-gray-800 w-full px-2">
                                            <span className="font-semibold block truncate" title={modelName}>
                                                {modelName}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            <div className="text-sm text-white text-center mt-6 bg-gray-800 p-2 rounded">
                Note: This visualization is generated from the LLM comparison data as of {VISUALIZATION_CONFIG.displayDate}.
                <br/>Data is loaded server-side for optimal performance.
            </div>
        </div>
    );
};

export default LLMsComparisonVisualizationSSR;