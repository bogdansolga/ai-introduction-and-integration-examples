import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from matplotlib.colors import LinearSegmentedColormap

# Function to load and process the CSV data
def load_llm_data(file_path):
    """Load LLM comparison data from CSV file."""
    df = pd.read_csv(file_path)
    return df

# Function to create a capabilities matrix visualization
def create_capabilities_matrix(df):
    """Create a capability matrix visualization for LLMs."""
    # Select relevant capability columns for the heatmap
    capability_cols = ['Text Generation', 'Code Generation', 'Image Generation', 
                      'Image Understanding', 'Research/Citation', 'Function Calling']
    
    # Create a numeric matrix for visualization
    matrix_data = df[capability_cols].copy()
    
    # Convert Yes/No/Limited to numeric values
    for col in capability_cols:
        matrix_data[col] = matrix_data[col].map({'Yes': 1.0, 'Limited': 0.5, 'No': 0.0})
    
    # Set up the figure
    plt.figure(figsize=(12, 8))
    
    # Create a custom colormap: red for No, yellow for Limited, green for Yes
    cmap = LinearSegmentedColormap.from_list('capability_cmap', ['#ff6b6b', '#ffe066', '#69db7c'])
    
    # Create the heatmap
    ax = sns.heatmap(matrix_data, cmap=cmap, annot=True, fmt='.1f', 
                     xticklabels=capability_cols, yticklabels=df['Model Name'],
                     cbar_kws={'label': 'Capability Level'})
    
    # Add color-coding for commercial vs open source models
    for i, model_type in enumerate(df['Model Type']):
        if model_type == 'Commercial':
            ax.get_yticklabels()[i].set_color('darkblue')
        else:
            ax.get_yticklabels()[i].set_color('darkgreen')
    
    plt.title('LLM Capabilities Comparison', fontsize=16)
    plt.tight_layout()
    
    return plt

# Function to create context window size comparison
def create_context_window_chart(df):
    """Create a bar chart comparing context window sizes."""
    plt.figure(figsize=(12, 6))
    
    # Extract context window sizes and convert to numeric
    df['Context Size (K tokens)'] = df['Context Window Size'].apply(
        lambda x: float(x.replace('K', '').replace('M', '000')) if 'K' in x 
        else float(x.replace('M', '')) * 1000)
    
    # Color bars by model type
    colors = ['#4dabf7' if t == 'Commercial' else '#40c057' for t in df['Model Type']]
    
    # Create bar chart
    ax = plt.bar(df['Model Name'], df['Context Size (K tokens)'], color=colors)
    
    # Add value labels on top of bars
    for i, v in enumerate(df['Context Size (K tokens)']):
        plt.text(i, v + 50, f"{int(v):,}", ha='center')
    
    plt.title('Context Window Size Comparison (K tokens)', fontsize=16)
    plt.ylabel('Tokens (thousands)')
    plt.xticks(rotation=45, ha='right')
    
    # Add legend for model types
    from matplotlib.patches import Patch
    legend_elements = [
        Patch(facecolor='#4dabf7', label='Commercial'),
        Patch(facecolor='#40c057', label='Open Source')
    ]
    plt.legend(handles=legend_elements)
    
    plt.tight_layout()
    return plt

# Function to create SDK availability comparison
def create_sdk_comparison(df):
    """Create a visualization showing SDK availability across languages."""
    # Extract SDK columns
    sdk_cols = ['Python SDK', 'Java SDK', 'TypeScript SDK']
    
    # Convert Yes/No/Limited to numeric values
    sdk_data = df[['Model Name'] + sdk_cols].copy()
    for col in sdk_cols:
        sdk_data[col] = sdk_data[col].map({'Yes': 1.0, 'Limited': 0.5, 'No': 0.0})
    
    # Set up the figure
    plt.figure(figsize=(10, 6))
    
    # Create the heatmap for SDK availability
    cmap = LinearSegmentedColormap.from_list('sdk_cmap', ['#ff8787', '#ffe066', '#69db7c'])
    ax = sns.heatmap(sdk_data[sdk_cols], cmap=cmap, annot=True, fmt='.1f',
                    xticklabels=sdk_cols, yticklabels=df['Model Name'])
    
    plt.title('SDK Availability by Language', fontsize=16)
    plt.tight_layout()
    
    return plt

# Main function to generate and save all visualizations
def generate_llm_visualizations(csv_file, output_prefix='llm_comparison'):
    """Generate and save all LLM comparison visualizations."""
    # Load data
    df = load_llm_data(csv_file)
    
    # Create capabilities matrix
    capabilities_plt = create_capabilities_matrix(df)
    capabilities_plt.savefig(f'{output_prefix}_capabilities.png', dpi=300, bbox_inches='tight')
    
    # Create context window comparison
    context_plt = create_context_window_chart(df)
    context_plt.savefig(f'{output_prefix}_context_window.png', dpi=300, bbox_inches='tight')
    
    # Create SDK availability comparison
    sdk_plt = create_sdk_comparison(df)
    sdk_plt.savefig(f'{output_prefix}_sdk_support.png', dpi=300, bbox_inches='tight')
    
    print(f"Generated visualizations with prefix: {output_prefix}")

# Example usage
if __name__ == "__main__":
    # Example for course instructors on how to use the script
    print("LLM Comparison Visualization Tool")
    print("--------------------------------")
    print("Usage instructions:")
    print("1. Update the 'llm_comparison.csv' file with current LLM data")
    print("2. Run this script to generate updated visualizations")
    print("3. Include the generated PNG files in your course materials")
    print()
    print("Example:")
    print("generate_llm_visualizations('llm_comparison.csv', 'course_2025_q2')")
    
    # Uncomment to run with your specific CSV file:
    # generate_llm_visualizations('path/to/your/llm_comparison.csv')
