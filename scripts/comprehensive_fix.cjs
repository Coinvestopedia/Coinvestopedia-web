const fs = require('fs');
const glob = require('glob');

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf-8');
  let changed = false;

  // 1. Fix Recharts formatters
  const newContent1 = content.replace(/formatter=\{\s*\(([^)]+)\)\s*=>/g, (match, p1) => {
    changed = true;
    const params = p1.split(',').map(param => {
      const [name] = param.split(':').map(s => s.trim());
      return name === 'name' ? '_name' : name === 'i' ? '_i' : name;
    });
    // Add : any to all params
    const typedParams = params.map(p => `${p}: any`);
    return `formatter={(${typedParams.join(', ')}) =>`;
  });
  content = newContent1;

  // 2. Fix unused React import
  if (content.match(/import\s+React,\s*\{\s*([^}]+)\s*\}\s+from\s+['"]react['"]/)) {
      content = content.replace(/import\s+React,\s*\{\s*([^}]+)\s*\}\s+from\s+['"]react['"]/, (match, p1) => {
          if (!content.includes('<React.') && !content.includes('React.')) {
              changed = true;
              return `import { ${p1} } from 'react'`;
          }
          return match;
      });
  }

  // 3. Fix unused btcPrice in useAppContext
  if (content.includes('const { btcPrice, confidence } = useAppContext();')) {
      content = content.replace('const { btcPrice, confidence } = useAppContext();', 'const { confidence } = useAppContext();');
      changed = true;
  }

  // 4. Fix Select.tsx TS7030
  if (file.endsWith('Select.tsx') && content.includes('if (isOpen) {') && !content.includes('return undefined;')) {
      content = content.replace('if (isOpen) {\n      document.addEventListener(\'mousedown\', handleClickOutside);\n      return () => document.removeEventListener(\'mousedown\', handleClickOutside);\n    }', 'if (isOpen) {\n      document.addEventListener(\'mousedown\', handleClickOutside);\n      return () => document.removeEventListener(\'mousedown\', handleClickOutside);\n    }\n    return undefined;');
      changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Fixed ${file}`);
  }
}

glob.sync('components/**/*.tsx').forEach(fixFile);
glob.sync('pages/**/*.tsx').forEach(fixFile);
glob.sync('data/**/*.tsx').forEach(fixFile);
