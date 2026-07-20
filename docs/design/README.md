# AgroLink UI/UX Design System

**Document Version:** 1.0  
**Status:** Design Baseline (Pre-Implementation)  
**Discipline:** Product Design / Design Systems  
**Product:** AgroLink — Enterprise Agricultural Marketplace  

---

## Purpose

This document set defines the complete UI/UX system for AgroLink: visual language, interaction patterns, component specifications, page layouts, responsive behavior, dark mode, and accessibility. It is the source of truth for frontend implementation and design QA.

**Out of scope:** Backend APIs, database, business-rule implementation.

## Design Vision

**Positioning:** Premium enterprise SaaS with a modern agricultural identity — trustworthy like a logistics ERP, human like a field-to-market platform.

**North-star feeling:** *Clarity in the field.* Decisions (price vs. logistics cost) should feel calm, precise, and grounded — never playful, rustic-cliché, or neon-tech.

### Design Decision — Visual Direction: “Verdant Precision”

| Choice | Decision | Why |
|--------|----------|-----|
| Primary hue | Deep botanical green | Signals agriculture + institutional trust; avoids generic purple SaaS |
| Accent | Harvest gold (sparingly) | Highlights value/CTA without terracotta “farm kitsch” |
| Neutrals | Cool mist / slate | Enterprise readability; avoids warm cream cliché |
| Imagery | Real fields, produce, trucks — full-bleed on marketing | Product context as the visual anchor, not abstract blobs |
| Motifs | Soft topographic grain, leaf-vein hairlines (subtle) | Atmosphere without decoration overload |
| Explicitly avoided | Purple gradients, glow/neon, emoji UI, pill-stat strips in heroes, card-wrapped everything | Differentiates from generic AI SaaS and cluttered dashboards |

## Document Map

| # | Document | Covers |
|---|----------|--------|
| 1 | [Foundations](./01-foundations.md) | Design system core, color, type, spacing, grid, breakpoints |
| 2 | [Components](./02-components.md) | Buttons, cards, forms, tables, navigation, icons |
| 3 | [Feedback & System Screens](./03-feedback-and-system-screens.md) | Loading, empty, errors |
| 4 | [Page Layouts](./04-page-layouts.md) | Landing + Buyer/Seller/Logistics/Admin dashboards |
| 5 | [Mobile, Dark Mode & Accessibility](./05-mobile-dark-mode-accessibility.md) | Responsive mobile, dark theme, a11y |

## Role-Aware UX Principle

AgroLink is one product, four jobs:

| Role | Primary job on first screen |
|------|-----------------------------|
| Buyer | Post / manage demand |
| Seller | Compare offers + logistics → decide |
| Logistics | Publish capacity + run jobs |
| Admin | Govern trust & catalog |

**Decision:** Navigation and dashboards are role-skinned (same tokens, different information architecture) so users never see actions they cannot perform.

## Relationship to Architecture

Functional flows follow [architecture docs](../README.md). This design system specifies *how* those flows look and behave.

## Interactive overview

[AgroLink Design System canvas](C:/Users/User/.cursor/projects/c-Users-User-OneDrive-Desktop-AgroLink/canvases/agrolink-design-system.canvas.tsx) — open beside chat for a compact token/layout summary.
