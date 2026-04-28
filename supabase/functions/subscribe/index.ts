import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

async function checkRateLimit(supabase: any, identifier: string, action: string) {
  const windowMs = 3600000;
  const maxHits = 5;
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

async function sendConfirmationEmail(resendApiKey: string, email: string, token: string, supabaseUrl: string) {
  const confirmUrl = `${supabaseUrl}/functions/v1/confirm-subscription?token=${token}`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendApiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "The Briefing <newsletter@coinvestopedia.com>",
      to: email,
      subject: "Confirm your subscription to The Briefing",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #050505; color: #ffffff; }
            .container { max-width: 600px; margin: 0 auto; padding: 60px 40px; background-color: #0a0a0a; border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.05); }
            .logo { display: block; margin: 0 auto 40px; height: 80px; width: auto; }
            .label { color: #D4AF37; font-size: 11px; font-weight: 800; letter-spacing: 0.25em; text-transform: uppercase; text-align: center; margin-bottom: 16px; }
            h1 { font-size: 28px; font-weight: 700; text-align: center; margin: 0 0 24px; letter-spacing: -0.02em; color: #ffffff; }
            p { font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 40px; color: #999999; }
            .btn-wrapper { text-align: center; }
            .btn { background-color: #D4AF37; color: #000000; padding: 18px 40px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 15px; display: inline-block; transition: all 0.2s ease; }
            .footer { font-size: 12px; color: #444444; text-align: center; margin-top: 60px; letter-spacing: 0.1em; font-weight: 600; text-transform: uppercase; }
          </style>
        </head>
        <body>
          <div style="padding: 40px 20px;">
            <div class="container">
              <img src="https://coinvestopedia.com/logo-transparent-dark-desktop.png" alt="Coinvestopedia" class="logo">
              <div class="label">The Briefing</div>
              <h1>Verify your access</h1>
              <p>Thank you for requesting enrollment in our weekly research digest. Please confirm your email address to activate your access.</p>
              <div class="btn-wrapper">
                <a href="${confirmUrl}" class="btn">Confirm Subscription</a>
              </div>
              <div class="footer">Coinvestopedia Intelligence</div>
            </div>
            <p style="text-align: center; font-size: 12px; color: #333333; margin-top: 24px;">If you didn't request this, you can safely ignore this email.</p>
          </div>
        </body>
        </html>
      `,
    }),
  });
  if (!res.ok) throw new Error(await res.text());
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { email, utm_source, utm_medium, utm_campaign } = await req.json();
    if (!email) return jsonResponse({ error: "Email is required" }, 400);
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (!(await checkRateLimit(supabase, ip, "subscribe"))) return jsonResponse({ error: "Too many attempts. Please try again later." }, 429);
    const { data: existing } = await supabase.from("subscribers").select("status").eq("email", email.toLowerCase()).maybeSingle();
    if (existing?.status === "active") return jsonResponse({ status: "already_active", message: "You are already subscribed." });
    const token = crypto.randomUUID();
    const { error: insertError } = await supabase.from("subscribers").upsert({ 
      email: email.toLowerCase(), 
      confirmation_token: token, 
      status: "pending", 
      confirmed: false,
      utm_source,
      utm_medium,
      utm_campaign,
      token_expires_at: new Date(Date.now() + 86400000).toISOString()
    }, { onConflict: "email" });
    if (insertError) throw insertError;
    await sendConfirmationEmail(Deno.env.get("RESEND_API_KEY")!, email, token, Deno.env.get("SUPABASE_URL")!);
    return jsonResponse({ message: "Check your email to confirm your subscription." });
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
});
