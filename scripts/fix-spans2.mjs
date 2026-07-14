import { readFileSync, writeFileSync } from 'fs';

let c = readFileSync('pages/Insights.tsx', 'utf8');
const orig = c;

// This pattern handles the mixed case:
// &lt;span className="CLASS"&gt;<span className="CLASS">VALUE</span>&lt;/span&gt;
// The inner span was already valid JSX, the outer is escaped. Result → single valid span.
const CLASSES = ['text-emerald-400 font-bold', 'text-red-400 font-bold'];

for (const cls of CLASSES) {
  // Fix mixed escaped+real double-span: &lt;span...&gt;<span...>VALUE</span>&lt;/span&gt;
  const mixedPattern = new RegExp(
    `&lt;span className="${cls}"&gt;<span className="${cls}">([^<]*?)<\\/span>&lt;\\/span&gt;`,
    'g'
  );
  c = c.replace(mixedPattern, (_m, inner) => `<span className="${cls}">${inner}</span>`);
}

if (c !== orig) {
  writeFileSync('pages/Insights.tsx', c, 'utf8');
  console.log('✅ Fixed mixed escaped spans in Insights.tsx');
} else {
  console.log('✔  No changes needed');
}

// Verify
const remaining = (c.match(/&lt;span/g) || []).length;
console.log('Remaining escaped spans:', remaining);
