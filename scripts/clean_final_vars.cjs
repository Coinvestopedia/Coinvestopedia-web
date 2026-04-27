const fs = require('fs');

const filesToFix = [
  { file: 'components/tools/Tier1/RebalancingCalculator.tsx', remove: [/i,\s*/g, /,\s*i/g] },
  { file: 'components/tools/Tier3/ROICalculator.tsx', remove: [/entry,\s*/g, /,\s*entry/g] },
  { file: 'components/tools/Tier4/DividendScreener.tsx', remove: [/fmtPct,\s*/g, /,\s*fmtPct/g] },
  { file: 'components/tools/Tier5/MacroRegimeIndicator.tsx', remove: [/Tooltip,\s*/g, /,\s*Tooltip/g] },
  { file: 'components/tools/Tier5/MonteCarloSimulator.tsx', remove: [/AreaChart,\s*/g, /,\s*AreaChart/g, /Area,\s*/g, /,\s*Area/g, /const\s+\[simCount,\s*setSimCount\]\s*=\s*useState\('1000'\);/g] },
  { file: 'components/tools/Tier5/RiskAdjustedReturns.tsx', remove: [/fmtPct,\s*/g, /,\s*fmtPct/g] }
];

filesToFix.forEach(({ file, remove }) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');
    remove.forEach(regex => {
      if (regex instanceof RegExp) {
        content = content.replace(regex, (match) => {
            if (match.includes('useState')) return "const [simCount] = useState('1000');";
            return '';
        });
      }
    });
    // Cleanup double commas or empty imports
    content = content.replace(/\{\s*,\s*/g, '{ ').replace(/,\s*\}/g, ' }').replace(/,\s*,/g, ',');
    fs.writeFileSync(file, content);
    console.log(`Cleaned up ${file}`);
  }
});
