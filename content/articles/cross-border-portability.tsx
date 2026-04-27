
import { TargetIcon } from '../../components/AnimatedIcons';
import { Article } from '../../pages/Insights';
import { Globe } from 'lucide-react';

export const crossBorderPortabilityArticle: Article = {
  id: 'cross-border-portability',
  title: 'Cross-Border Asset Portability in Conflict Zones',
  category: 'Geopolitics',
  readTime: '12 min read',
  date: 'March 24, 2026',
  image: '/cross-border-featured.png',
  desc: "In conflict zones, traditional banking is the first casualty. Understanding self-custody and P2P liquidity corridors is the difference between trapped wealth and mobility.",
  icon: <Globe className="text-primary" size={24} />,
  keyInsights: [
    "Sovereign Mobility: Self-custody eliminates the 'jurisdictional trap,' allowing wealth to move faster than physical conflict escalates.",
    "Ukraine Case Study: In the first 48 hours of the 2022 invasion, $100M+ in crypto donations were processed while traditional bank networks were disrupted.",
    "Banking Vulnerability: SWIFT disconnections (Russia 2022) and hyperinflation-driven bank runs (Lebanon 2019) prove that legacy rails are the first casualty of instability.",
    "Exchange Dependency Risk: Centralized exchanges introduce geographic compliance variation (e.g., $5,000 withdrawal caps in Turkey vs. $100,000+ in UAE).",
    "P2P Lifeline: In conflict zones, P2P liquidity is the only viable exit ramp when ATMs empty and card networks collapse."
  ],
  faq: [
    { question: "How does crypto help in conflict zones?", answer: "Crypto enables borderless wealth transfer through self-custody, bypassing traditional banking freezes, SWIFT disconnections, and physical border confiscation risk." },
    { question: "What happened to crypto usage during the Ukraine invasion?", answer: "Over $100 million in crypto donations were received within 48 hours, and citizens used digital assets to preserve capital against hryvnia volatility when ATMs and banks failed." },
    { question: "Why is self-custody better than exchange-custody in instability?", answer: "Exchanges are subject to local jurisdictional laws and can freeze accounts or limit withdrawals (e.g., $5,000 caps in Turkey) during political transitions, whereas self-custody remains under the user's direct control." }
  ],
  content: (
    <>
      <p className="text-xl text-text-muted mb-8 italic">
        The Jurisdictional Trap: Traditional wealth storage fails during geopolitical instability.
      </p>
      
      <h2 className="text-2xl font-bold mt-10 mb-4 text-text">Three Critical Barriers to Mobility</h2>
      
      <h3 className="text-xl font-bold mt-6 mb-2 text-primary">1. Physical constraints:</h3>
      <ul className="list-disc pl-5 mb-6 space-y-2">
        <li><strong>Cash:</strong> Detection risk at borders, currency controls, confiscation.</li>
        <li><strong>Gold:</strong> Weight, security screening, import duties.</li>
        <li><strong>Real estate:</strong> Illiquid, immovable, subject to seizure.</li>
      </ul>

      <h3 className="text-xl font-bold mt-6 mb-2 text-primary">2. Banking system vulnerabilities:</h3>
      <ul className="list-disc pl-5 mb-6 space-y-2">
        <li>Account freezes during political transitions.</li>
        <li>SWIFT disconnection (Russia 2022, Iran 2018).</li>
        <li>Correspondent banking restrictions.</li>
        <li>Capital controls emerge rapidly (Cyprus 2013, Lebanon 2019).</li>
      </ul>

      <div className="my-10 rounded-2xl overflow-hidden border border-border shadow-2xl">
         <img src="/cross-border-featured.png" alt="Global Supply Chain Disruption" className="w-full h-auto object-cover" />
         <div className="p-4 bg-background/50 text-xs text-center border-t border-border italic text-text-muted">
            Sovereign Asset Portability: Self-custody serves as a digital corridor, enabling wealth to move across borders when physical and banking systems fail.
         </div>
      </div>

      <h3 className="text-xl font-bold mt-6 mb-2 text-primary">3. Time sensitivity:</h3>
      <ul className="list-disc pl-5 mb-8 space-y-2">
        <li><strong>Bank wire transfers:</strong> 1-5 business days.</li>
        <li><strong>International checks:</strong> 7-14 days.</li>
        <li><strong>Property liquidation:</strong> weeks to months.</li>
        <li className="text-red-400 font-medium">Conflict escalates faster than asset mobility.</li>
      </ul>

      <div className="my-10 p-6 bg-surface border border-border rounded-xl">
         <h3 className="text-lg font-bold mb-3 flex items-center gap-2"><TargetIcon className="w-5 h-5 text-primary" /> Case study: Ukraine 2022</h3>
         <p className="text-sm">Ukrainian government received $100M+ in crypto donations within 48 hours of invasion. Citizens used crypto to:</p>
         <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-text-muted">
            <li>Convert hryvnia before currency collapse</li>
            <li>Receive remittances from abroad</li>
            <li>Pay for border crossing services</li>
            <li>Purchase supplies in neighboring countries</li>
         </ul>
         <p className="text-sm mt-3 border-t border-border pt-3">
            <strong>Contrast with traditional banking:</strong> ATMs emptied, card networks disrupted, international transfers delayed weeks.
         </p>
      </div>

      <div className="my-10 rounded-2xl overflow-hidden border border-border shadow-2xl">
         <img src="/cross-border-2.png" alt="Letter of Credit Rejected" className="w-full h-auto object-cover" />
         <div className="p-4 bg-background/50 text-xs text-center border-t border-border italic text-text-muted">
            Trade finance breakdown: Letters of credit are often the first casualty of banking restrictions.
         </div>
      </div>

      <h2 className="text-2xl font-bold mt-10 mb-4 text-text">The Crypto Solution: Self-Custody</h2>
      <p className="mb-4">Bitcoin and Ethereum enable borderless wealth transfer through cryptographic keys, not physical possession.</p>
      
      <h3 className="text-xl font-bold mt-6 mb-2 text-text">The Exchange Jurisdiction Problem</h3>
      <p className="mb-4">
         Centralized exchanges (Coinbase, Binance, Kraken) introduce regulatory dependencies that negate crypto's portability advantage. Geographic compliance variation poses severe risks when crossing borders.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
         <div className="p-5 bg-background border border-border rounded-lg">
            <h4 className="font-bold text-red-400 mb-2">Turkey Example</h4>
            <ul className="text-sm text-text-muted space-y-2 list-none">
               <li><span className="text-text font-medium">Enhanced KYC:</span> Proof of address, tax ID, biometric</li>
               <li><span className="text-text font-medium">Caps:</span> $5,000 daily withdrawals</li>
               <li><span className="text-text font-medium">Reporting:</span> &gt;$1,500 flagged to authorities</li>
               <li><span className="text-text font-medium">Delays:</span> 3-7 days for international</li>
            </ul>
         </div>
         <div className="p-5 bg-background border border-border rounded-lg">
            <h4 className="font-bold text-emerald-400 mb-2">UAE Example</h4>
            <ul className="text-sm text-text-muted space-y-2 list-none">
               <li><span className="text-text font-medium">Minimal KYC:</span> ID and selfie sufficient</li>
               <li><span className="text-text font-medium">Limits:</span> $100,000+ daily withdrawals</li>
               <li><span className="text-text font-medium">Speed:</span> &lt;24 hours processing</li>
               <li><span className="text-text font-medium">Tax:</span> No capital gains tax</li>
            </ul>
         </div>
      </div>

      <h2 className="text-2xl font-bold mt-10 mb-4 text-text">Risk Matrix Analysis</h2>
      <div className="leather-card p-6 rounded-xl mb-10 overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse min-w-[600px]">
               <thead>
                  <tr className="border-b border-border text-text-muted">
                     <th className="py-3 pr-4 font-medium uppercase text-xs">Scenario</th>
                     <th className="py-3 px-4 font-medium uppercase text-xs">Cash/Gold</th>
                     <th className="py-3 px-4 font-medium uppercase text-xs">Bank Account</th>
                     <th className="py-3 px-4 font-medium uppercase text-xs">Crypto (Exchange)</th>
                     <th className="py-3 pl-4 font-medium uppercase text-xs">Crypto (Self-Custody)</th>
                  </tr>
               </thead>
               <tbody>
                  <tr className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                     <td className="py-3 pr-4 font-medium">Border Confiscation</td>
                     <td className="py-3 px-4 text-red-400">High</td>
                     <td className="py-3 px-4 text-green-400">Low</td>
                     <td className="py-3 px-4 text-green-400">None</td>
                     <td className="py-3 pl-4 text-green-400">None</td>
                  </tr>
                  <tr className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                     <td className="py-3 pr-4 font-medium">Account Freeze</td>
                     <td className="py-3 px-4 text-text-muted">N/A</td>
                     <td className="py-3 px-4 text-red-400">High</td>
                     <td className="py-3 px-4 text-red-400">High</td>
                     <td className="py-3 pl-4 text-green-400">None</td>
                  </tr>
                  <tr className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                     <td className="py-3 pr-4 font-medium">Access Delay</td>
                     <td className="py-3 px-4 text-green-400">None</td>
                     <td className="py-3 px-4 text-amber-400">Medium</td>
                     <td className="py-3 px-4 text-red-400">High</td>
                     <td className="py-3 pl-4 text-green-400">None</td>
                  </tr>
                  <tr className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                     <td className="py-3 pr-4 font-medium">Volatility Risk</td>
                     <td className="py-3 px-4 text-amber-400">Low-Med</td>
                     <td className="py-3 px-4 text-green-400">Low</td>
                     <td className="py-3 px-4 text-red-400">High</td>
                     <td className="py-3 pl-4 text-red-400">High</td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
    </>
  )
};
