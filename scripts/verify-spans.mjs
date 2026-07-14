import { readFileSync } from 'fs';
const c = readFileSync('pages/Insights.tsx', 'utf8');
const escaped = (c.match(/&lt;span/g) || []).length;
const doubled = (c.match(/<span className="text-emerald-400 font-bold"><span/g) || []).length;
console.log('Remaining escaped spans:', escaped);
console.log('Remaining doubled spans:', doubled);
