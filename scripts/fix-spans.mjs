import { readFileSync, writeFileSync } from 'fs';

const FILES = [
  'pages/Insights.tsx',
  'pages/MacroIntel.tsx',
];

const CLASSES = ['text-emerald-400 font-bold', 'text-red-400 font-bold'];

for (const f of FILES) {
  let c = readFileSync(f, 'utf8');
  const orig = c;

  for (const cls of CLASSES) {
    // Class A: fix HTML-entity-escaped spans
    // Pattern: &lt;span className="CLS"&gt;VALUE&lt;/span&gt;
    const re1 = new RegExp(`&lt;span className="${cls}"&gt;([^&<]*?)&lt;\\/span&gt;`, 'g');
    c = c.replace(re1, (_match, inner) => `<span className="${cls}">${inner}</span>`);

    // Class B: collapse double-nested spans
    // Pattern: <span className="CLS"><span className="CLS">VALUE</span></span>
    const re2 = new RegExp(`<span className="${cls}"><span className="${cls}">([^<]*?)<\\/span><\\/span>`, 'g');
    c = c.replace(re2, (_match, inner) => `<span className="${cls}">${inner}</span>`);
  }

  if (c !== orig) {
    writeFileSync(f, c, 'utf8');
    console.log(`✅ Fixed: ${f}`);
  } else {
    console.log(`✔  No changes: ${f}`);
  }
}

console.log('Done.');
