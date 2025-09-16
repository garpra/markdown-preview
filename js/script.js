const editor = document.getElementById("editor");
const preview = document.getElementById("preview");
const emptyState = document.getElementById("emptyState");

// Default content
const SAMPLE = `# Hello, Markdown!
 
Welcome to **md·preview** — a clean, distraction-free Markdown editor.
 
## Features
 
- Live preview as you type
- Syntax-highlighted code blocks
- Table rendering
- Blockquote support
 
## Code Example
 
\`\`\`javascript
const greet = (name) => {
  return \`Hello, \${name}!\`;
};
 
console.log(greet("World"));
\`\`\`
 
## Blockquote
 
> "Simplicity is the ultimate sophistication."
> — Leonardo da Vinci
 
## Table
 
| Feature    | Status |
|------------|--------|
| Live edit  | ✓      |
| Dark theme | ✓      |
| Export HTML | ✓     |
 
---
 
Start editing on the **left** to see your preview update here in real-time.
`;

editor.value = SAMPLE;
render();

editor.addEventListener("input", render);

function render() {
  const md = editor.value.trim();

  if (!md) {
    preview.innerHTML = "";
    preview.appendChild(emptyState);
    return;
  }

  const html = parseMarkdown(md);
  preview.innerHTML = html;
}

function parseMarkdown(md) {
  return md;
}
