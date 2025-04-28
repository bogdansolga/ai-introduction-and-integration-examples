The **core AI components** are fundamental building blocks that work together to create intelligent behavior in machines. Here’s a high-level overview of these components and how they relate to one another:

---

### **1. Perception (Sensing)**
- **Definition:** Collecting data from the environment via sensors (cameras, microphones, etc.) or datasets.
- **Examples:** Image recognition, speech recognition, sensor data processing.
- **Relation:** **Feeds into** Knowledge Representation and Reasoning by providing raw input.

---

### **2. Knowledge Representation**
- **Definition:** Structuring and storing information so AI can understand and use it.
- **Examples:** Semantic networks, logic-based structures, ontologies, knowledge graphs.
- **Relation:** Enables Reasoning and Planning by organizing perceptual data for later use.

---

### **3. Reasoning & Inference**
- **Definition:** Deriving new information or conclusions from known data.
- **Examples:** Logical deduction, probabilistic inference, decision trees.
- **Relation:** **Consumes** Knowledge Representation to make decisions or predictions.

---

### **4. Learning**
- **Definition:** Adapting or improving performance over time using data.
- **Examples:** Machine learning (supervised, unsupervised), reinforcement learning.
- **Relation:** **Updates** Knowledge Representation and improves Perception, Reasoning, and Planning by learning from experience.

---

### **5. Planning & Decision Making**
- **Definition:** Formulating actions to achieve goals based on reasoning.
- **Examples:** Pathfinding, resource allocation, strategic game playing.
- **Relation:** **Uses** Reasoning & Knowledge + current sensory (perception) input to generate an action plan.

---

### **6. Action (Actuation)**
- **Definition:** Carrying out actions in the environment (via actuators, software commands, etc.)
- **Examples:** Robotic movement, generating text, controlling devices.
- **Relation:** **Executes** plans and decisions made by the AI.

---

### **7. Natural Language Processing (NLP)**
- **Definition:** Enabling understanding and generation of human language.
- **Examples:** Text generation, language translation, understanding queries.
- **Relation:** Sits between Perception and Action for language-based inputs/outputs.

---

## **How They Relate Visually**

A **simplified diagram**:

```
            +---------------------+
            |     Perception      |  <-- (Sensing, Data gathering)
            +----------+----------+
                       |
                       v
            +---------------------+
            | Knowledge           |  <-- (Representation of facts, state)
            +----------+----------+
                       |
                       v
            +---------------------+
            | Reasoning/Learning  |  <-- (Inference, updating knowledge, learning patterns)
            +----------+----------+
                       |
                       v
            +---------------------+
            | Planning/Decision   |  <-- (What to do next?)
            +----------+----------+
                       |
                       v
            +---------------------+
            |     Action          |  <-- (Performing actions in the world)
            +---------------------+

  *NLP can occur at both the Perception and Action stages (understanding/generating human language).
```

---

## **Summary Table**

| Component         | Inputs From    | Outputs To      |
|-------------------|---------------|-----------------|
| Perception        | Environment   | Knowledge Rep   |
| Knowledge Rep     | Perception    | Reasoning, Plan |
| Reasoning         | Knowledge Rep | Planning        |
| Learning          | Perception, Action | All stages (improves) |
| Planning          | Reasoning     | Action          |
| Action            | Planning      | Environment     |
| NLP               | Perception/Action | Both          |

---

### **Key Relationships**
- **Feedback:** Actions change the environment, which affects future Perception.
- **Learning** often updates all other components by improving performance/adaptivity.

---

**In short:**
AI gathers data (Perception), structures knowledge, reasons and learns, plans, and acts—constantly cycling to adapt and improve, sometimes using language as an interface.

