const fs = require('fs');
const glob = require('glob');

const files = glob.sync('components/**/*.tsx').concat(glob.sync('pages/**/*.tsx'));

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    lines.forEach((line, index) => {
        if (line.includes('key={i}')) {
            // Look for the map call in the previous lines
            let foundMap = false;
            let i_is_defined = false;
            for (let j = index; j >= Math.max(0, index - 10); j--) {
                if (lines[j].includes('.map(')) {
                    foundMap = true;
                    // Check if i is in parameters
                    // e.g. .map((item, i) =>
                    // or .map(i =>
                    const mapMatch = lines[j].match(/\.map\(([^)]+)\)/);
                    if (mapMatch) {
                        const params = mapMatch[1].split(',').map(p => p.trim().split(':')[0].trim());
                        if (params.includes('i') || params[0] === 'i') {
                            i_is_defined = true;
                        }
                    }
                    break;
                }
            }
            if (foundMap && !i_is_defined) {
                console.log(`ERROR: Found potentially undefined i at ${file}:${index + 1}`);
                console.log(`  Line: ${line.trim()}`);
            }
        }
    });
});
