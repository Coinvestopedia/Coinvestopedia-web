const fs = require('fs');

const finalFixes = [
    { file: 'components/tools/Tier4/DividendScreener.tsx', remove: [/fmtPct,\s*/g, /,\s*fmtPct/g] },
    { file: 'components/tools/Tier4/TaxEstimator.tsx', remove: [/ResponsiveContainer,\s*/g, /,\s*ResponsiveContainer/g] },
    { file: 'components/tools/Tier5/FearGreedComposite.tsx', remove: [/ResultMetric,\s*/g, /,\s*ResultMetric/g] },
    { file: 'components/tools/Tier5/MacroRegimeIndicator.tsx', remove: [/Tooltip,\s*/g, /,\s*Tooltip/g] },
    { file: 'components/tools/Tier5/MonteCarloSimulator.tsx', remove: [/AreaChart,\s*/g, /,\s*AreaChart/g, /Area,\s*/g, /,\s*Area/g, /const\s+\[simCount,\s*setSimCount\]\s*=\s*useState\('100\d*'\);/g] },
    { file: 'components/tools/Tier5/RiskAdjustedReturns.tsx', remove: [/fmtPct,\s*/g, /,\s*fmtPct/g] }
];

finalFixes.forEach(({ file, remove }) => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf-8');
        remove.forEach(regex => {
            content = content.replace(regex, (match) => {
                if (match.includes('useState')) return "const [simCount] = useState('100');";
                return '';
            });
        });
        // General cleanup
        content = content.replace(/import\s+\{\s*,\s*/g, 'import { ').replace(/,\s*\}\s+from/g, ' } from').replace(/,\s*,/g, ',');
        fs.writeFileSync(file, content);
    }
});
