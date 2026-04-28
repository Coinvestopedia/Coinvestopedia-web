import React, { useEffect } from 'react';
import { PageMeta } from '../components/PageMeta';
import { ShieldAlert, Info, AlertTriangle } from 'lucide-react';

const Disclaimer: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="animate-fade-in pb-20 pt-8">
      <PageMeta 
        title="Disclaimer | Institutional Compliance" 
        description="Legal disclaimer and risk warnings for Coinvestopedia users and institutional partners." 
      />
      
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 text-primary">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-heading">Legal Disclaimer</h1>
            <p className="text-text-muted text-sm uppercase tracking-widest font-bold mt-1">Institutional Compliance Framework</p>
          </div>
        </div>

        <div className="space-y-12 text-text-muted leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-text font-bold uppercase tracking-widest text-xs">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              No Financial Advice
            </div>
            <p className="pl-4 border-l border-primary/20">
              Coinvestopedia is an educational and intelligence portal. All content, including market insights, 
              AI-generated scores, and research reports, is provided for informational purposes only. Nothing 
              on this platform constitutes financial, investment, legal, or tax advice. We do not provide 
              personalized investment recommendations.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-text font-bold uppercase tracking-widest text-xs">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              High-Risk Investment Warning
            </div>
            <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl">
              <div className="flex gap-4">
                <AlertTriangle className="text-red-500 shrink-0" size={24} />
                <p className="text-sm text-text">
                  Digital assets are highly volatile and carry a significant risk of loss. You should never 
                  invest more than you can afford to lose. Past performance is not indicative of future results. 
                  Market conditions can change rapidly, and institutional-grade data does not guarantee 
                  profitability.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-text font-bold uppercase tracking-widest text-xs">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Data Accuracy & AI Insights
            </div>
            <p className="pl-4 border-l border-primary/20">
              The Coinvesto AI Score™ and other algorithmic insights are based on historical data and 
              real-time market signals. While we strive for absolute accuracy, Coinvestopedia does not 
              warrant the completeness or reliability of the data presented. Use of the platform's 
              analytical tools is at the user's sole risk.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-text font-bold uppercase tracking-widest text-xs">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Regulatory Compliance
            </div>
            <p className="pl-4 border-l border-primary/20">
              Coinvestopedia operates in accordance with applicable guidelines. It is the responsibility 
              of the user to ensure that their use of this platform and any digital asset transactions 
              comply with the laws and regulations of their specific jurisdiction (including but not 
              limited to VARA, SEC, and FCA guidelines).
            </p>
          </section>

          <div className="pt-12 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
              <Info size={12} className="text-primary" />
              Last Updated: April 2026
            </div>
            <div className="text-[10px] text-text-muted">
              © 2026 Coinvestopedia Portal
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
