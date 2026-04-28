const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ahuhejfqbefhkarwohta.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

interface SubscribeParams {
  email: string;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

interface SubscribeResponse {
  message: string;
  status?: 'confirmation_sent' | 'already_active';
  error?: string;
}

export async function subscribeToBriefing(params: SubscribeParams): Promise<SubscribeResponse> {
  console.log("DEBUG - Loaded ANON KEY:", SUPABASE_ANON_KEY ? "KEY IS PRESENT" : "KEY IS MISSING (Empty/Undefined)");
  
  const response = await fetch(`${SUPABASE_URL}/functions/v1/subscribe`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    },
    body: JSON.stringify(params),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Subscription failed');
  }

  return data;
}

export function getUtmParams(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign']) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }
  return utm;
}
