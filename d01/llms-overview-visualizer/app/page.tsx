import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { loadLLMData } from '@/utils/dataUtils';

// Define metadata for the page
export const metadata: Metadata = {
    title: 'LLMs Comparison Visualization',
    description: 'Interactive visualization of LLM capabilities',
};

// Import the client component - use dynamic to ensure proper hydration
const LLMsComparisonVisualization = dynamic(
    () => import('@/components/LLMsComparisonVisualizationSSR'),
    { ssr: true }
);

export default async function Home() {
    // Fetch data in the Server Component using our utility function
    const { llmData, headers, hasDataError } = await loadLLMData();

    return (
        <div className="container mx-auto">
            <main>
                {hasDataError && (
                    <div className="p-4 mb-4 bg-yellow-100 text-red-600 rounded-md">
                        <p>There was an issue loading the server side data. Some features may be unavailable.</p>
                    </div>
                )}

                <LLMsComparisonVisualization
                    llmData={llmData}
                    headers={headers}
                />
            </main>
        </div>
    );
}