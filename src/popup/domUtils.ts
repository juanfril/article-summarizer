export const renderPages = (
  pages: any[],
  container: HTMLElement,
  onDelete: (id: string) => void
) => {
  container.innerHTML = "";

  pages.forEach((page) => {
    const pageElement = document.createElement("div");
    pageElement.className = "page";

    const link = document.createElement("a");
    link.href = chrome.runtime.getURL(`page/page.html?id=${page.id}`);
    link.textContent = page.title;
    link.target = "_blank";

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => onDelete(page.id));

    pageElement.appendChild(link);
    pageElement.appendChild(deleteButton);
    container.appendChild(pageElement);
  });
};

export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
