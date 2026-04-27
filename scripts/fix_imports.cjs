const fs = require('fs');
const glob = require('glob');

glob.sync('content/articles/*.tsx').forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(/import\s+\{\s*([^{}]+)\s*\}\s+from\s+['"]lucide-react['"];?/g, (match, p1) => {
    const newImports = p1.split(',').map(i => i.trim()).filter(i => {
      const r = new RegExp(`\\b${i}\\b`, 'g');
      const matches = content.match(r);
      return matches && matches.length > 1;
    });
    return newImports.length > 0 ? `import { ${newImports.join(', ')} } from 'lucide-react';` : '';
  });
  content = content.replace(/import\s+React\s+from\s+['"]react['"];?/g, (match) => {
    const r = new RegExp(`\\bReact\\b`, 'g');
    const matches = content.match(r);
    return matches && matches.length > 1 ? match : '';
  });
  content = content.replace(/import\s+\{\s*TargetIcon\s*\}\s+from\s+['"](?:\.\.\/)+components\/AnimatedIcons['"];?/g, (match) => {
    const r = new RegExp(`\\bTargetIcon\\b`, 'g');
    const matches = content.match(r);
    return matches && matches.length > 1 ? match : '';
  });
  fs.writeFileSync(file, content);
  console.log(`Processed ${file}`);
});
