import fs from "fs";
import path from "path";

export interface Recipe {
  prompt: string;
  workflow: any;
}

/**
 * A simple Retriever that loads recipes from data/recipes.json and returns
 * the k most relevant recipes using token overlap similarity.
 *
 * This is intentionally simple and deterministic for offline evaluation.
 */
export class Retriever {
  private recipes: Recipe[] = [];

  constructor(file = path.resolve("data/recipes.json")) {
    const data = JSON.parse(fs.readFileSync(file, "utf-8")) as Recipe[];
    this.recipes = data;
  }

  // naive tokenization
  private tokenize(s: string): string[] {
    return s
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean);
  }

  // return tokens set
  private tokensSet(s: string): Set<string> {
    return new Set(this.tokenize(s));
  }

  // simple overlap similarity
  private score(query: string, doc: string): number {
    const q = this.tokensSet(query);
    const d = this.tokensSet(doc);
    let common = 0;
    for (const t of q) {
      if (d.has(t)) common++;
    }
    return common;
  }

  /**
   * Retrieve k most relevant recipes by token-overlap. If there are ties,
   * we preserve file order.
   */
  retrieve(query: string, k = 3): Recipe[] {
    const scored = this.recipes.map((r, idx) => ({
      idx,
      r,
      score: this.score(query, r.prompt),
    }));
    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.idx - b.idx;
    });
    return scored.slice(0, k).map((s) => s.r);
  }
}

/**
 * ✅ Exported helper as expected by generateWorkflow.ts
 */
export function getRelevantExamples(prompt: string, k = 3): Recipe[] {
  const retriever = new Retriever();
  return retriever.retrieve(prompt, k);
}