import { compiledGraph } from "./langgraph";

(async () => {
  try {
    // Estado inicial con la URL del artículo
    const initialState = {
      url: "https://www.npmjs.com/package/@langchain/langgraph",
    };

    // Configuración adicional requerida por el MemorySaver
    const config = { configurable: { thread_id: "test-thread-1" } };

    // Ejecutar el grafo compilado con el estado inicial y configuración
    const state = await compiledGraph.invoke(initialState, config);

    // Validar y mostrar el resultado
    if (!state.summary || !state.references) {
      throw new Error("El grafo no generó los datos esperados.");
    }

    console.log("Resumen generado:");
    console.log(state.summary);

    console.log("\nReferencias encontradas:");
    state.references.forEach((link, index) => {
      console.log(`${index + 1}. ${link.title} - ${link.url}`);
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error en la ejecución del grafo:", error);
    }
  }
})();
