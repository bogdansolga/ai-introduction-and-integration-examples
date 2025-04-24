// Let's extract the table properly, ensuring headers match values
const extractTableData = () => {
    // These are the column headers from the document
    const headers = [
        "Owner",
        "Best Available Model",
        "Live Mode / Web Access",
        "Reasoning",
        "Image Generation",
        "Deep Research (Context/Tools)",
        "Code Execution",
        "Data Analysis (Context/Tools)",
        "See Images (Vision)",
        "See Video",
        "Read Docs (Context/RAG)",
        "Personality",
        "Superpower"
    ];

    // Row data from the table in pages 10-14
    const rows = [
        // OpenAI
        ["OpenAI", "OpenAI o3 / GPT-4.1", "Via Tool (o3) / No (GPT-4.1 API)", "Strong (RL-based, Tool-Augmented) / Long Context", "Via Tool (o3) / No (GPT-4.1 API)", "Yes (Tools, Long Context)", "Via Tool (o3)", "Yes (Tools, Long Context)", "Yes (Advanced)", "Benchmark (GPT-4.1) / No (o3)", "Yes (Excellent - 1M tokens)", "Helpful, Concise, Precise", "SOTA Performance/Reasoning (o3), Coding/Video/Long Context (GPT-4.1)"],

        // Google
        ["Google (DeepMind)", "Google Gemini 2.0 Flash / Pro", "Yes (Integrated Search)", "Strong (Multimodal, Agentic)", "Yes (Coming Soon)", "Yes (Search, Long Context)", "Yes (Via Tool)", "Yes (Long Context, Tools)", "Yes (Advanced)", "Yes (Native)", "Yes (Excellent - 2M tokens)", "Helpful, Knowledgeable", "Google Ecosystem Integration, Native Multimodality (Image, Audio, Video)"],

        // Anthropic
        ["Anthropic", "Anthropic Claude 3.7 Sonnet", "Platform Feature (Research)", "Strong (Hybrid, Controllable Thinking)", "No", "Yes (Tools, Long Context)", "Yes (Claude Code)", "Yes (Tools, Visual Data)", "Yes (Advanced)", "No", "Yes (Good - 128K/200K)", "Helpful, Cautious, Warm", "Hybrid Reasoning, Agentic Coding (Claude Code), Safety Focus"],

        // Meta AI
        ["Meta AI (FAIR)", "Meta Llama 4 Maverick/Scout", "Platform Dependent / No", "Strong (MoE, Multimodal) / Long Context (Scout)", "Via Meta AI / No", "Yes (Long Context)", "No (API)", "Yes (Long Context)", "Yes (Excellent)", "Yes (Frames)", "Yes (Excellent - 10M Scout)", "Personal, Creative, Balanced", "Leading Open Source, Multimodal (Mav.), Extreme Long Context (Scout)"],

        // xAI
        ["xAI", "xAI Grok-3", "Yes (Native X/Web Search)", "Strong (Reasoning Modes, RL-based)", "Yes", "Yes (DeepSearch, Long Context)", "Yes (Interpreter)", "Yes (Long Context)", "Yes (Advanced)", "No", "Yes (Good - 131K)", "Witty, Unfiltered, Rebellious", "Real-time X Data Access, Unique Personality, Reasoning Modes"],

        // Mistral AI
        ["Mistral AI", "Mistral Large (24.11)", "No (API)", "Strong (High-Complexity Tasks)", "No", "Limited (Long Context)", "No (API)", "Limited (Long Context)", "No (Large) / Yes (Pixtral)", "No", "Yes (Good - 131K)", "Direct, Performant", "High-Performance Open Models, Efficiency, Specialized Models (Codestral)"],

        // Cohere
        ["Cohere", "Command A", "No (API)", "Strong (Agentic, RAG-focused)", "No", "Yes (RAG, Tools)", "No (API)", "Yes (RAG, Tools)", "No", "No", "Yes (Excellent - 256K)", "Professional, Enterprise", "Enterprise RAG & Tools, Multilingual Business Support, Private Deployment"],

        // AI21 Labs
        ["AI21 Labs", "Jamba 1.6 Large", "No (API/Self-hosted)", "Strong (Long Context, Hybrid Arch.)", "No", "Yes (RAG, Long Context)", "No", "Yes (RAG, Long Context)", "No", "No", "Yes (Excellent - 256K)", "Professional, Reliable", "Long Context Efficiency (Hybrid Arch.), Open Model for Private Deployment"],

        // DeepSeek AI
        ["DeepSeek AI", "DeepSeek R1", "Platform Feature (Web Search)", "Excellent (Reasoning Mode, Math/Code Focus)", "No", "Limited (Long Context)", "No (API)", "Yes (Reasoning)", "Limited/No", "No", "Yes (Good - 131K)", "Logical, Precise, Creative", "SOTA Open Source Reasoning/Coding, Cost-Effective Performance"],

        // Alibaba Cloud
        ["Alibaba Cloud", "Qwen2.5-Max", "Platform Feature (Search)", "Strong (MoE, Math/Code Focus)", "Via Platform", "Limited (Long Context)", "No (API)", "Yes (Structured Data)", "Yes (Via VL/Omni)", "Yes (Via VL/Omni)", "Yes (Good - 128K/1M)", "Capable, Adaptable", "Top Benchmark Performance (Coding/Math), Strong Multimodal (Video)"]
    ];

    // Verify all rows have same number of columns as headers
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].length !== headers.length) {
            console.log(`Warning: Row ${i+1} has ${rows[i].length} columns but headers has ${headers.length} columns`);
        }
    }

    // Create the CSV string with headers
    let csv = headers.join(",") + "\n";

    // Add each row to the CSV
    rows.forEach(row => {
        // Properly escape any commas within the values
        const escapedRow = row.map(cell => {
            if (cell.includes(",")) {
                return `"${cell}"`;
            }
            return cell;
        });

        csv += escapedRow.join(",") + "\n";
    });

    return csv;
};

const csv = extractTableData();
console.log(csv);