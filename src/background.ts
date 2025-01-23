import { compiledGraph } from "./lib/langgraph";
import { Message, Page } from "./lib/types";

chrome.runtime.onMessage.addListener(
  async (message: Message, sender, sendResponse) => {
    if (message.type === "generatePage") {
      try {
        const state = await compiledGraph.invoke({ url: message.url });

        const page: Page = {
          id: crypto.randomUUID(),
          title: `Generated Page for ${message.title}`,
          summary: state.summary,
          links: state.references,
          createdAt: new Date().toISOString(),
        };

        chrome.storage.local.get(["pages"], (result) => {
          const pages = result.pages || [];
          pages.push(page);
          chrome.storage.local.set({ pages }, () => {
            sendResponse({ success: true, pageId: page.id });
          });
        });
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error in graph execution:", error);
          sendResponse({ success: false, error: error.message });
        }
      }

      return true;
    }
  }
);
