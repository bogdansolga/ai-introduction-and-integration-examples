# 11-prompt-with-chained-reasoning

Implements multi-step reasoning processes with intermediate results.

## Key Concepts
- Chain of thought
- Multi-step prompting
- Result refinement
- Complex reasoning

## Example Usage
```java
// Step 1: Analyze question
var analysisPrompt = new Prompt("Analyze this question: " + question);
String analysis = chatClient.prompt(analysisPrompt);

// Step 2: Retrieve relevant context
List<String> docs = vectorSearch.findSimilar(analysis, 2);

// Step 3: Generate final answer
var finalPrompt = new Prompt(List.of(
    new SystemMessage("Use the analysis and context to answer."),
    new UserMessage(formatPrompt(analysis, docs, question))
));
return chatClient.prompt(finalPrompt);
```

## Sequence Diagram
![Sequence Diagram](11.png)