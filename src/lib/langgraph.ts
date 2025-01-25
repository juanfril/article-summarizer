import { BaseMessageLike } from "@langchain/core/messages";
import { ChatGroq } from "@langchain/groq";
import { Annotation, MemorySaver, StateGraph } from "@langchain/langgraph/web";
import { Link } from "./types";

let modelInstance: ChatGroq | null = null;

const getModel = async () => {
  if (!modelInstance) {
    const result = await chrome.storage.local.get(["groqApiKey"]);
    if (!result.groqApiKey) {
      throw new Error(
        "API key not found. Please set it in the extension options."
      );
    }

    modelInstance = new ChatGroq({
      apiKey: result.groqApiKey,
      temperature: 0.7,
      maxTokens: 1000,
    });
  }
  return modelInstance;
};

const stateAnnotation = Annotation.Root({
  url: Annotation<string>(),
  summary: Annotation<string>(),
  references: Annotation<Link[]>(),
});

const summarizeArticle = async ({ url }: { url: string }) => {
  const model = await getModel();
  const messages: BaseMessageLike[][] = [
    [
      {
        role: "assistant",
        content: "You are a helpful assistant that summazires articles.",
      },
      {
        role: "user",
        content: `Please summarize the article at ${url}.`,
      },
    ],
  ];

  const response = await model!.generate(messages);

  return { summary: response.generations[0][0].text.trim() };
};

const fetchReferences = async (state: { summary: string }) => {
  const model = await getModel();
  const messages: BaseMessageLike[][] = [
    [
      {
        role: "assistant",
        content: "You are a helpful assistant that finds references.",
      },
      {
        role: "user",
        content: `Based on the summary "${state.summary}", provide 3 relevant references about the topic. Return the references in the following format: "Title - URL". Ensure each reference is on a new line and strictly follows this format.`,
      },
    ],
  ];

  const response = await model!.generate(messages);

  console.log(`response: ${JSON.stringify(response)}`);

  const links = response.generations[0][0].text
    .split("\n")
    .filter((line) => line.includes("http"))
    .map((line) => {
      const [title, url] = line.split(" - ");
      if (!title || !url) {
        console.warn(`Skipping invalid line: "${line}"`);
        return null;
      }
      const cleanUrl = url.replace(/["<>]/g, "").replace(/\s+/g, "").trim();
      return { title: title.trim(), url: cleanUrl };
    })
    .filter((link): link is Link => link !== null);

  return { references: links };
};

export const articleSummarizer = new StateGraph(stateAnnotation)
  .addNode("summarizeArticle", summarizeArticle)
  .addNode("fetchReferences", fetchReferences)
  .addEdge("__start__", "summarizeArticle")
  .addEdge("summarizeArticle", "fetchReferences");

const checkpointer = new MemorySaver();

export const compiledGraph = articleSummarizer.compile({ checkpointer });
