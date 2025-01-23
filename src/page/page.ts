document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const pageId = params.get("id");

  if (!pageId) {
    document.body.innerHTML = "<p>Page not found.</p>";
    return;
  }

  chrome.storage.local.get(["pages"], (result) => {
    const pages = result.pages || [];
    const page = pages.find((p: any) => p.id === pageId);

    if (!page) {
      document.body.innerHTML = "<p>Page not found.</p>";
      return;
    }

    document.getElementById("page-title")!.textContent = page.title;
    document.getElementById("summary")!.textContent = page.summary;

    const referencesList = document.getElementById("references")!;
    page.links.forEach((link: { title: string; url: string }) => {
      const listItem = document.createElement("li");
      const anchor = document.createElement("a");

      anchor.href = link.url.startsWith("http")
        ? link.url
        : `https://${link.url}`;
      anchor.textContent = link.title;
      anchor.target = "_blank";

      listItem.appendChild(anchor);
      referencesList.appendChild(listItem);
    });
  });
});
