# Frontend Styling & Design Rules

This document establishes the UI/UX conventions, styling philosophy, and design system constraints for the Avada frontend (`apps/web`).

---

## 💎 Fundamental Principles

### 1. Zero Tolerance for Plain / Unstyled HTML
- **Rule**: Never use raw, unstyled HTML elements (`<button>`, `<input>`, `<table>`, `<select>`, `<textarea>`, or plain `<ul>/<li>` lists).
- **Enforcement**: Every interactive or visual element MUST be either:
  1. A pre-built component from `apps/web/src/components/ui/` (shadcn/ui), OR
  2. Fully styled using Tailwind CSS classes with proper transitions, states (`hover:`, `focus-visible:`, `active:`, `disabled:`), and accessibility attributes.

### 2. Preferred Component Architecture: shadcn/ui
- Components are built using **Radix UI primitives** + **Tailwind CSS** + `class-variance-authority` (cva).
- Reusable UI atoms reside in `apps/web/src/components/ui/`:
  - `Button` (with variants: `default`, `outline`, `secondary`, `ghost`, `destructive`)
  - `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
  - `Input`, `Label`
  - `Badge` (with variants: `default`, `secondary`, `outline`, `destructive`, `success`)
  - `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`
  - `Dialog`, `DropdownMenu`, etc.
- Compound components should follow the Radix/shadcn composition pattern.

---

## 🎨 Aesthetics, Theme & Likes / Dislikes

### ✅ What We Like
- **Modern, Sleek Fintech/Tech Aesthetic**: Clean borders (`border-border`), subtle shadows, backdrop blurs (`backdrop-blur-md`), and high contrast text.
- **Micro-interactions**: Subtle hover state transitions (`transition-all duration-200 ease-in-out`), active scale effects, smooth focus rings.
- **Structured Layouts**:
  - Consistent container widths (`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`).
  - Standardized spacing scale (`gap-4`, `gap-6`, `gap-8`, `py-12`, `py-20`).
- **Icons**: Lucide React icons with consistent sizing (`w-4 h-4` or `w-5 h-5`) and proper colors.
- **Status Indicators**: Clean badges with semantic color tokens (`emerald-500` for published, `amber-500` for draft, `blue-500` for active).

### ❌ What We Dislike (Strictly Forbidden)
- Unstyled browser-native buttons with grey gradient backgrounds and bevel borders.
- Plain HTML input fields with default black outlines.
- Tables without header formatting, zebra striping or hover effects, and proper cell padding.
- Missing responsive design (everything must be fully responsive across mobile, tablet, and desktop).
- Hardcoded inline styles (`style={{ ... }}`) unless dynamic CSS variables for animations are required.

---

## 📱 Page & Layout Structure

1. **Public Marketing Site**:
   - `Navbar`: Sticky header with logo, navigation links, and CTA button.
   - `HeroSection`: Impactful headline, subtitle, primary/secondary action buttons, and visual graphics.
   - `FeaturesSection`: Grid of feature cards using `Card` component with icons, descriptions, and hover effects.
   - `Footer`: Multi-column links, copyright, and branding.

2. **CMS Admin Dashboard**:
   - `AdminSidebar`: Collapsible or persistent desktop sidebar with brand icon, navigation items, user avatar, and logout button.
   - `AdminHeader`: Breadcrumbs, search, notification trigger, and profile menu.
   - `AdminContent`: Data cards for key metrics, searchable data tables with status badges, and action buttons.
