# Frontend Styling & Design Rules

This document establishes the UI/UX conventions, styling philosophy, and design system constraints for the Avada frontend (`apps/web`).

---

## 💎 Fundamental Principles

### 1. Zero Tolerance for Plain / Unstyled HTML
- **Rule**: Never use raw, unstyled HTML elements (`<button>`, `<input>`, `<select>`, `<table>`, `<textarea>`, or plain `<ul>/<li>` lists).
- **Select Elements**: **NEVER USE NATIVE HTML `<select>` TAGS**. Always use the shadcn/ui Select suite located at [`apps/web/src/components/ui/select.tsx`](../../apps/web/src/components/ui/select.tsx) (`Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`).
- **Enforcement**: Every interactive or visual element MUST be either:
  1. A pre-built component from `apps/web/src/components/ui/` (shadcn/ui), OR
  2. Fully styled using Tailwind CSS classes with proper transitions, states (`hover:`, `focus-visible:`, `active:`, `disabled:`), and accessibility attributes.

### 2. Brand Identity & Primary Color
- **Primary Color**: `#3BBA93` (Teal / Emerald fintech green, HSL: `162 52% 48%`).
- **Brand Name**: **AvadaPay™** (Official logo SVG located at `apps/web/public/logo.svg`).
- **Contrast Theme**: Dark slate / deep navy (`#0B132B`, `#0F172A`) for high-contrast fintech aesthetic matching hero photography and terminal accents.

### 3. Preferred Component Architecture: shadcn/ui
- Components are built using **Radix UI primitives** + **Tailwind CSS** + `class-variance-authority` (cva).
- Reusable UI atoms reside in `apps/web/src/components/ui/`:
  - `Button` (variants: `default`, `outline`, `secondary`, `ghost`, `destructive`, `gradient`)
  - `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
  - `Input`, `Label`
  - `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`
  - `Badge` (variants: `default`, `secondary`, `outline`, `destructive`, `success`, `warning`)
  - `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`

---

## 🎨 Aesthetics, Theme & Likes / Dislikes

### ✅ What We Like
- **African Fintech Excellence**: Clean, high-performance aesthetics with dark atmospheric hero photography, soft gold/amber bokeh accents, and sharp `#3BBA93` highlights.
- **Capsule / Pill Navbars**: Modern floating pill menu with high contrast text and smooth state transitions.
- **Country Selection as Dedicated Pages**: The country selector in the header is NOT a simple form filter; each country (Kenya, Rwanda, Tanzania) is a rich dedicated landing page (`/countries/:countrySlug`).
- **Micro-interactions**: Subtle hover state transitions (`transition-all duration-200 ease-in-out`), active scale effects, smooth focus rings.
- **Status Indicators**: Clean badges with semantic color tokens (`#3BBA93` for active/live/success, `amber-500` for draft/staging).

### ❌ What We Dislike (Strictly Forbidden)
- Native HTML `<select>` inputs with default OS bevels.
- Plain HTML input fields with default black outlines.
- Tables without header formatting, zebra striping or hover effects, and proper cell padding.
- Hardcoded inline styles (`style={{ ... }}`) unless dynamic CSS variables for background images/animations are required.
