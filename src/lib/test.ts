import { compiledGraph } from "./langgraph";

(async () => {
  try {
    const initialState = {
      url: "https://www.omniloy.com/",
    };

    const config = { configurable: { thread_id: "test-thread-1" } };

    const state = await compiledGraph.invoke(initialState, config);

    if (!state.summary || !state.references) {
      throw new Error("Graph failed to generate summary or references.");
    }

    console.log("Summarize completed:");
    console.log(state.summary);

    console.log("\nReferences found:");
    state.references.forEach((link, index) => {
      console.log(`${index + 1}. ${link.title} - ${link.url}`);
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in graph execution:", error);
    }
  }
})();
