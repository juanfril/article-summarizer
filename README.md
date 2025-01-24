# Article Summarizer 🚀

Welcome to **Article Summarizer**! A Chrome extension that leverages AI to effortlessly summarize articles and provide curated references. Save time and gain insights instantly—perfect for students, professionals, and curious minds!

## Features ✨

- **AI-Powered Summaries**: Quickly get concise summaries of any article.
- **Curated References**: Discover additional resources with AI-generated reference links.
- **Seamless Integration**: Works directly in your browser as a Chrome extension.

## Installation 📥

1. Clone the repository:

```bash
git clone https://github.com/juanfril/article-summarizer.git
cd article-summarizer
```

2. Install [Bun](https://bun.sh/) (if you haven’t already) and prepare the project:

```bash
bun install
bun run prepare
```

3. Load the extension into Chrome:
   1. Open `chrome://extensions` in your browser.
   2. Enable “Developer Mode” (top-right corner).
   3. Click “Load unpacked” and select the `dist/` directory.

## Usage 🛠️

1. Click the Article Summarizer icon in your Chrome toolbar.
2. Paste the URL of an article and hit Generate Summary.
3. View the summary and references, or open the saved page for later!

## Development 💻

### Scripts

- bun run dev - Start the development server.
- bun run build - Build the extension for production.
- bun run clean - Remove the `dist/` directory.

## Folder Structure

- src/lib/ - Core logic for AI interactions and state management.
- src/page/ - Templates and scripts for viewing generated pages.
- src/popup/ - Extension popup UI and functionality.

## Technologies Used 🧠

- LangChain: AI framework for building LLM-powered workflows.
- OpenAI: Powering intelligent summaries and references.
- TypeScript: Ensuring type safety and better developer experience.
- Chrome Extensions: Delivering seamless browser integration.

### How to Test the Extension in Chrome

1. **Load the Extension**: Follow the installation steps above.
2. **Click the Icon**: Once loaded, you’ll see the **Article Summarizer** icon in your Chrome toolbar.
3. **Paste a URL**: Open the popup, paste the URL of an article, and click "Generate Summary."
4. **Explore the Results**: You’ll see the summary and generated references. It’s that easy!

### Contributing 🤝

Contributions are welcome! Feel free to:

1. Fork the repository.
2. Create a new branch: git checkout -b feature/my-feature.
3. Commit changes: git commit -m 'Add my feature'.
4. Push your branch: git push origin feature/my-feature. 5. Submit a pull request.

### License 📄

This project is licensed under the MIT License.

---

That's it! You're now ready to summarize articles like a pro. If you have questions or suggestions, feel free to open an issue in the repository. Happy summarizing! 😄
