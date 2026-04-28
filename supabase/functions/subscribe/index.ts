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
      html: \`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #000000; color: #ffffff; -webkit-font-smoothing: antialiased; }
            .container { max-width: 600px; margin: 0 auto; background-color: #0a0a0a; border-radius: 16px; border: 1px solid #1a1a1a; overflow: hidden; }
            .content { padding: 48px 40px; }
            .logo-wrapper { text-align: center; margin-bottom: 40px; }
            .logo { display: inline-block; max-width: 220px; height: auto; outline: none; border: none; text-decoration: none; }
            .label { color: #10B981; font-size: 12px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; text-align: center; margin-bottom: 16px; }
            h1 { font-size: 24px; font-weight: 600; text-align: center; margin: 0 0 16px; letter-spacing: -0.02em; color: #ffffff; }
            p { font-size: 16px; line-height: 1.6; text-align: center; margin: 0 0 40px; color: #a1a1aa; }
            .btn-wrapper { text-align: center; }
            .btn { background-color: #10B981; color: #022C22 !important; padding: 16px 36px; text-decoration: none !important; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block; transition: background-color 0.2s ease; }
            .btn:hover { background-color: #059669; }
            .divider { height: 1px; background-color: #1a1a1a; margin: 40px 0; }
            .footer { font-size: 12px; color: #52525b; text-align: center; }
            .footer p { margin: 0 0 8px; font-size: 12px; color: #52525b; text-align: center; }
          </style>
        </head>
        <body style="background-color: #000000; margin: 0; padding: 40px 20px;">
          <!-- Fallback styles added directly to HTML elements for maximum email client compatibility -->
          <div style="max-width: 600px; margin: 0 auto; background-color: #0a0a0a; border-radius: 16px; border: 1px solid #1a1a1a; overflow: hidden;">
            <div style="padding: 48px 40px;">
              
              <!-- Logo -->
              <div style="text-align: center; margin-bottom: 40px;">
                <img src="https://coinvestopedia.com/logo-dark-new.png" alt="Coinvestopedia" style="display: inline-block; max-width: 220px; height: auto; outline: none; border: none; text-decoration: none;">
              </div>
              
              <!-- Content -->
              <div style="text-align: center; margin-bottom: 16px;">
                <span style="color: #10B981; font-size: 12px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;">The Briefing</span>
              </div>
              <h1 style="font-size: 24px; font-weight: 600; text-align: center; margin: 0 0 16px; color: #ffffff; letter-spacing: -0.02em;">Verify your access</h1>
              <p style="font-size: 16px; line-height: 1.6; text-align: center; margin: 0 0 40px; color: #a1a1aa;">Thank you for requesting enrollment in our weekly research digest. Please confirm your email address to activate your access.</p>
              
              <!-- CTA - Colors hardcoded to ensure it never renders blue -->
              <div style="text-align: center;">
                <a href="\${confirmUrl}" style="background-color: #10B981; color: #022C22; padding: 16px 36px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block;">Confirm Subscription</a>
              </div>
              
              <!-- Divider -->
              <div style="height: 1px; background-color: #1a1a1a; margin: 40px 0;"></div>
              
              <!-- Footer -->
              <div style="font-size: 12px; color: #52525b; text-align: center;">
                <p style="margin: 0 0 8px; font-size: 12px; color: #52525b; text-align: center;">Coinvestopedia Intelligence</p>
                <p style="margin: 0; font-size: 12px; color: #52525b; text-align: center;">If you didn't request this, you can safely ignore this email.</p>
              </div>
              
            </div>
          </div>
        </body>
        </html>
      \`,
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
