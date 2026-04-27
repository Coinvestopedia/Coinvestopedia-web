const fs = require('fs');
const glob = require('glob');

glob.sync('components/tools/**/*.tsx').forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  // Replace formatter=(v: number | string) or formatter=(v: number, name: string) with any
  content = content.replace(/formatter=\{\s*\(([^)]+)\)\s*=>/g, (match, p1) => {
    const params = p1.split(',').map(param => {
      const [name] = param.split(':').map(s => s.trim());
      return `${name}: any`;
    });
    return `formatter={(${params.join(', ')}) =>`;
  });
  
  // Quick fix for the other Recharts formatter issues
  content = content.replace(/formatter=\{\s*\(\s*v\s*:\s*number\s*\|\s*string\s*\)\s*=>/g, 'formatter={(v: any) =>');
  
  fs.writeFileSync(file, content);
  console.log(`Fixed formatters in ${file}`);
});
