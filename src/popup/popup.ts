import { compiledGraph } from "../lib/langgraph";
import { Page } from "../lib/types";

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const savePage = async (pageData: Page) => {
  const { pages = [] } = await chrome.storage.local.get("pages");

  const existingPage = pages.findIndex((page: any) => page.id === pageData.id);

  if (existingPage !== -1) {
    pages[existingPage] = pageData;
  } else {
    pages.push(pageData);
  }

  await chrome.storage.local.set({ pages });
};

const openSavedPage = async (pageId: string) => {
  await chrome.tabs.create({
    url: chrome.runtime.getURL(`page/page.html?id=${pageId}`),
  });
};

const deletePage = async (pageId: string) => {
  const { pages = [] } = await chrome.storage.local.get("pages");
  const updatedPages = pages.filter((page: any) => page.id !== pageId);

  await chrome.storage.local.set({ pages: updatedPages });
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("articleForm") as HTMLFormElement;
  const input = document.getElementById("articleUrl") as HTMLInputElement;
  const resultContainer = document.getElementById("result") as HTMLElement;
  const pagesContainer = document.getElementById("pages") as HTMLElement;

  chrome.storage.local.get(["pages"], (result) => {
    const pages = result.pages || [];

    const pagesContainer = document.getElementById("pages") as HTMLElement;
    pagesContainer.innerHTML = "";

    pages.forEach((page: any) => {
      const pageElement = document.createElement("div");
      pageElement.className = "page";

      const link = document.createElement("a");
      link.href = chrome.runtime.getURL(`page/page.html?id=${page.id}`);
      link.textContent = page.title;
      link.target = "_blank";

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", deletePage.bind(null, page.id));

      pageElement.appendChild(link);
      pageElement.appendChild(deleteButton);
      pagesContainer.appendChild(pageElement);
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const url = input.value;
    if (!isValidUrl(url)) {
      alert("Please enter a valid URL.");
      return;
    }

    try {
      resultContainer.textContent = "Generating summary...";
      const summary = await processArticle(url);
      const response = await fetch(url);
      const html = await response.text();
      const dom = new DOMParser().parseFromString(html, "text/html");
      const title = dom.title || new URL(url).hostname;

      const page = {
        id: crypto.randomUUID(),
        title,
        summary: summary.summary,
        links: summary.references,
        createdAt: new Date().toISOString(),
      };

      await savePage(page);
    } catch (error) {
      console.error("Error generating summary:", error);
      resultContainer.textContent = "Failed to generate summary.";
    }
  });
});

async function processArticle(url: string) {
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
