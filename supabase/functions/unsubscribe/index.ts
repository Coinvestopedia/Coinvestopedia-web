import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function htmlPage(title: string, message: string, success: boolean) {
  const accent = success ? "#D4AF37" : "#ef4444";
  const icon = success 
    ? `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
    : `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title} | Coinvestopedia Intelligence</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #050505;
            --card-bg: rgba(20, 20, 20, 0.8);
            --accent: ${accent};
            --text-primary: #FFFFFF;
            --text-secondary: #999999;
            --border: rgba(255, 255, 255, 0.1);
        }
        * { box-sizing: border-box; }
        body {
            margin: 0;
            padding: 24px;
            background-color: var(--bg);
            background-image: radial-gradient(circle at 50% -20%, #222 0%, #050505 80%);
            color: var(--text-primary);
            font-family: 'Inter', -apple-system, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            -webkit-font-smoothing: antialiased;
        }
        .container {
            max-width: 440px;
            width: 100%;
            background: var(--card-bg);
            backdrop-filter: blur(24px);
            border: 1px solid var(--border);
            border-radius: 28px;
            padding: 56px 40px;
            text-align: center;
            box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.8);
        }
        .icon-wrapper {
            width: 88px; height: 88px;
            background: rgba(212, 175, 55, 0.05);
            border: 1px solid rgba(212, 175, 55, 0.15);
            border-radius: 24px;
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto 36px; color: var(--accent);
        }
        h1 { font-size: 30px; font-weight: 700; margin: 0 0 16px; letter-spacing: -0.03em; line-height: 1.2; }
        p { font-size: 16px; line-height: 1.7; color: var(--text-secondary); margin: 0 0 44px; }
        .btn {
            display: inline-flex; align-items: center; justify-content: center;
            background: var(--accent); color: #000; text-decoration: none;
            font-weight: 700; font-size: 15px; padding: 16px 32px;
            border-radius: 14px; transition: all 0.3s ease; width: 100%;
        }
        .btn:hover { transform: translateY(-2px); filter: brightness(1.1); }
        .footer { margin-top: 48px; font-size: 12px; color: #555; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600; }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon-wrapper">${icon}</div>
        <h1>${title}</h1>
        <p>${message}</p>
        <a href="https://coinvestopedia.com" class="btn">Return to Terminal</a>
        <div class="footer">COINVESTOPEDIA INTELLIGENCE</div>
    </div>
</body>
</html>`;
}

function createHtmlResponse(html: string, status = 200) {
  return new Response(html.trim(), {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    if (!email) return createHtmlResponse(htmlPage("Request Failed", "Email parameter is missing.", false), 400);

    const { error } = await supabase.from("subscribers").update({ status: "unsubscribed", confirmed: false }).eq("email", email);
    if (error) throw error;

    return createHtmlResponse(htmlPage("Unsubscribed", "You have been removed from our active research digest list.", true), 200);
  } catch (err) {
    return createHtmlResponse(htmlPage("System Error", "An internal error occurred.", false), 500);
  }
});
