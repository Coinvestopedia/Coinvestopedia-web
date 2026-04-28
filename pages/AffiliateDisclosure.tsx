import React, { useEffect } from 'react';
import { PageMeta } from '../components/PageMeta';
import { DollarSign, Handshake, ShieldCheck } from 'lucide-react';

const AffiliateDisclosure: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="animate-fade-in pb-20 pt-8">
      <PageMeta 
        title="Affiliate Disclosure | Institutional Integrity" 
        description="Disclosure regarding affiliate relationships and compensation models at Coinvestopedia." 
      />
      
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 text-primary">
            <Handshake size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-heading">Affiliate Disclosure</h1>
            <p className="text-text-muted text-sm uppercase tracking-widest font-bold mt-1">Transparency & Integrity Protocol</p>
          </div>
        </div>

        <div className="space-y-12 text-text-muted leading-relaxed">
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-text font-bold uppercase tracking-widest text-xs">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Our Commitment to Transparency
            </div>
            <p className="pl-4 border-l border-primary/20">
              In compliance with FTC guidelines and international advertising standards, Coinvestopedia 
              maintains full transparency regarding our business model. To keep our institutional-grade 
              intelligence and research accessible, we participate in various affiliate marketing programs.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-text font-bold uppercase tracking-widest text-xs">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              How Affiliate Links Work
            </div>
            <p className="pl-4 border-l border-primary/20">
              Certain links on this platform, particularly those within our Exchange Intelligence profiles 
              or Tool recommendations, are affiliate links. If you click on one of these links and create 
              an account or perform a transaction, Coinvestopedia may receive a commission at no 
              additional cost to you.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-text font-bold uppercase tracking-widest text-xs">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Independence of AI Scores
            </div>
            <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl border-dashed">
              <div className="flex gap-4">
                <ShieldCheck className="text-primary shrink-0" size={24} />
                <p className="text-sm text-text italic">
                  Crucially, our Coinvesto AI Score™ and editorial ratings are determined by objective 
                  data points and proprietary algorithms. Affiliate relationships NEVER influence 
                  the scores or rankings of assets and exchanges on our platform.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-text font-bold uppercase tracking-widest text-xs">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Institutional Quality Standards
            </div>
            <p className="pl-4 border-l border-primary/20">
              We only partner with established, reputable exchanges and service providers that meet our 
              internal security and compliance benchmarks. Our goal is to provide value-add connections 
              that enhance your digital asset operations.
            </p>
          </section>

          <div className="pt-12 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
              <DollarSign size={12} className="text-primary" />
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

export default AffiliateDisclosure;
