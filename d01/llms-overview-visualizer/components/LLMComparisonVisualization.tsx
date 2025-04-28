import React from 'react';

const LLMComparisonVisualization = () => {
  // Sample data based on the CSV
  const llmData = [
    {
      name: "GPT-4o",
      organization: "OpenAI",
      type: "Commercial",
      contextWindow: 128,
      capabilities: {
        textGeneration: true,
        codeGeneration: true,
        imageGeneration: true,
        imageUnderstanding: true,
        research: true,
        functionCalling: true
      },
      sdkSupport: {
        python: true,
        java: true,
        typescript: true
      }
    },
    {
      name: "Claude 3.5 Sonnet",
      organization: "Anthropic",
      type: "Commercial",
      contextWindow: 200,
      capabilities: {
        textGeneration: true,
        codeGeneration: true,
        imageGeneration: false,
        imageUnderstanding: true,
        research: true,
        functionCalling: true
      },
      sdkSupport: {
        python: true,
        java: true,
        typescript: true
      }
    },
    {
      name: "Gemini 1.5 Pro",
      organization: "Google",
      type: "Commercial",
      contextWindow: 1000,
      capabilities: {
        textGeneration: true,
        codeGeneration: true,
        imageGeneration: true,
        imageUnderstanding: true,
        research: false,
        functionCalling: true
      },
      sdkSupport: {
        python: true,
        java: false,
        typescript: true
      }
    },
    {
      name: "Llama 3 70B",
      organization: "Meta",
      type: "Open Source",
      contextWindow: 8,
      capabilities: {
        textGeneration: true,
        codeGeneration: true,
        imageGeneration: false,
        imageUnderstanding: false,
        research: false,
        functionCalling: false
      },
      sdkSupport: {
        python: true,
        java: true,
        typescript: true
      }
    },
    {
      name: "Mistral Large",
      organization: "Mistral AI",
      type: "Open Source/Commercial",
      contextWindow: 32,
      capabilities: {
        textGeneration: true,
        codeGeneration: true,
        imageGeneration: false,
        imageUnderstanding: false,
        research: true,
        functionCalling: true
      },
      sdkSupport: {
        python: true,
        java: true,
        typescript: true
      }
    },
    {
      name: "Falcon 180B",
      organization: "TII",
      type: "Open Source",
      contextWindow: 8,
      capabilities: {
        textGeneration: true,
        codeGeneration: false,
        imageGeneration: false,
        imageUnderstanding: false,
        research: false,
        functionCalling: false
      },
      sdkSupport: {
        python: true,
        java: false,
        typescript: false
      }
    }
  ];

  // Render capability cell with appropriate color
  const CapabilityCell = ({ value }) => {
    const bgColor = value ? 'bg-green-100' : 'bg-red-100';
    const textColor = value ? 'text-green-800' : 'text-red-800';
    const icon = value ? '✓' : '✗';
    
    return (
      <td className={`${bgColor} ${textColor} text-center p-2 border`}>
        {icon}
      </td>
    );
  };

  // Helper function to get a background color class based on context window size
  const getContextWindowColor = (size) => {
    if (size >= 100) return 'bg-green-100 text-green-800';
    if (size >= 20) return 'bg-yellow-100 text-yellow-800';
    return 'bg-orange-100 text-orange-800';
  };

  // Helper function to get a color for model type
  const getModelTypeColor = (type) => {
    if (type === 'Commercial') return 'text-blue-700';
    if (type === 'Open Source') return 'text-green-700';
    return 'text-purple-700';
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">LLM Comparison (October 2024)</h1>
      
      {/* Capabilities Matrix */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">LLM Capabilities Comparison</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border">Model</th>
                <th className="p-3 border">Organization</th>
                <th className="p-3 border">Type</th>
                <th className="p-3 border text-center">Context<br/>(K tokens)</th>
                <th className="p-3 border text-center">Text<br/>Generation</th>
                <th className="p-3 border text-center">Code<br/>Generation</th>
                <th className="p-3 border text-center">Image<br/>Generation</th>
                <th className="p-3 border text-center">Image<br/>Understanding</th>
                <th className="p-3 border text-center">Research/<br/>Citation</th>
                <th className="p-3 border text-center">Function<br/>Calling</th>
              </tr>
            </thead>
            <tbody>
              {llmData.map((model, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="p-3 border font-medium">{model.name}</td>
                  <td className="p-3 border">{model.organization}</td>
                  <td className={`p-3 border font-medium ${getModelTypeColor(model.type)}`}>{model.type}</td>
                  <td className={`p-3 border text-center font-medium ${getContextWindowColor(model.contextWindow)}`}>
                    {model.contextWindow}K
                  </td>
                  <CapabilityCell value={model.capabilities.textGeneration} />
                  <CapabilityCell value={model.capabilities.codeGeneration} />
                  <CapabilityCell value={model.capabilities.imageGeneration} />
                  <CapabilityCell value={model.capabilities.imageUnderstanding} />
                  <CapabilityCell value={model.capabilities.research} />
                  <CapabilityCell value={model.capabilities.functionCalling} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Context Window Visualization */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Context Window Size Comparison</h2>
        <div className="relative h-64">
          {llmData.map((model, idx) => {
            // Calculate percentage height based on context window
            const maxContext = Math.max(...llmData.map(m => m.contextWindow));
            const heightPercentage = (model.contextWindow / maxContext) * 100;
            const barColor = model.type === 'Commercial' ? 'bg-blue-500' : 'bg-green-500';
            
            return (
              <div key={idx} className="inline-block w-1/6 h-full align-bottom text-center">
                <div className="relative h-full flex items-end justify-center">
                  <div 
                    className={`w-4/5 ${barColor}`} 
                    style={{height: `${heightPercentage}%`}}
                  >
                    <div className="absolute w-full text-center -top-6 text-sm font-medium">
                      {model.contextWindow}K
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-sm font-medium">{model.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SDK Support */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">SDK Language Support</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border">Model</th>
                <th className="p-3 border text-center">Python SDK</th>
                <th className="p-3 border text-center">Java SDK</th>
                <th className="p-3 border text-center">TypeScript SDK</th>
              </tr>
            </thead>
            <tbody>
              {llmData.map((model, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="p-3 border font-medium">{model.name}</td>
                  <CapabilityCell value={model.sdkSupport.python} />
                  <CapabilityCell value={model.sdkSupport.java} />
                  <CapabilityCell value={model.sdkSupport.typescript} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-sm text-gray-500 text-center mt-6">
        Note: This visualization is generated from the LLM comparison data as of October 2024.
        <br/>Update the underlying CSV data before each course to ensure accuracy.
      </div>
    </div>
  );
};

export default LLMComparisonVisualization;