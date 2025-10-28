import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY!,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`,
  defaultQuery: { "api-version": process.env.OPENAI_API_VERSION },
  defaultHeaders: { "api-key": process.env.AZURE_OPENAI_API_KEY! },
});

export async function callLLM(prompt: string) {
  const response = await client.chat.completions.create({
    model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME!, // ✅ Required
    messages: [
      {
        role: "system",
        content: `You are a workflow generator. You ALWAYS output valid JSON with fields:
        - name
        - description
        - trigger { type, name, conditions[] }
        - actions[] with { type, name, attributes{} }
        `,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: 500,
    temperature: 0.2,
  });

  const jsonText = response.choices[0].message?.content?.trim();

  try {
    return JSON.parse(jsonText || "{}");
  } catch (e) {
    console.error("⚠ Failed JSON parse, returning raw:", jsonText);
    return jsonText;
  }
}