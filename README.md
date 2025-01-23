# Article Summarizer 🚀

A Chrome extension that leverages AI to effortlessly summarize articles and provide curated references. Save time and gain insights instantly!

## Features ✨

- **AI-Powered Summaries**: Quickly get concise summaries of any article.
- **Curated References**: Discover additional resources with AI-generated reference links.
- **Seamless Integration**: Works directly in your browser as a Chrome extension.

## Installation 📥

1. Clone the repository:

```bash
git clone https://github.com/yourusername/article-summarizer.git
cd article-summarizer
```

2. Install Bun (if you haven’t already) and prepare the project:

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
- bun run clean - Remove the dist/ directory.

## Folder Structure

- src/lib/ - Core logic for AI interactions and state management.
- src/page/ - Templates and scripts for viewing generated pages.
- src/popup/ - Extension popup UI and functionality.

## Technologies Used 🧠

- LangChain: AI framework for building LLM-powered workflows.
- OpenAI: Powering intelligent summaries and references.
- TypeScript: Ensuring type safety and better developer experience.
- Chrome Extensions: Delivering seamless browser integration.

### Contributing 🤝

Contributions are welcome! Feel free to: 1. Fork the repository. 2. Create a new branch: git checkout -b feature/my-feature. 3. Commit changes: git commit -m 'Add my feature'. 4. Push your branch: git push origin feature/my-feature. 5. Submit a pull request.

### License 📄

This project is licensed under the MIT License.

Feel free to copy and use this directly in your project! If you'd like tweaks or additions, let me know. 😄
