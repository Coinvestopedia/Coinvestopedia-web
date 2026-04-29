import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Removed htmlPage function as it is no longer used.


async function checkRateLimit(supabase: any, identifier: string, action: string) {
  const windowMs = 3600000;
  const maxHits = 10;
  const { data, error } = await supabase.from("rate_limits").select("hits, last_hit").eq("identifier", identifier).eq("action", action).maybeSingle();
  if (error) throw error;
  const now = new Date();
  if (data) {
    const lastHit = new Date(data.last_hit);
    if (now.getTime() - lastHit.getTime() < windowMs) {
      if (data.hits >= maxHits) return false;
      await supabase.from("rate_limits").update({ hits: data.hits + 1, last_hit: now.toISOString() }).eq("identifier", identifier).eq("action", action);
    } else {
      await supabase.from("rate_limits").update({ hits: 1, last_hit: now.toISOString() }).eq("identifier", identifier).eq("action", action);
    }
  } else {
    await supabase.from("rate_limits").insert({ identifier, action, hits: 1, last_hit: now.toISOString() });
  }
  return true;
}

function jsonResponse(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  
  try {
    const { token } = await req.json();
    if (!token) return jsonResponse({ error: "Token is required" }, 400);

    if (!(await checkRateLimit(supabase, ip, "confirm"))) return jsonResponse({ error: "Too many attempts. Please try again in an hour." }, 429);

    const { data: subscriber, error } = await supabase.from("subscribers").select("id, email, confirmed, token_expires_at").eq("confirmation_token", token).maybeSingle();
    if (error || !subscriber) return jsonResponse({ error: "Link has expired or already been activated." }, 404);

    if (subscriber.confirmed) return jsonResponse({ status: "already_active", message: "Enrollment is already verified." });

    if (subscriber.token_expires_at && new Date(subscriber.token_expires_at) < new Date()) return jsonResponse({ error: "Links expire after 24 hours. Please sign up again." }, 410);

    const { error: updateError } = await supabase.from("subscribers").update({ confirmed: true, confirmed_at: new Date().toISOString(), status: "active", confirmation_token: null, token_expires_at: null }).eq("id", subscriber.id);
    if (updateError) throw updateError;

    return jsonResponse({ message: "Verification successful. Your weekly briefing arrives Monday." });
  } catch (err) {
    return jsonResponse({ error: "An internal error occurred. Please try again later." }, 500);
  }
});
