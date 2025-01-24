import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderPages } from "../domUtils";
import { Page } from "../../lib/types";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
(global as any).document = dom.window.document;
(global as any).window = dom.window;
(global as any).HTMLElement = dom.window.HTMLElement;

describe("renderPages", () => {
  let container: HTMLDivElement;
  let onDeleteMock: (id: string) => void;

  const mockGetURL = vi.fn((path) => `chrome://${path}`);
  (global as any).chrome = {
    runtime: {
      getURL: mockGetURL,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    container = document.createElement("div");
    onDeleteMock = vi.fn();
  });

  it("should render empty container when no pages provided", () => {
    renderPages([], container, onDeleteMock);
    expect(container.innerHTML).toBe("");
    expect(onDeleteMock).not.toHaveBeenCalled();
  });

  it("should render pages with correct structure", () => {
    const mockPages: Partial<Page>[] = [
      { id: "1", title: "Page 1" },
      { id: "2", title: "Page 2" },
    ];

    renderPages(mockPages, container, onDeleteMock);

    const pageElements = container.querySelectorAll(".page");
    expect(pageElements.length).toBe(2);

    const firstPage = pageElements[0];
    const link = firstPage.querySelector("a");
    const deleteButton = firstPage.querySelector("button");

    expect(link).toBeTruthy();
    expect(link?.href).toBe("chrome://page/page.html?id=1");
    expect(link?.textContent).toBe("Page 1");
    expect(link?.target).toBe("_blank");

    expect(deleteButton).toBeTruthy();
    expect(deleteButton?.textContent).toBe("Delete");
  });

  it("should call onDelete with correct id when delete button clicked", () => {
    const mockPages: Partial<Page>[] = [{ id: "1", title: "Page 1" }];

    renderPages(mockPages, container, onDeleteMock);

    const deleteButton = container.querySelector("button");
    deleteButton?.click();

    expect(onDeleteMock).toHaveBeenCalledTimes(1);
    expect(onDeleteMock).toHaveBeenCalledWith("1");
  });

  it("should clear container before rendering new pages", () => {
    renderPages([{ id: "1", title: "Page 1" }], container, onDeleteMock);
    expect(container.children.length).toBe(1);

    renderPages([{ id: "2", title: "Page 2" }], container, onDeleteMock);
    expect(container.children.length).toBe(1);

    const link = container.querySelector("a");
    expect(link?.textContent).toBe("Page 2");
  });
});
