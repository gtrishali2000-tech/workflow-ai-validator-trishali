import * as fs from 'fs';
import { Recipe } from './retriever';

export function composePrompt(userPrompt: string, examples: Recipe[]): string {
  let prompt = `You are an AI that generates workflow JSONs based on natural language descriptions.
  Do not include explanations or additional text — ONLY return valid JSON
  The output must strictly adhere to the following JSON schema:
  {
    "trigger": {
      "type": "string",
      "name": "string",
      "conditions": [
        {
          "field": "string",
          "operator": "string",
          "value": "any"
        }
      ]
    },
    "actions": [
      {
        "type": "string",
        "name": "string",
        "attributes": "object"
      }
    ]
  }
Examples:\n`;

  examples.forEach((example, index) => {
    prompt += `Example ${index + 1}:\n`;
    prompt += `Input: ${example.prompt}\n`;
    prompt += `Output: ${JSON.stringify(example.workflow, null, 2)}\n\n`;
  });

  prompt += `Now, generate the workflow JSON for the following input:\n`;
  prompt += `Input: ${userPrompt}\n`;
  prompt += `Output:`;

  return prompt;
}

// Load examples from recipes.json
function loadExamples(): Recipe[] {
  const recipes = JSON.parse(fs.readFileSync('./data/recipes.json', 'utf-8'));
  return recipes.map((recipe: { prompt: string; workflow: object }) => ({
    prompt: recipe.prompt,
    workflow: recipe.workflow,
  }));
}

// Example usage
const userPrompt = "Notify team when customer reply contains phrase urgent";
const examples = loadExamples();
const prompt = composePrompt(userPrompt, examples);

console.log(prompt);
