const editor = document.getElementById("editor");
const preview = document.getElementById("preview");
const emptyState = document.getElementById("emptyState");
const btnClear = document.getElementById("btnClear");
const btnCopyMd = document.getElementById("btnCopyMd");

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
btnClear.addEventListener("click", clearEditor);
btnCopyMd.addEventListener("click", copyMarkdown);

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
  const lines = md.split("\n");
  const result = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(escapeHtml(lines[i]));
        i++;
      }
      const langAttr = lang ? ` class="language-${lang}"` : "";
      result.push(`<pre><code${langAttr}>${codeLines.join("\n")}</code></pre>`);
      i++;
      continue;
    }

    // Heading
    if (line.startsWith("#")) {
      const level = line.match(/^#+/)[0].length;
      const text = line.slice(level + 1);
      result.push(`<h${level}>${text}</h${level}>`);
      i++;
      continue;
    }

    // Horizontal rule
    if (line === "---") {
      result.push("<hr/>");
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      const lines_bq = [];

      while (i < lines.length && lines[i].trim() !== "") {
        if (lines[i].startsWith("> ")) {
          lines_bq.push(lines[i].slice(2));
        } else {
          lines_bq.push(lines[i]);
        }
        i++;
      }

      result.push(`<blockquote>${lines_bq.join("<br/>")}</blockquote>`);
      continue;
    }

    // Table
    if (line.startsWith("|")) {
      const rows = [];

      while (i < lines.length && lines[i].startsWith("|")) {
        const cells = lines[i]
          .split("|")
          .slice(1, -1)
          .map((cell) => cell.trim());

        rows.push(cells);
        i++;
      }

      // Separator Table
      const header = rows[0];
      const body = rows.slice(2);

      const headerHtml = header.map((cell) => `<th>${cell}</th>`).join("");
      const bodyHtml = body
        .map((row) => {
          const cells = row.map((cell) => `<td>${cell}</td>`).join("");
          return `<tr>${cells}</tr>`;
        })
        .join("");

      result.push(
        `<table><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>`,
      );
      continue;
    }

    // Ordered list
    if (/^\d+\. /.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(`<li>${lines[i].replace(/^\d+\. /, "")}</li>`);
        i++;
      }
      result.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    // Unordered list
    if (line.startsWith("- ")) {
      const items = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(`<li>${lines[i].slice(2)}</li>`);
        i++;
      }
      result.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph
    result.push(`<p>${inlineFormat(line)}</p>`);
    i++;
  }

  return result.join("\n");
}

function inlineFormat(text) {
  return text
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1"/>') // image
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>') // link
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") // bold
    .replace(/\*(.+?)\*/g, "<em>$1</em>") // italic
    .replace(/`([^`]+)`/g, "<code>$1</code>"); // inline code
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function clearEditor() {
  editor.value = "";
  render();
  editor.focus();
}

function copyMarkdown() {
  navigator.clipboard.writeText(editor.value);
}
