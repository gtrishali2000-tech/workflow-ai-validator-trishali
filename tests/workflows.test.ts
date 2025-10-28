import { generateWorkflow } from "../src/generateWorkflow.ts";

const PROMPTS = [
  "Notify team when customer reply contains phrase urgent",
  "When a VIP label is newly added to a contact, instantly send them a congratulatory SMS",
  "Send email when payment is received",
  "Webhook call when form is submitted",
  "Tag contact if reply contains coupon"
];

describe("Workflow Schema Validation", () => {
  for (const prompt of PROMPTS) {
    it(`should generate a valid workflow for prompt: "${prompt}"`, async () => {
      const wf = await generateWorkflow(prompt);
      expect(wf).toBeTruthy();
      expect(Array.isArray(wf.actions)).toBeTruthy();
    });
  }
});
