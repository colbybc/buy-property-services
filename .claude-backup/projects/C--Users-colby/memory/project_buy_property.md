---
name: Buy Property Services Shopify Theme
description: Full Shopify Dawn-forked theme for UK property services marketplace - 8 services, custom landing page, green/orange brand, GitHub-connected
type: project
---

Building a Shopify Online Store 2.0 theme forked from Dawn for "Buy Property Services" - a UK property services marketplace.

**GitHub:** https://github.com/colbybc/buy-property-services
**Preview:** https://ctr1i6htiw0zqw33-92370174337.shopifypreview.com
**Shopify domain:** pa62gj-ui.myshopify.com
**Git config:** user "colbybc", email "colbylee04@icloud.com" (repo-level)

**Services (8):** Auction Legal Pack (£299), RICS Level 2 Survey (£399), Outlays (£150), Professional Photography (£149), Property Title (£30), Rent Increase Service (£49), Tenancy Agreement (£79), Boosting Listing (£99)

**Color palette:**
- --bp-green: #1A4D2E (primary dark green)
- --bp-green-dark: #0D2617 (announcement bar)
- --bp-orange: #E8922A (CTAs, accents)
- --bp-cream: #F5F0E1 (backgrounds)
- Font: Poppins (400/500/600/700)

**Landing page sections (in order):**
1. Hero banner — split layout (text left, image right), cross grid pattern on green bg, large heading with orange emphasis, trust stats row, RICS badge on image
2. Service grid — 4-column cards with inline SVG icons, price, View button
3. Process timeline — horizontal "How It Works" 4-step with numbered circles
4. Why Choose Us — features list left + stats panel right (green cross-pattern bg)
5. Testimonials — 3 review cards with star ratings and avatars
6. CTA Band — green gradient call to action

**Key technical decisions:**
- settings_data.json uses "current": {} (object) NOT "current": "Default" (string) — the string version resets Shopify admin settings on every push
- Custom CSS classes prefixed with bp- to avoid Dawn conflicts (e.g. .bp-section-header not .section-header)
- Sections use .page-width (Dawn's class) not .container
- Logo uses filter: brightness(0) invert(1) to show white on dark header
- Header selectors scoped to .shopify-section-group-header-group to not break content sections
- Announcement bar styled to blend seamlessly with header (dark green, no borders)

**Products imported via CSV** with Template Suffix: service, no shipping required, variant inventory policy: continue

**Current focus:** Landing page polish. Product pages deferred to later.

**How to apply:** User has given freedom to diverge from Dawn patterns. Keep code clean. The reference design to match is the "other theme" that uses split hero, inline SVG icons, and clean card layouts.
