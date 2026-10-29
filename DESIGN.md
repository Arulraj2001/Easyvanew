---
name: Easyva
description: "Semantic design system for Easyva e-commerce platform. Inspired by artisan craftsmanship with vibrant violet, turquoise, lime, and sunlight gold accents."
colors:
  primary: "#7C3AED"
  primary-dark: "#6D28D9"
  secondary: "#0E7490"
  accent: "#166534"
  highlight: "#B45309"
  background: "#FFFFFF"
  surface: "#F8FAFC"
  surface-dark: "#0F172A"
  text-primary: "#0F172A"
  text-secondary: "#475569"
  border: "#E2E8F0"
  success: "#047857"
  danger: "#B91C1C"
typography:
  h1:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "2.75rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  h2:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "2rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  h3:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body-lg:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "6px"
  md: "12px"
  lg: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.background}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    typography: "{typography.body-md}"
  button-primary-hover:
    backgroundColor: "{colors.primary-dark}"
    textColor: "{colors.background}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    typography: "{typography.body-md}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    typography: "{typography.body-md}"
  badge-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.background}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs}"
    typography: "{typography.caption}"
  badge-highlight:
    backgroundColor: "{colors.highlight}"
    textColor: "{colors.background}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs}"
    typography: "{typography.caption}"
  badge-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.background}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs}"
    typography: "{typography.caption}"
  badge-success:
    backgroundColor: "{colors.success}"
    textColor: "{colors.background}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs}"
    typography: "{typography.caption}"
  badge-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.background}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs}"
    typography: "{typography.caption}"
  card-product:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
    typography: "{typography.body-md}"
  card-dark-header:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.background}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
    typography: "{typography.h3}"
  text-muted-block:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text-secondary}"
    padding: "{spacing.sm}"
    typography: "{typography.caption}"
  border-container:
    backgroundColor: "{colors.border}"
    textColor: "{colors.text-primary}"
    padding: "{spacing.xs}"
    rounded: "{rounded.sm}"
---

## Overview

Easyva is a modern, high-performance, mobile-first e-commerce brand for handcrafted goods, jewelry, and artistic home decor. The design language marries artisan authenticity with high-tech speed and fluid micro-interactions.

## Colors

- **Primary Violet (`#7C3AED` / `#6D28D9`)**: Brand anchor derived from the Easyva emblem. Symbolizes creativity, elegance, and premium artisan craft.
- **Secondary Turquoise (`#0891B2`)**: Fresh, energetic balance for interactive elements and category highlights.
- **Accent Lime/Forest (`#166534`)**: Organic accent for handcrafted badges, sustainability tags, and in-stock badges.
- **Highlight Amber (`#B45309`)**: Warm sunlight accent for special offers, star reviews, and limited drops.
- **Neutrals**: Crisp pearl white (`#FFFFFF`), light slate surface (`#F8FAFC`), deep charcoal text (`#0F172A`) ensuring WCAG AA compliant contrast ratio (> 4.5:1).

## Typography

- **Headlines**: Set in `Plus Jakarta Sans`, featuring tight negative tracking (`-0.02em` to `-0.03em`) for a confident, high-fashion editorial presence.
- **Body & Data**: Clean, neutral, high-legibility sans-serif with comfortable line height for mobile reading comfort.
- **Monospace Override**: Product SKUs, order reference IDs, and UPI UTR confirmation numbers use monospace for scannability.

## Layout

- **Mobile First**: All views are designed bottom-up for thumb-friendly mobile navigation with sticky bottom action bars on product pages.
- **Container Bounds**: Desktop views max out at `1380px` with generous asymmetric whitespace.
- **Grid Systems**: 1 column on mobile (`< 640px`), 2 columns on small tablets (`640px - 768px`), 3 to 4 columns on desktop (`>= 1024px`).

## Elevation & Depth

- **Flat & Frosted**: Rely on subtle 1px border lines (`#E2E8F0`) and glassmorphic surfaces (`backdrop-blur-md`) rather than heavy drop shadows.
- **Active Card Elevation**: Soft ambient shadow `0 12px 32px -8px rgba(124, 58, 237, 0.08)` on interactive product hover states.

## Shapes

- Smooth squircle contours (`rounded-xl` / `16px`) on cards and dialogs.
- Rounded pill shapes (`rounded-full`) on status badges, category filter chips, and floating quick-actions.

## Components

- **Header / Navigation**: Sticky translucent bar with Easyva logo, dynamic category links, instant search trigger, and badge-countered cart icon.
- **Mobile Bottom Bar**: Persistent bottom navigation with Home, Explore, Categories, Cart, and Account icons.
- **Product Card**: High-contrast image container, instant wishlist toggle, price strike-through, and one-tap "Add to Cart" button.
- **Direct UPI Dynamic Drawer**: Clean modal rendering pre-filled UPI Intent links (GPay, PhonePe, Paytm) and dynamic SVG QR codes.

## Do's and Don'ts

### Do's
- Always maintain WCAG AA contrast ratio (> 4.5:1) for all typography and interactive icons.
- Always compress uploaded product images to modern WebP format with responsive aspect ratio preservation.
- Provide immediate haptic/tactile feedback on button presses.

### Don'ts
- Do not use generic AI purple glowing borders or neon text shadows.
- Do not hide product pricing or category hierarchy behind nested multi-click menus on mobile.
- Do not let cart or checkout elements shift during layout rendering (enforce zero CLS).
