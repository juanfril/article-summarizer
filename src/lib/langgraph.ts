import { BaseMessageLike } from "@langchain/core/messages";
import { ChatGroq } from "@langchain/groq";
import { Annotation, MemorySaver } from "@langchain/langgraph";
import { StateGraph } from "@langchain/langgraph";
import { Link } from "./types";

const GROQ_API_KEY = "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";

const model = new ChatGroq({
  apiKey: GROQ_API_KEY,
  temperature: 0.7,
  maxTokens: 1000,
});

const stateAnnotation = Annotation.Root({
  url: Annotation<string>(),
  summary: Annotation<string>(),
  references: Annotation<Link[]>(),
});

const summarizeArticle = async ({ url }: { url: string }) => {
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

  const response = await model.generate(messages);

  return { summary: response.generations[0][0].text.trim() };
};

const fetchReferences = async (state: { summary: string }) => {
  const messages: BaseMessageLike[][] = [
    [
      {
        role: "assistant",
        content: "You are a helpful assistant that finds references.",
      },
      {
        role: "user",
        content: `Based on the summary "${state.summary}", find 3 relevant links about the topic.`,
      },
    ],
  ];

  const response = await model.generate(messages);

  const links = response.generations[0][0].text
    .split("\n")
    .filter((line) => line.includes("http")) // Asegurarse de que la línea tiene una URL
    .map((line) => {
      const [title, url] = line.split(" - ");
      if (!title || !url) {
        console.warn(`Skipping invalid line: "${line}"`);
        return null; // Ignorar líneas mal formateadas
      }
      return { title: title.trim(), url: url.trim() };
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
