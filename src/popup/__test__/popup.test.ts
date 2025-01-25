import { describe, it, expect, vi, beforeEach } from "vitest";
import { deletePage, getPages, savePage } from "../../lib/storage";
import { processArticle } from "../../services/processArticle";
import { isValidUrl, renderPages } from "../domUtils";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
  url: "http://localhost",
  runScripts: "dangerously",
  resources: "usable",
  pretendToBeVisual: true,
});

global.document = dom.window.document;
(global as any).window = dom.window;
global.HTMLElement = dom.window.HTMLElement;
global.DOMParser = dom.window.DOMParser;
(global as any).Event = dom.window.Event;
(global as any).CustomEvent = dom.window.CustomEvent;
(global as any).alert = vi.fn();
(global as any).chrome = {
  runtime: {
    getURL: vi.fn((path) => `chrome://${path}`),
  },
};
(global as any).crypto = {
  randomUUID: vi.fn().mockReturnValue("test-uuid"),
};
(global as any).fetch = vi.fn().mockResolvedValue({
  text: () =>
    Promise.resolve("<html><head><title>Test Title</title></head></html>"),
  ok: true,
});

const mockGetPages = vi.fn().mockResolvedValue([]);
const mockSavePage = vi.fn().mockResolvedValue(undefined);
const mockDeletePage = vi.fn().mockResolvedValue(undefined);
const mockProcessArticle = vi.fn().mockResolvedValue({
  summary: "Test summary",
  references: [],
});
const mockIsValidUrl = vi.fn().mockReturnValue(true);
const mockRenderPages = vi.fn();

vi.mock("../../lib/storage", () => ({
  getPages: () => mockGetPages(),
  savePage: (page: any) => mockSavePage(page),
  deletePage: (id: string) => mockDeletePage(id),
}));

vi.mock("../../services/processArticle", () => ({
  processArticle: (url: string) => mockProcessArticle(url),
}));

vi.mock("../domUtils", () => ({
  isValidUrl: (url: string) => mockIsValidUrl(url),
  renderPages: (pages: any[], container: HTMLElement, callback: Function) =>
    mockRenderPages(pages, container, callback),
}));

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  document.body.innerHTML = "";
});

describe("Popup", () => {
  let popupModule: any;
  let form: HTMLFormElement;
  let input: HTMLInputElement;
  let resultContainer: HTMLDivElement;
  let pagesContainer: HTMLDivElement;

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();

    document.body.innerHTML = `
      <form id="articleForm">
        <input id="articleUrl" type="text" />
      </form>
      <div id="result"></div>
      <div id="pages"></div>
    `;

    form = document.getElementById("articleForm") as HTMLFormElement;
    input = document.getElementById("articleUrl") as HTMLInputElement;
    resultContainer = document.getElementById("result") as HTMLDivElement;
    pagesContainer = document.getElementById("pages") as HTMLDivElement;

    mockGetPages.mockResolvedValue([]);
    mockIsValidUrl.mockReturnValue(true);
    mockProcessArticle.mockResolvedValue({
      summary: "Test summary",
      references: [],
    });

    popupModule = await import("../popup");
    document.dispatchEvent(new Event("DOMContentLoaded"));

    await vi.waitFor(() => {
      expect(mockGetPages).toHaveBeenCalled();
    });
  });

  it("should load pages on initialization", async () => {
    expect(mockGetPages).toHaveBeenCalled();
    expect(mockRenderPages).toHaveBeenCalledWith(
      [],
      expect.any(HTMLElement),
      expect.any(Function)
    );
  });

  it("should handle form submission with valid URL", async () => {
    await import("../popup");

    input.value = "https://example.com";
    const submitEvent = new Event("submit", {
      bubbles: true,
      cancelable: true,
    });
    form.dispatchEvent(submitEvent);

    await vi.waitFor(() => {
      expect(mockProcessArticle).toHaveBeenCalledWith("https://example.com");
      expect(mockSavePage).toHaveBeenCalledWith({
        id: "test-uuid",
        title: "Test Title",
        summary: "Test summary",
        links: [],
        createdAt: expect.any(String),
      });
      expect(resultContainer.textContent).toBe(
        "Summary generated successfully."
      );
    });
  });

  it("should handle invalid URLs", async () => {
    const alertMock = vi.fn();
    (global as any).alert = alertMock;
    mockIsValidUrl.mockReturnValue(false);

    input.value = "invalid-url";
    const submitEvent = new Event("submit", {
      bubbles: true,
      cancelable: true,
    });
    form.dispatchEvent(submitEvent);

    expect(alertMock).toHaveBeenCalledWith("Please enter a valid URL.");
    expect(mockProcessArticle).not.toHaveBeenCalled();
  });

  it("should handle page deletion", async () => {
    mockGetPages.mockClear();

    const mockPages = [
      {
        id: "test-id",
        title: "Test Page",
        summary: "Test summary",
        links: [],
        createdAt: "2024-01-01T00:00:00.000Z",
      },
    ];
    mockGetPages.mockResolvedValue(mockPages);

    let capturedCallback: ((id: string) => void) | undefined;
    mockRenderPages.mockImplementation((_, __, callback) => {
      capturedCallback = callback;
    });

    await import("../popup");
    document.dispatchEvent(new Event("DOMContentLoaded"));

    await vi.waitFor(() => {
      expect(mockRenderPages).toHaveBeenCalled();
    });

    mockGetPages.mockClear();

    await capturedCallback!("test-id");

    expect(mockDeletePage).toHaveBeenCalledWith("test-id");
    expect(mockGetPages).toHaveBeenCalledTimes(1);
  });
});
