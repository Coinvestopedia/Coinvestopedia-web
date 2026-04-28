const fs = require('fs');
const glob = require('glob');

// Fix recharts formatters in non-tool components
glob.sync('components/*.tsx').concat(glob.sync('components/compare/*.tsx')).forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');
    content = content.replace(/formatter=\{\s*\(([^)]+)\)\s*=>/g, (match, p1) => {
        const params = p1.split(',').map(param => {
          const [name] = param.split(':').map(s => s.trim());
          return `${name}: any`;
        });
        return `formatter={(${params.join(', ')}) =>`;
    });
    
    // Fix unused i
    content = content.replace(/,\s*i\)\s*=>/g, ', _) =>');
    content = content.replace(/map\(\(i\)\s*=>/g, 'map((_) =>');

    // Fix unused btcPrice
    content = content.replace(/const\s+\{\s*btcPrice,\s*confidence\s*\}\s*=\s*useAppContext\(\);/g, "const { confidence } = useAppContext();");

    fs.writeFileSync(file, content);
    console.log(`Cleaned up ${file}`);
  }
});
