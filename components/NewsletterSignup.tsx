
import React, { useState, useCallback } from 'react';
import { Mail, Sparkles, Check, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { useAppContext } from '../context/AppContext';
import { subscribeToBriefing, getUtmParams } from '../services/briefing';
import { trackEvent } from '../utils/analytics';

interface NewsletterSignupProps {
  className?: string;
  variant?: 'default' | 'compact';
  onSubscribe?: (email: string) => Promise<void>;
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ 
  className = '',
  variant = 'default',
  onSubscribe
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const { addToast } = useAppContext();

  const validateEmail = useCallback((email: string): string | null => {
    if (!email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address';
    if (email.length > 254) return 'Email is too long';
    return null;
  }, []);

  const handleBlur = useCallback(() => {
    setTouched(true);
    setError(validateEmail(email));
  }, [email, validateEmail]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (touched) {
      setError(validateEmail(newEmail));
    }
  }, [touched, validateEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    
    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      if (onSubscribe) {
        await onSubscribe(email);
      } else {
        const utm = getUtmParams();
        const result = await subscribeToBriefing({ email, source: 'website', ...utm });
        
        if (result.status === 'already_active') {
          addToast('You\'re already subscribed to The Briefing.', 'info', 4000);
          setIsSubmitting(false);
          return;
        }
      }
      
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Track signup event
      trackEvent('signup_completed', {
        method: 'email',
        source: 'briefing_signup',
        location: variant === 'compact' ? 'footer/sidebar' : 'hero_section'
      });

      addToast('Check your email to confirm your subscription.', 'success', 4000);
      setEmail('');
      setTouched(false);
      
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || 'Subscription failed. Please try again.');
      addToast(err.message || 'Subscription failed. Please try again later.', 'error', 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (variant === 'compact') {
    return (
      <div className={`leather-card rounded-xl p-6 w-full max-w-lg mx-auto ${className}`}>
        <div className="flex flex-col items-start gap-6 w-full">
          {/* Top: Icon + Text */}
          <div className="flex items-center gap-4 w-full">
            <div className="p-3 bg-primary/10 rounded-lg relative z-10 flex-shrink-0">
              <Mail size={24} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <h4 className="font-bold text-base text-white truncate">The Briefing</h4>
              <p className="text-text-muted text-sm truncate">Weekly digest. No spam. No ads.</p>
            </div>
          </div>

          {/* Bottom: Form */}
          <form onSubmit={handleSubmit} className="flex flex-row items-stretch gap-3 w-full relative z-10">
            <div className="flex-1">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full h-12 bg-background border rounded-lg px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors transition-shadow ${
                    error && touched ? 'border-red-500' : 'border-border'
                  }`}
                  aria-label="Email address for The Briefing"
                  required
                />
            </div>
            <Button 
              type="submit" 
              size="md"
              disabled={isSubmitting || isSuccess}
              className="h-12 whitespace-nowrap flex-shrink-0 px-6"
              aria-label={isSuccess ? 'Successfully subscribed' : 'Subscribe to The Briefing'}
            >
              {isSuccess ? <Check size={20} /> : isSubmitting ? '...' : 'Subscribe'}
            </Button>
          </form>
        </div>
        {/* Error message */}
        {error && touched && (
            <div className="text-left w-full text-red-500 text-xs flex items-center justify-start gap-1 mt-2">
                <AlertCircle size={12} />
                {error}
            </div>
        )}
      </div>
    );
  }

  return (
    <section className={`relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface to-background ${className}`}>
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>
      
      <div className="relative z-10 p-8 lg:p-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-semibold mb-6">
            <Sparkles size={16} />
            <span>Weekly Research Digest</span>
          </div>
          
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">
            The Briefing
          </h2>
          
          <p className="text-text-muted text-lg mb-8 max-w-xl mx-auto">
            Curated macro, digital asset, and cross-market context — delivered every Monday for finance professionals.
          </p>
          
          {isSuccess ? (
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-6 max-w-md mx-auto" role="status" aria-live="polite">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Check size={24} className="text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">You're in.</h3>
              <p className="text-text-muted">
                Check your inbox for the confirmation email. Your first issue arrives next Monday.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto" aria-label="Subscribe to The Briefing">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full bg-background border rounded-xl px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                        error && touched ? 'border-red-500' : 'border-border'
                      }`}
                      aria-label="Email address"
                      aria-invalid={error && touched ? 'true' : 'false'}
                      aria-describedby={error && touched ? 'email-error' : undefined}
                      required
                    />
                    {error && touched && (
                      <div id="email-error" className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {error}
                      </div>
                    )}
                  </div>
                </div>
                <Button 
                  type="submit" 
                  size="lg"
                  disabled={isSubmitting || isSuccess || (touched && !!error)}
                  className="whitespace-nowrap min-w-[140px]"
                  aria-label={isSuccess ? 'Successfully subscribed' : 'Subscribe to The Briefing'}
                >
                  {isSuccess ? <Check size={20} aria-hidden="true" /> : isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </div>
              {(!error || !touched) && (
                <p className="text-text-muted text-sm mt-3">
                  One email per week. No ads. Unsubscribe anytime.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
