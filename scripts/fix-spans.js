/**
 * fix-spans.js
 * Fixes two classes of broken span tags in Insights.tsx and MacroIntel.tsx:
 *
 * Class A — HTML-entity-escaped spans (appear as raw text in the browser):
 *   &lt;span className="text-emerald-400 font-bold"&gt;VALUE&lt;/span&gt;
 *   → <span className="text-emerald-400 font-bold">VALUE</span>
 *
 * Class B — Double-nested identical spans (render correctly but are redundant):
 *   <span className="text-emerald-400 font-bold"><span className="text-emerald-400 font-bold">VALUE</span></span>
 *   → <span className="text-emerald-400 font-bold">VALUE</span>
 */

const fs = require('fs');
const path = require('path');

const FILES = [
  path.join(process.cwd(), 'pages', 'Insights.tsx'),
  path.join(process.cwd(), 'pages', 'MacroIntel.tsx'),
];

const SPAN_CLASSES = ['text-emerald-400 font-bold', 'text-red-400 font-bold'];

for (const filePath of FILES) {
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping (not found): ${filePath}`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  for (const cls of SPAN_CLASSES) {
    // ── Class A fix: un-escape HTML-entity-escaped spans ────────────────────
    // Pattern: &lt;span className="CLS"&gt;VALUE&lt;/span&gt;
    const escapedOpen  = `&lt;span className=\\"${cls}\\"&gt;`;
    const escapedClose = `&lt;/span&gt;`;

    // Use a regex that captures the content between the escaped tags
    const escapedPattern = new RegExp(
      `&lt;span className="${cls.replace(/\s/g, '\\s')}"&gt;([^<]*?)&lt;\\/span&gt;`,
      'g'
    );
    content = content.replace(escapedPattern, (_, inner) => {
      return `<span className="${cls}">${inner}</span>`;
    });

    // ── Class B fix: collapse double-nested spans ────────────────────────────
    // Pattern: <span className="CLS"><span className="CLS">VALUE</span></span>
    const doublePattern = new RegExp(
      `<span className="${cls.replace(/\s/g, '\\s')}"><span className="${cls.replace(/\s/g, '\\s')}">([^<]*?)<\\/span><\\/span>`,
      'g'
    );
    content = content.replace(doublePattern, (_, inner) => {
      return `<span className="${cls}">${inner}</span>`;
    });
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${path.basename(filePath)}`);
  } else {
    console.log(`✔  No changes needed: ${path.basename(filePath)}`);
  }
}

console.log('Done.');
