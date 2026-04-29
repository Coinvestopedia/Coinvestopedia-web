# Mobile Design & Responsiveness Audit Plan - Coinvestopedia

## 1. Executive Summary
This plan outlines a comprehensive audit and enhancement strategy for the Coinvestopedia mobile experience. The goal is to elevate the portal from a "responsive web" look to an "institutional-grade mobile application" feel, focusing on navigation fluidity, data visibility, and ergonomic touch interactions.

## 2. Audit Scope
- **Navigation:** Header, Bottom Nav, and Sidebars.
- **Core Pages:** Home, Whale Tracker, Asset Comparison, Macro Intel, Glossary, and Exchanges.
- **Components:** Data Tables, Charts, Modals, and Forms.
- **User Journey:** Global navigation flow and accessibility.

## 3. Key Observations (Pre-Audit)
- **Navigation Disconnect:** The bottom "Menu" button triggers a top-down overlay, which can feel disjointed on large mobile screens.
- **Vertical Real Estate:** The mobile header (80px) and bottom nav (68px) consume significant vertical space (~150px combined).
- **Data Density:** Large tables (Exchanges, Glossary) likely require better mobile views (scroll indicators or card transformations).
- **Breakpoint Transitions:** The transition from 5-column desktop to single-column mobile needs verification for tablet/mid-size viewports.

## 4. Proposed Enhancements

### Phase 1: Navigation & Structure
- [ ] **Unified Mobile Tab Bar:** Expand the bottom navigation to include 3-4 high-frequency actions (e.g., Home, Whale Tracker, Tools, Menu).
- [ ] **Ergonomic Menu:** Replace the top-down overlay with a **Bottom Sheet** or a side-drawer that originates closer to the thumb zone.
- [ ] **Header Slimming:** Reduce mobile header height to `h-16` (64px) to reclaim screen space.

### Phase 2: Page-Specific Optimizations
- [ ] **Glossary & Search:** Implement a sticky "Search & Filter" bar for mobile that stays visible while scrolling long lists.
- [ ] **Table Responsiveness:** Ensure all tables use `overflow-x-auto` with visual "scroll shadows" or transform into vertical cards on `sm` screens.
- [ ] **Dashboard Refinement:** Stack `MarketPulseDashboard` metrics logically for single-column viewing without losing data hierarchy.

### Phase 3: UX & Visibility
- [ ] **Touch Target Audit:** Verify all interactive elements (buttons, links, chips) meet the 44x44px minimum.
- [ ] **Mobile Breadcrumbs:** Implement horizontal-scroll breadcrumbs for deep sub-pages (Learn/Research).
- [ ] **Visibility Sweep:** Adjust font-sizes for mobile readability (Body: 16px, H1: 24-28px).

## 5. Verification & Testing
- [ ] Audit against **WCAG AA** mobile standards.
- [ ] Performance check for image LCP on 3G/4G simulations.
- [ ] Verification across 375px (iPhone), 414px (Plus/Pro Max), and 768px (iPad) viewports.

## 6. Deliverables
- Detailed Audit Report (markdown).
- Enhanced `Header.tsx` and `App.tsx`.
- Responsive overrides for core pages.
- Mobile-first CSS utility updates in `index.css`.
