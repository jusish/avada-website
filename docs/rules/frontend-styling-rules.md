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
- **Native HTML `<select>` elements**: Never use default OS select dropdowns. Always use shadcn/ui `Select`.
- **Excessive `uppercase` Tailwind Classes**: Never overuse `uppercase` or `tracking-widest` on cards, badges, buttons, or table headers. Use natural title casing or clean sentence casing.
- **Oversized Border Radii**: Strictly avoid bulbous, excessive border radii (`rounded-3xl` or `rounded-2xl`) on cards and containers. Use standard, crisp `rounded-xl` for cards/dialogs and `rounded-lg` for inputs/buttons.
- **Custom / Ad-hoc Modals & Dialogs**: Never implement custom fixed overlay modal divs. Always use shadcn/ui Radix primitives (`Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter`).
- **Plain HTML Inputs & Buttons**: Never use unstyled `<input>` or raw `<button>`. Always use `@/components/ui/input` and `@/components/ui/button`.
- **Demo Credentials in Production**: Never expose prefilled demo credentials or test hints in production builds. Gate all developer helpers behind `import.meta.env.DEV`.
- **Hardcoded Inline Styles**: Avoid `style={{ ... }}` unless dynamic CSS variables for background positions/images are strictly necessary.

---

## 🧭 Authentication & Navigation Flow Rules
1. **Authenticated Redirection**: If a user is already authenticated (`token` exists in AuthContext), accessing `/admin/login` must automatically redirect to `/admin/dashboard` with replacement navigation.
2. **Branded Sidebar Navigation**: The Admin Sidebar header must display the official AvadaPay logo (`/logo.svg`) wrapped in a link pointing to the root live website (`/`), allowing direct navigation to the public site without needing a separate button.
3. **Comprehensive Entity Actions**: Every manageable CMS entity (Countries, Inquiry Types, Roles, Users, Content, Policies) must implement the full CRUD lifecycle: Create, View, Edit, and Delete/Toggle Status.
