# Cloudflare Deployment & SEO/GEO Optimization Plan

## Phase 1: Analysis & Current State
The project is a Vite-based React Single Page Application (SPA).
- **Pros:** Fast client-side transitions, `robots.txt` is properly configured for AI crawlers, basic generic meta tags are present.
- **Cons:** SPAs without pre-rendering or Server-Side Rendering (SSR) serve an empty `div` with JavaScript. Many AI bots (LLMs) and search engine crawlers either do not wait for JavaScript to render or struggle with dynamic content.
- **Cloudflare Impact:** Cloudflare's WAF (Web Application Firewall) and Bot Fight Mode can inadvertently block LLM crawlers (like GPTBot, Claude-Web) before they even reach the site.

## Phase 2: Implementation Strategy

### Group A: Frontend & SEO Specialist (Content & Metadata)
**Goal:** Ensure every route serves pre-rendered content and correct meta tags.
- **Task 1 (Prerendering/SSG):** Implement a static site generation (SSG) plugin for Vite (e.g., `vite-plugin-prerender`) to output static HTML files for key routes (`/exchanges`, `/whale-tracker`, `/macro-intel`, etc.). This ensures LLMs see the HTML text immediately without JS.
- **Task 2 (Cloudflare HTMLRewriter):** Create a Cloudflare Pages Function (`functions/[[path]].ts`) that intercepts requests and uses `HTMLRewriter` to inject route-specific `<title>`, `<meta>`, and JSON-LD schema into the `<head>` of `index.html`.
- **Task 3:** Ensure `sitemap.xml` and `robots.txt` are perfectly aligned with these pre-rendered routes.

### Group B: DevOps & Security Engineer (Cloudflare Configuration)
**Goal:** Configure Cloudflare dashboard settings to welcome AI bots while securing against malicious bots, and optimize caching.
1. **WAF Rules:** Create a WAF Custom Rule to **Skip** "Bot Fight Mode" or "Super Bot Fight Mode" for User-Agents matching approved AI crawlers (`GPTBot`, `Claude-Web`, `PerplexityBot`, `OAI-SearchBot`). Otherwise, Cloudflare will block them with a JS challenge.
2. **Cache Rules:**
   - Configure Cache Rules to bypass cache for `/api/*` and `/functions/*`.
   - Aggressively cache `/assets/*` and pre-rendered HTML.
   - Enable "Early Hints".
3. **Security Level:** Ensure Security Level is set to Medium. Avoid "I'm Under Attack" mode.

### Group C: Test Engineer
**Goal:** Validate visibility.
- Verify `curl` requests with specific User-Agents (e.g., `PerplexityBot`) receive fully hydrated HTML or complete metadata, and are not blocked by a 403 Forbidden JS Challenge.
- Ensure Core Web Vitals (LCP, INP, CLS) meet human performance thresholds.
