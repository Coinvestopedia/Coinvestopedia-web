// Vercel serverless function — forwards subscribe requests to Supabase Edge Function
// This is a fallback proxy. The frontend now calls Supabase directly for better rate limiting.
type VercelRequest = any;
type VercelResponse = any;

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://ahuhejfqbefhkarwohta.supabase.co';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, utm_source, utm_medium, utm_campaign } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email, 
        source: 'website-proxy',
        utm_source,
        utm_medium,
        utm_campaign
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Subscribe proxy error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
