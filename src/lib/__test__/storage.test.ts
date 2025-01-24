import { describe, it, expect, vi, beforeEach } from "vitest";
import { getPages, savePage, deletePage } from "../storage";
import { Page } from "../types";

const mockChromeStorage = {
  get: vi.fn(),
  set: vi.fn(),
};

global.chrome = {
  storage: {
    local: mockChromeStorage,
  },
} as any;

describe("Storage Module", () => {
  const mockPage: Page = {
    id: "123",
    title: "Test Article",
    summary: "Test summary",
    links: [],
    createdAt: "2024-01-01T00:00:00.000Z",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getPages", () => {
    it("should return empty array when no pages exist", async () => {
      mockChromeStorage.get.mockResolvedValueOnce({ pages: [] });
      const result = await getPages();
      expect(result).toEqual([]);
      expect(mockChromeStorage.get).toHaveBeenCalledWith("pages");
    });

    it("should return stored pages", async () => {
      mockChromeStorage.get.mockResolvedValueOnce({ pages: [mockPage] });
      const result = await getPages();
      expect(result).toEqual([mockPage]);
    });
  });

  describe("savePage", () => {
    it("should add new page when it does not exist", async () => {
      mockChromeStorage.get.mockResolvedValueOnce({ pages: [] });
      await savePage(mockPage);
      expect(mockChromeStorage.set).toHaveBeenCalledWith({
        pages: [mockPage],
      });
    });

    it("should update existing page", async () => {
      const updatedPage = { ...mockPage, summary: "Updated summary" };
      mockChromeStorage.get.mockResolvedValueOnce({ pages: [mockPage] });
      await savePage(updatedPage);
      expect(mockChromeStorage.set).toHaveBeenCalledWith({
        pages: [updatedPage],
      });
    });
  });

  describe("deletePage", () => {
    it("should remove page by id", async () => {
      mockChromeStorage.get.mockResolvedValueOnce({ pages: [mockPage] });
      await deletePage(mockPage.id);
      expect(mockChromeStorage.set).toHaveBeenCalledWith({ pages: [] });
    });

    it("should handle deleting non-existent page", async () => {
      mockChromeStorage.get.mockResolvedValueOnce({ pages: [mockPage] });
      await deletePage("non-existent-id");
      expect(mockChromeStorage.set).toHaveBeenCalledWith({
        pages: [mockPage],
      });
    });
  });
});
