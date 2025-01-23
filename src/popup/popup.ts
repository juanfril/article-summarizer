import { deletePage, getPages, savePage } from "../lib/storage";
import { processArticle } from "../services/processArticle";
import { isValidUrl, renderPages } from "./domUtils";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("articleForm") as HTMLFormElement;
  const input = document.getElementById("articleUrl") as HTMLInputElement;
  const resultContainer = document.getElementById("result") as HTMLElement;
  const pagesContainer = document.getElementById("pages") as HTMLElement;

  const loadPages = async () => {
    const pages = await getPages();
    renderPages(pages, pagesContainer, async (id: string) => {
      await deletePage(id);
      loadPages();
    });
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const url = input.value;
    if (!isValidUrl(url)) {
      alert("Please enter a valid URL.");
      return;
    }

    resultContainer.textContent = "Generating summary...";

    try {
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
      await loadPages();
      resultContainer.textContent = "Summary generated successfully.";
    } catch (error) {
      console.error("Error generating summary:", error);
      resultContainer.textContent = "Failed to generate summary.";
    }
  });

  loadPages();
});
