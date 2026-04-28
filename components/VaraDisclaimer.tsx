import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

interface VaraDisclaimerProps {
  variant?: 'banner' | 'inline';
  className?: string;
}

/**
 * VARA-Compliant Disclaimer
 * 
 * Required on every page involving crypto data to maintain VARA (Dubai)
 * "Educational Exemption" status. Ensures Coinvestopedia is not classified
 * as an Investment Advisory platform.
 * 
 * Variants:
 *  - `banner`: Full-width prominent banner for page-level placement
 *  - `inline`: Compact version for article footers and tool outputs
 */
export const VaraDisclaimer: React.FC<VaraDisclaimerProps> = ({ variant = 'banner', className = '' }) => {
  if (variant === 'inline') {
    return (
      <div className={`mt-10 p-4 bg-amber-500/5 border border-amber-500/15 rounded-xl ${className}`}>
        <div className="flex items-start gap-3">
          <Info size={16} className="text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-text-muted leading-relaxed">
            <strong className="text-amber-400/80">Important Disclosure:</strong> Virtual assets are highly volatile and speculative. Your capital is at risk. 
            Coinvestopedia is a financial intelligence and educational platform. We are not a regulated financial advisor, broker, or dealer. 
            The content, simulators, and tools provided are for educational purposes only and do not constitute financial, investment, or legal advice. 
            Past performance is not indicative of future results.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`mb-8 p-5 bg-amber-500/5 border border-amber-500/20 rounded-xl relative overflow-hidden ${className}`}>
      <div className="absolute top-0 right-0 p-6 opacity-5">
        <AlertTriangle size={64} />
      </div>
      <div className="relative z-10 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
          <AlertTriangle size={18} className="text-amber-400" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-amber-400 mb-1.5 uppercase tracking-wider">Educational & Risk Disclosure</h4>
          <p className="text-sm text-text-muted leading-relaxed">
            <strong>Virtual assets are highly volatile and your capital is at risk.</strong> Coinvestopedia provides 
            financial intelligence, educational simulators, and research for informational purposes only. 
            We do not provide regulated investment advice, and no content on this platform should be construed as 
            a recommendation to buy, sell, or hold any specific asset. All analytical tools and simulators are 
            provided for illustrative purposes only. Use of this site constitutes acceptance of our Terms and Risk Disclosures.
          </p>
        </div>
      </div>
    </div>
  );
};
