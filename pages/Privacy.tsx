import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';
import { PageMeta } from '../components/PageMeta';


import { PageRoute } from '../types';

export interface PrivacyProps {
  onNavigate?: (route: PageRoute) => void;
}

export const Privacy: React.FC<PrivacyProps> = ({ onNavigate }) => {
  return (
    <div className="animate-fade-in max-w-[800px] mx-auto pb-16">
      <PageMeta
        title="Privacy Policy"
        description="Learn how Coinvestopedia collects, uses, and protects your personal information. Read our full privacy policy."
        canonical="/privacy"
        keywords="coinvestopedia privacy policy, data protection, personal information"
      />

      <div className="mb-12 mt-6">
        <div className="flex items-center gap-3 text-primary mb-4">
          <Shield size={32} />
          <h1 className="text-4xl lg:text-5xl font-heading font-bold text-text">Privacy Policy</h1>
        </div>
        <p className="text-text-muted text-lg">Last updated: March 27, 2025</p>
      </div>

      <div className="prose prose-invert max-w-none space-y-8 text-text-muted leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-text mb-4 flex items-center gap-2">
            <Eye className="text-primary" size={24} /> 1. Information We Collect
          </h2>
          <p>
            At Coinvestopedia, we collect information to providing better services to all our users. The types of personal information we collect include:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li><strong>Personal Identifiers:</strong> Name, email address, and account preferences when you register for an account or subscribe to our weekly digest (The Briefing).</li>
            <li><strong>Usage Data:</strong> Information about how you use our website, such as pages visited, time spent, and links clicked.</li>
            <li><strong>Technical Data:</strong> IP address, browser type, device information, and operating system.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-text mb-4 flex items-center gap-2">
            <Lock className="text-primary" size={24} /> 2. How We Use Information
          </h2>
          <p>
            We use the information we collect for various purposes, including:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Providing, maintaining, and improving our services.</li>
            <li>Processing your transactions and managing your account.</li>
            <li>Sending you technical notices, updates, and security alerts.</li>
            <li>Responding to your comments, questions, and customer service requests.</li>
            <li>Personalizing your experience and providing content that matches your interests.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-text mb-4 flex items-center gap-2">
            <Eye className="text-primary" size={24} /> 3. Cookies and Analytics
          </h2>
          <p>
            We use cookies and similar tracking technologies (such as Google Tag Manager and Google Analytics 4) to analyze our traffic and improve user experience. 
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li><strong>Industry Classification:</strong> We classify our business under the 'Finance' category in analytics platforms to receive relevant industry benchmarks. We do not use this data for sensitive interest-based targeting or predatory marketing.</li>
            <li><strong>Anonymous Data:</strong> Most of the data we collect via analytics is aggregated and anonymous. We use it to understand which research topics and tools (like our Whale Tracker or ROI Simulators) are most valuable to our users.</li>
            <li><strong>Opt-Out:</strong> You can manage your cookie preferences through our Cookie Policy page or by using browser extensions that block analytics scripts.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-text mb-4 flex items-center gap-2">
            <Shield className="text-primary" size={24} /> 4. Data Security
          </h2>
          <p>
            We implement a variety of security measures to maintain the safety of your personal information. We use state-of-the-art encryption to protect sensitive data transmitted online. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-text mb-4 flex items-center gap-2">
            <FileText className="text-primary" size={24} /> 5. Your Rights
          </h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal information, including the right to access, correct, or delete the data we have collected about you. To exercise these rights, please contact us at privacy@coinvestopedia.com.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
