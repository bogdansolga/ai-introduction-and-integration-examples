import { OpenAI } from "openai";
import dotenv from 'dotenv';
import * as process from "node:process";

async function main() {
    dotenv.config({path: '../../.env'});

    // gets the API key from the OPENAI_API_KEY environment variable
    const openai = new OpenAI();

    const usedModel = process.env["USED_MODEL"] ?? 'gpt-4.1';
    const systemInstructions = "Act as an experienced AI trainer, describe in a high-level overview";
    const prompt = "What are the relationships between AI, ML, DL and NLP?"

    console.log(`Querying '${usedModel}' for '${prompt}', using the system instructions '${systemInstructions}'...`);
    const response = await openai.chat.completions.create({
        model: usedModel,
        messages: [
            {"role": "system", "content": systemInstructions},
            {"role": "user", "content": prompt}
        ]
    });

    console.log(response.choices[0]?.message.content);
}

main().catch(error => {
    console.error(error.error.message);
});