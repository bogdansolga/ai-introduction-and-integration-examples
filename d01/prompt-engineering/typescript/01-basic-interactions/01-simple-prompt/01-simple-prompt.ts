import { OpenAI } from "openai";
import dotenv from 'dotenv';
import * as process from "node:process";

async function main() {
    dotenv.config({path: '../../.env'});

    // gets the API key from the environment variable OPENAI_API_KEY
    const openai = new OpenAI();

    const usedModel = process.env["USED_MODEL"] ?? 'gpt-4.1';
    const prompt = "What are the relationships between AI, ML, DL and NLP?"

    console.log(`Querying '${usedModel}' for '${prompt}'...`);
    const response = await openai.responses.create({
        model: usedModel,
        input: prompt
    });

    console.log(response.output_text);
}

main().catch(error => {
    console.error(error.error.message);
});