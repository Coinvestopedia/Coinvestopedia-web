import { useEffect, useState } from 'react';
import { PageMeta } from '../components/PageMeta';
import { Card } from '../components/Card';
import { CheckCircle2, XCircle, Loader2, Mail, ArrowRight } from 'lucide-react';
import { PageRoute } from '../types';
import { confirmSubscription } from '../services/briefing';

interface ConfirmSubscriptionProps {
  onNavigate?: (route: PageRoute) => void;
}

export const ConfirmSubscription: React.FC<ConfirmSubscriptionProps> = ({ onNavigate }) => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing confirmation token.');
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await confirmSubscription(token);
        setStatus('success');
        setMessage(response.message);
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message || 'Failed to confirm subscription.');
      }
    };

    verifyToken();
  }, []);

  return (
    <div className="animate-fade-in py-12 flex flex-col items-center justify-center min-h-[60vh]">
      <PageMeta
        title="Confirm Subscription | Coinvestopedia"
        description="Confirm your subscription to The Briefing newsletter."
        canonical="/confirm-subscription"
      />

      <Card className="max-w-md w-full p-8 lg:p-12 text-center relative overflow-hidden border border-primary/10 shadow-[0_0_50px_-12px_rgba(var(--primary-rgb),0.12)]">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 blur-3xl rounded-full -translate-y-32"></div>

        <div className="relative z-10">
          {status === 'loading' && (
            <div className="flex flex-col items-center py-8">
              <div className="relative mb-8">
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
              </div>
              <h1 className="text-2xl font-bold mb-3 tracking-tight">Verifying your subscription...</h1>
              <p className="text-text-muted leading-relaxed">Please wait while we validate your secure institutional token.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center py-8">
              <div className="relative mb-10">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_30px_rgba(2,44,34,0.3)]">
                  <CheckCircle2 size={40} strokeWidth={2.5} />
                </div>
                <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full scale-150 -z-10 animate-pulse"></div>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-4 tracking-tight">Subscription Confirmed!</h1>
              <p className="text-text-muted mb-10 text-lg leading-relaxed">
                {message || "You're now subscribed to The Briefing. Welcome to the institutional research community."}
              </p>
              
              <button 
                onClick={() => onNavigate?.(PageRoute.HOME)}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-background font-black rounded-xl hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20 uppercase tracking-wider text-sm"
              >
                <span>Access Terminal</span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center py-8">
              <div className="relative mb-10">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                  <XCircle size={40} strokeWidth={2.5} />
                </div>
                <div className="absolute inset-0 bg-red-500/5 blur-2xl rounded-full scale-150 -z-10"></div>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-4 tracking-tight">Verification Failed</h1>
              <p className="text-text-muted mb-10 text-lg leading-relaxed">
                {message || "We couldn't confirm your subscription. The link might be expired or invalid."}
              </p>
              
              <div className="space-y-4 w-full">
                <button 
                  onClick={() => onNavigate?.(PageRoute.NEWSLETTER)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-surface border border-border text-text font-bold rounded-xl hover:bg-surface/80 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm uppercase tracking-wider"
                >
                  <Mail size={18} />
                  <span>Request New Link</span>
                </button>
                
                <button 
                  onClick={() => onNavigate?.(PageRoute.HOME)}
                  className="w-full min-h-[44px] text-text-muted hover:text-text text-xs font-bold transition-colors uppercase tracking-widest"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>
      
      {/* Decorative text */}
      <div className="mt-16 text-center opacity-20 select-none pointer-events-none">
        <div className="text-[10px] uppercase tracking-[0.5em] font-black">Institutional Research Terminal</div>
      </div>
    </div>
  );
};
