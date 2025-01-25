import { describe, it, expect, vi, beforeEach } from "vitest";
import { Link } from "../types";

const generateMock = vi.fn();
const mockChromeStorage = {
  get: vi.fn().mockResolvedValue({ groqApiKey: "test-api-key" }),
  set: vi.fn(),
};

global.chrome = {
  storage: {
    local: mockChromeStorage,
  },
} as any;

vi.doMock("@langchain/groq", async () => {
  return {
    ChatGroq: class {
      constructor() {
        return {
          apiKey: "mock-key",
          temperature: 0.7,
          maxTokens: 1000,
          generate: generateMock,
        };
      }
    },
  };
});

const { compiledGraph } = await import("../langgraph");

describe("Article Summarizer Integration", () => {
  const mockSummary = "This is a test summary";
  const mockReferences: Link[] = [
    { title: "Test Link 1", url: "https://test1.com" },
    { title: "Test Link 2", url: "https://test2.com" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    generateMock
      .mockResolvedValueOnce({ generations: [[{ text: mockSummary }]] })
      .mockResolvedValueOnce({
        generations: [
          [
            {
              text: mockReferences
                .map((ref) => `${ref.title} - ${ref.url}`)
                .join("\n"),
            },
          ],
        ],
      });
  });

  it("should process article correctly", async () => {
    const initialState = {
      url: "https://test.com",
    };
    const config = { configurable: { thread_id: "test-thread-1" } };

    const state = await compiledGraph.invoke(initialState, config);

    expect(state.summary).toBe(mockSummary);
    expect(state.references).toEqual(mockReferences);

    expect(generateMock).toHaveBeenCalledTimes(2);
    expect(generateMock).toHaveBeenNthCalledWith(1, [
      [
        {
          role: "assistant",
          content: "You are a helpful assistant that summazires articles.",
        },
        {
          role: "user",
          content: `Please summarize the article at ${initialState.url}.`,
        },
      ],
    ]);
  });

  it("should handle errors when summary generation fails", async () => {
    generateMock.mockReset();
    generateMock.mockRejectedValue(new Error("API Error"));

    const initialState = {
      url: "https://test.com",
    };
    const config = { configurable: { thread_id: "test-thread-error" } };

    await expect(compiledGraph.invoke(initialState, config)).rejects.toThrow(
      "API Error"
    );
  });
});
