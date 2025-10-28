import minimist from "minimist";
import { generateWorkflow } from "./generateWorkflow.ts";

async function main() {
  const argv = minimist(process.argv.slice(2));
  const prompt = argv.prompt || argv.p;

  if (!prompt) {
    console.error("❌ Missing --prompt argument");
    process.exit(1);
  }

  try {
    const workflow = await generateWorkflow(prompt);
    console.log("\n✅ Final Valid Workflow:");
    console.log(JSON.stringify(workflow, null, 2));
  } catch (e) {
    console.error("\n❌ Workflow generation failed completely!");
    console.error(e);
    process.exit(1);
  }
}

main().catch(console.error);