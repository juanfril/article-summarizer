import { compiledGraph } from "../lib/langgraph";

export async function processArticle(url: string) {
  const initialState = { url };
  const config = { configurable: { thread_id: `thread-${Date.now()}` } };

  const state = await compiledGraph.invoke(initialState, config);

  if (!state.summary || !state.references) {
    throw new Error("Failed to generate summary or references.");
  }

  return {
    summary: state.summary,
    references: state.references,
  };
}
