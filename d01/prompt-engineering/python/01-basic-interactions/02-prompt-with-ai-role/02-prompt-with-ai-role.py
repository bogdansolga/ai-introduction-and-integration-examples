#!/usr/bin/env python3
"""
Example: single-prompt chat completion
Run with:
    export OPENAI_API_KEY="sk-..."   # or set it in your shell profile
    python 02-prompt-with-ai-role.py
"""

import os
from openai import OpenAI

# 1️⃣ Get the OpenAI API key from the environment (raises if not set)
api_key = os.environ["OPENAI_API_KEY"]

# 2️⃣ Create a client instance
client = OpenAI(api_key=api_key)

# 3️⃣ Define the user prompt
prompt = "What are the core AI components and their relations?"

# 4️⃣ Call the chat completion endpoint
response = client.chat.completions.create(
    model="gpt-4.1",
    messages=[
          {"role": "system", "content": "Act as an experienced AI trainer"},
          {"role": "user", "content": prompt}
    ]
)

# 5️⃣ Display the assistant’s answer
print(response.choices[0].message.content)
