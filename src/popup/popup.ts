document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("pages");

  chrome.storage.local.get(["pages"], (result) => {
    const pages = result.pages || [];

    pages.forEach((page) => {
      const pageElement = document.createElement("div");
      pageElement.className = "page";

      const link = document.createElement("a");
      link.href = `page/page.html?id=${page.id}`;
      link.textContent = page.title;
      link.target = "_blank";

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => {
        chrome.storage.local.set(
          { pages: pages.filter((p) => p.id !== page.id) },
          () => location.reload()
        );
      });

      pageElement.appendChild(link);
      pageElement.appendChild(deleteButton);
      container.appendChild(pageElement);
    });
  });
});
