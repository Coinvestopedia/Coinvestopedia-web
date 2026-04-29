# Plan: Fix Crypto Market Timeline Widget on Live Site

## Analysis
The "Crypto Market Timeline" widget, implemented via `TradingViewTimelineNews` in `components/TradingViewWidgets.tsx`, works in local development but fails when deployed to the live environment. The widget relies on external script injection from TradingView (`s3.tradingview.com`).

### Initial Hypotheses
1. **Script Blocking (CSP/Security):** The live environment (Vercel/Cloudflare) or browser extensions might be blocking the external TradingView script.
2. **Referrer/Domain Restrictions:** TradingView might restrict widget embedding for certain domains if not configured correctly.
3. **Hydration/Mounting Race Condition:** In production builds, the script might be attempting to initialize before the DOM element is fully ready or stable, especially during theme detection.
4. **Theme Detection Mismatch:** Differences in how the `dark` class is applied to `document.documentElement` between local and production might cause unexpected re-renders or initialization failures.

---

## Phase 1: Information Gathering & Discovery
- [ ] Ask user for specific console error messages from the live site.
- [ ] Verify environment variables in the production environment.
- [ ] Inspect the network tab in the live environment to see if `embed-widget-timeline.js` is successfully fetched (200 OK) or blocked (CORS/403/Blocked).

## Phase 2: Hypothesis Testing
- [ ] **Test 1 (CSP):** Check if adding a meta tag or updating `vercel.json` to explicitly allow TradingView scripts fixes it.
- [ ] **Test 2 (Loading Logic):** Modify the script injection logic to be more resilient (e.g., using a unique ID for the container, ensuring the script is only loaded once).
- [ ] **Test 3 (Theme Detection):** Ensure `isDarkMode` detection doesn't cause a double-initialization that breaks the widget.

## Phase 3: Implementation (Pending Approval)
- [ ] Refactor `TradingViewTimelineNews` to use a more robust loading pattern.
- [ ] Verify fix in a staging/preview environment if possible.
- [ ] Final audit of all TradingView widgets across the site.

## Phase 4: Verification
- [ ] Run `security_scan.py` to ensure no security regressions.
- [ ] Run `lint_runner.py` to ensure code quality.
- [ ] Ask user to verify on the live site after deployment.
