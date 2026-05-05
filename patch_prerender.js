
const fs = require('fs');

const modifications = [
  { file: 'pages/Exchanges.tsx', componentName: 'ExchangesStatic' },
  { file: 'pages/MacroIntel.tsx', componentName: 'MacroIntelStatic' },
  { file: 'pages/Tools.tsx', componentName: 'ToolsStatic' },
  { file: 'pages/Learn.tsx', componentName: 'KnowledgeStatic' },
  { file: 'pages/Newsletter.tsx', componentName: 'BriefingStatic' },
  { file: 'pages/WhaleTracker.tsx', componentName: 'WhaleTrackerStatic' },
  { file: 'pages/Compare.tsx', componentName: 'AssetComparisonStatic' },
];

modifications.forEach(({ file, componentName }) => {
  if (!fs.existsSync(file)) {
    console.error(File not found: );
    return;
  }
  let content = fs.readFileSync(file, 'utf-8');

  if (content.includes('useIsPrerendering')) {
    console.log(Already patched: );
    return;
  }

  // 1. Add imports
  const importLines = \nimport { useIsPrerendering } from '../hooks/useIsPrerendering';\nimport {  } from '../components/PrerenderFallbacks';\n;
  content = content.replace(/(import .* from '.*';\r?\n)/, $1);

  // 2. Add hook and return
  const componentMatch = content.match(/export const [A-Za-z]+: React\.FC<[^>]*>\s*=\s*\([^)]*\)\s*=>\s*\{/);
  if (componentMatch) {
    const hookLines = \n  const isPrerendering = useIsPrerendering();\n  if (isPrerendering) return < />;\n;
    content = content.replace(componentMatch[0], componentMatch[0] + hookLines);
    fs.writeFileSync(file, content, 'utf-8');
    console.log(Patched: );
  } else {
    console.error(Could not find component signature in );
  }
});

