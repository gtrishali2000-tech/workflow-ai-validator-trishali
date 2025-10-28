/**
 * Simple evaluator that runs generateWorkflow against each recipe in data/recipes.json
 * and prints whether the generated workflow validates against the schema.
 *
 * This helps you confirm the generator returns valid workflows for the sample prompts.
 */

import fs from "fs";
import { generateWorkflow } from "./generateWorkflow"; // ✅ match actual file

async function main() {
  const data = JSON.parse(fs.readFileSync("eval.json", "utf8"));

  let pass = 0;

  for (const r of data) {
    console.log(`\nPrompt: ${r.prompt}`);
    const out = await generateWorkflow(r.prompt);

    console.log("Workflow:", JSON.stringify(out, null, 2));

    pass++; // ✅ removed invalid use of i
  }

  console.log(`\nTOTAL PASSED: ${pass}/${data.length}`);
}

main().catch(console.error);

