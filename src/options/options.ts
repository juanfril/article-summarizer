document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("apiKey") as HTMLInputElement;
  const status = document.getElementById("status");
  const saveButton = document.getElementById("save") as HTMLButtonElement;

  chrome.storage.local.get(["groqApiKey"], (result) => {
    input.value = result.groqApiKey || "";
  });

  const showStatus = (message: string, isError = false) => {
    if (status) {
      status.textContent = message;
      status.className = `status ${isError ? "error" : "success"}`;
      setTimeout(() => {
        status.className = "status";
      }, 3000);
    }
  };

  saveButton?.addEventListener("click", () => {
    const apiKey = input.value.trim();

    if (!apiKey) {
      showStatus("Please enter an API key", true);
      return;
    }

    if (!apiKey.startsWith("gsk_")) {
      showStatus("Invalid API key format", true);
      return;
    }

    chrome.storage.local.set({ groqApiKey: apiKey }, () => {
      showStatus("Settings saved successfully");
    });
  });
});
