# 09-prompt-with-function-calling

Demonstrates function calling capabilities for structured interactions.

## Key Concepts
- Function definitions
- Tool use
- Structured outputs
- API integration

## Example Usage
```java
var messages = List.of(
    new SystemMessage("Use the provided functions when needed."),
    new UserMessage(question)
);
var functions = List.of(
    new FunctionDefinition("searchCode", "Search in codebase"),
    new FunctionDefinition("executeQuery", "Run database query")
);
String response = chatClient.prompt(new Prompt(messages, functions));
```

## Sequence Diagram
![Sequence Diagram](09.png)