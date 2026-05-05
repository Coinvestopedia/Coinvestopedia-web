const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
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
  if (!SUPABASE_URL) {
    console.error("DEBUG - VITE_SUPABASE_URL is missing in environment variables.");
    throw new Error('Configuration error: Supabase URL is missing. Please check your .env.local file.');
  }

  const url = `${SUPABASE_URL.replace(/\/$/, '')}/functions/v1/subscribe`;
  console.log("DEBUG - Subscribing to:", url);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(params),
    });

    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      // Try to parse as JSON first, fallback to text
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || `Server error: ${response.status}`);
      } else {
        const errorText = await response.text();
        console.error("DEBUG - Non-JSON error response:", errorText.substring(0, 200));
        throw new Error(`Server error (${response.status}): ${errorText.substring(0, 100)}`);
      }
    }

    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error("DEBUG - Expected JSON but got:", contentType, text.substring(0, 200));
      throw new Error('Received an invalid response from the server. Please try again later.');
    }

    return await response.json();
  } catch (err: any) {
    console.error("DEBUG - Subscription error details:", err);
    throw err;
  }
}

export async function confirmSubscription(token: string): Promise<SubscribeResponse> {
  if (!SUPABASE_URL) {
    console.error("DEBUG - VITE_SUPABASE_URL is missing in environment variables.");
    throw new Error('Configuration error: Supabase URL is missing. This usually means environment variables are not set in the production dashboard.');
  }

  const url = `${SUPABASE_URL.replace(/\/$/, '')}/functions/v1/confirm-subscription`;
  console.log("DEBUG - Confirming subscription at:", url);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ token }),
    });

    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || `Confirmation failed (${response.status})`);
      } else {
        const errorText = await response.text();
        console.error("DEBUG - Confirmation non-JSON error:", errorText.substring(0, 200));
        throw new Error(`Server error (${response.status}): ${errorText.substring(0, 100)}`);
      }
    }

    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error("DEBUG - Confirmation expected JSON but got:", contentType, text.substring(0, 200));
      throw new Error('Verification failed: Server returned an invalid response. Please contact support.');
    }

    return await response.json();
  } catch (err: any) {
    console.error("DEBUG - Confirmation error details:", err);
    throw err;
  }
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
