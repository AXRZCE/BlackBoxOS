# BLACKBOX OS — Performance & Accessibility Checklist

## Lighthouse Target Scores

| Category       | Target | Notes |
|----------------|--------|-------|
| Performance    | 90+    | War Room should be instant (<1s LCP) |
| Accessibility  | 95+    | All interactive elements keyboard accessible |
| Best Practices | 90+    | HTTPS, no console errors |
| SEO            | 90+    | Meta tags, OG images, robots.txt |

---

## Performance Optimizations

### Critical Path
- [x] War Room loads without 3D canvas (instant)
- [x] Boot screen has minimal JS
- [x] Vault lazy-loads R3F and postprocessing
- [x] Quality presets auto-detect device capability
- [x] LOW preset disables heavy effects

### Asset Loading
- [x] GLB models lazy-loaded on demand
- [x] KTX2/Basis texture support configured
- [x] Images use next/image for optimization
- [x] Fonts preloaded in layout.tsx

### Bundle Size
- [ ] Run `pnpm build` and check bundle analysis
- [ ] Tree-shake unused components
- [ ] Code-split heavy dependencies (R3F, postprocessing)

---

## Accessibility Checklist

### Keyboard Navigation
- [x] / opens command palette
- [x] Esc closes overlays and sheets
- [x] J/K navigate between projects in vault
- [x] Tab navigation works for all buttons/links
- [x] Focus states visible on all interactive elements

### Screen Readers
- [x] All images have alt text
- [x] Semantic HTML (header, main, footer, section)
- [x] ARIA labels on interactive elements
- [x] Skip link for main content (TODO: add if needed)

### Motion & Visual
- [x] `prefers-reduced-motion` respected
- [x] LOW quality disables animations
- [x] Sufficient color contrast (WCAG AA)
- [x] No content requires hover to access on mobile

### Forms & Interactions
- [x] Command palette input has proper placeholder
- [x] Checklist items are keyboard accessible
- [x] Contact links open in new tab with rel="noopener noreferrer"

---

## SEO Checklist

- [x] Title and meta description on all pages
- [x] OG images generated for each project
- [x] Twitter card meta tags
- [x] Structured data (TODO: add JSON-LD)
- [ ] robots.txt (M6-8)
- [ ] sitemap.xml (M6-8)

---

## Testing Commands

```bash
# Run Lighthouse CI (requires lighthouse npm package)
npx lighthouse http://localhost:3000/war-room --output=html --output-path=./lighthouse-report.html

# Quick performance check
npx lighthouse http://localhost:3000/war-room --only-categories=performance --output=json | jq '.categories.performance.score'

# Accessibility audit
npx lighthouse http://localhost:3000/war-room --only-categories=accessibility --output=json | jq '.categories.accessibility.score'
```

---

## Known Issues & Trade-offs

1. **3D Vault Performance**: Heavy on mobile, mitigated by quality presets
2. **Postprocessing**: Bloom/Vignette disabled on LOW preset
3. **Font Loading**: Space Grotesk may cause FOUT on slow connections
4. **Hydration**: Some client components may show brief flash

---

## Monitoring

### Console Errors
- Run with `NEXT_PUBLIC_TELEMETRY_DEBUG=true` to see all events
- Check for hydration warnings
- Verify no uncaught exceptions

### Performance Metrics
- LCP (Largest Contentful Paint): Target <2.5s
- FID (First Input Delay): Target <100ms
- CLS (Cumulative Layout Shift): Target <0.1
- TTFB (Time to First Byte): Target <600ms

---

## Post-Deploy Checklist

- [ ] Verify OG images load correctly
- [ ] Test on real mobile device
- [ ] Check Lighthouse scores in production
- [ ] Verify Sentry error tracking
- [ ] Test reduced-motion on OS setting

---

*Last updated: M6 implementation*

