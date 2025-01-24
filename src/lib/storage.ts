import { Page } from "./types";

export const getPages = async (): Promise<Page[]> => {
  const { pages = [] } = await chrome.storage.local.get("pages");
  return pages;
};

export const savePage = async (page: Page): Promise<void> => {
  const pages = await getPages();
  const existingPageIndex = pages.findIndex((p) => p.id === page.id);

  if (existingPageIndex !== -1) {
    pages[existingPageIndex] = page;
  } else {
    pages.push(page);
  }

  await chrome.storage.local.set({ pages });
};

export const deletePage = async (pageId: string): Promise<void> => {
  const pages = await getPages();
  const updatedPages = pages.filter((page) => page.id !== pageId);

  await chrome.storage.local.set({ pages: updatedPages });
};
