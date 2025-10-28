import { callLLM } from "./llm.ts";
import { getRelevantExamples } from "./retriever.ts";
import { validateWorkflow } from "./validation.ts";
import fs from "fs";
import path from "path";

const MAX_RETRIES = 3;

export async function generateWorkflow(prompt: string) {
  const examples = await getRelevantExamples(prompt);

  let workflow = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {

    const llmPrompt = `
You are generating a workflow JSON object.

User requirement:
"${prompt}"

Relevant valid examples:
${JSON.stringify(examples, null, 2)}

Rules (STRICT):
- Output ONLY JSON (no quotes, no markdown)
- Must match the provided schema exactly
- Do not add extra properties not listed in schema
- All required fields must be included
- Conditions[] must include field, operator, value
- Actions[] must include type, name, attributes
- Action.attributes must follow allowed structures
`;

    workflow = await callLLM(llmPrompt);

    const validation = validateWorkflow(workflow);

    console.log(`DEBUG: Validation attempt #${attempt}`, validation);

    if (validation.valid) {
      console.log(`✅ Workflow valid on attempt ${attempt}`);
      return workflow;
    }

    fs.writeFileSync(
      path.resolve(`logs/workflow_attempt_${attempt}.json`),
      JSON.stringify(workflow, null, 2)
    );

    console.warn(`🔁 Attempt ${attempt} failed. Retrying with error awareness...`);

    const errorFeedback = validation.errors.map(
      e => `Path: ${e.instancePath} - ${e.message}`
    ).join("\n");

    // Update examples with error hints for next retry
    examples.push({
      name: "ValidationCorrectionHint",
      description: `Fix validation issues:\n${errorFeedback}`,
      trigger: { type: "noop", name: "noop", conditions: [] },
      actions: []
    } as any);
  }

  throw new Error("Workflow failed schema validation after retries");
}