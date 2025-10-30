# AutoBill Design Guidelines

## Design Approach

**Selected Approach**: Developer-First Design System inspired by Linear, Stripe Dashboard, and Vercel
**Rationale**: AutoBill is a productivity tool for developers requiring clarity, efficiency, and trust. The interface should feel professional, fast, and reliable - prioritizing usability over decorative elements.

**Core Principles**:
1. **Clarity Over Cleverness**: Every element has a clear purpose
2. **Speed Perception**: Instant feedback, minimal loading states
3. **Data Density**: Show maximum relevant information without clutter
4. **Trust Signals**: Professional polish that instills confidence in handling payment APIs

---

## Color Palette

### Light Mode
**Primary Brand**: 250 85% 60% (vibrant blue - energy and reliability)
**Primary Hover**: 250 90% 55% 
**Background**: 0 0% 100% (pure white)
**Surface**: 240 10% 98% (subtle off-white for cards)
**Border**: 240 6% 90% (soft dividers)
**Text Primary**: 240 10% 10% (near black)
**Text Secondary**: 240 5% 45% (muted for labels)
**Success**: 142 76% 45% (green for confirmations)
**Warning**: 38 92% 50% (amber for cautions)
**Error**: 0 84% 60% (red for errors)

### Dark Mode
**Primary Brand**: 250 80% 65% (slightly lighter blue)
**Background**: 240 10% 8% (deep charcoal)
**Surface**: 240 8% 12% (elevated panels)
**Border**: 240 6% 20% (subtle dividers)
**Text Primary**: 0 0% 95% (near white)
**Text Secondary**: 240 5% 65% (muted labels)
**Success**: 142 70% 50%
**Warning**: 38 85% 55%
**Error**: 0 75% 65%

---

## Typography

**Font Families**:
- **Primary**: Inter (via Google Fonts) - clean, readable for UI
- **Mono**: JetBrains Mono (via Google Fonts) - for code snippets, API keys, IDs

**Type Scale**:
- **Hero**: text-6xl font-bold (landing only)
- **H1**: text-4xl font-semibold 
- **H2**: text-2xl font-semibold
- **H3**: text-xl font-medium
- **Body**: text-base font-normal
- **Small**: text-sm font-normal
- **Tiny**: text-xs font-medium (labels, metadata)

**Line Heights**: Generous (1.6 for body, 1.2 for headings)

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 3, 4, 6, 8, 12, 16** (e.g., p-4, gap-6, mt-8)
**Container Max Widths**:
- Landing hero: Full-width with inner max-w-7xl
- Dashboard: max-w-screen-2xl mx-auto
- Content sections: max-w-4xl
- Forms: max-w-2xl

**Grid System**:
- Dashboard: 12-column grid (grid-cols-12)
- Sidebar navigation: 240px fixed width
- Main content: flex-1 with responsive padding (px-4 md:px-8 lg:px-12)

**Vertical Rhythm**: Consistent section spacing (py-8 on mobile, py-16 on desktop)

---

## Component Library

### Navigation
**Top Bar**: Fixed header (h-16), logo left, navigation center, user menu right. Backdrop blur effect on scroll.
**Sidebar** (Dashboard): Fixed 240px width, collapsible on mobile. Icon + label nav items with active state indicators (left border accent).

### Buttons
**Primary**: Solid primary color, white text, rounded-lg, px-6 py-3, shadow-sm on hover
**Secondary**: Border with primary color, primary text, rounded-lg
**Danger**: Solid error color for destructive actions
**Ghost**: Transparent with hover background (for less prominent actions)
**Icon Buttons**: Square (w-10 h-10), rounded-md, centered icon

### Cards
**Elevated**: Solid surface background, border, rounded-xl, p-6, shadow-sm
**Flat**: Border only, no shadow (for tight layouts)
**Interactive**: Hover lift effect (transform translate-y-0.5), cursor pointer

### Forms
**Input Fields**: 
- Border style, rounded-lg, px-4 py-3
- Focus: Ring-2 with primary color
- Dark mode: Surface background with lighter border
- Labels: text-sm font-medium mb-2
**Select Dropdowns**: Custom styled to match input aesthetic
**Checkboxes/Radio**: Rounded with primary accent
**Toggle Switches**: Pill-shaped, smooth transition

### Data Display
**Tables**: 
- Sticky header with surface background
- Striped rows (subtle zebra stripes)
- Hover highlight on rows
- Compact spacing (py-3 px-4)
- Mono font for IDs/codes
**Status Badges**: Pill-shaped, sm text, colored backgrounds (success green, warning amber, error red, neutral gray)
**Code Blocks**: Dark surface with mono font, copy button in top-right, syntax highlighting optional

### Modals/Dialogs
**Overlay**: Backdrop blur with 50% opacity dark overlay
**Content**: Centered, max-w-2xl, rounded-xl, shadow-2xl
**Header**: Sticky with close button
**Footer**: Sticky with action buttons (right-aligned)

### Toasts/Notifications
**Position**: Top-right fixed
**Style**: Surface background, border-l-4 with status color, rounded-lg, shadow-lg
**Icons**: Status icons (check, warning, error) on left
**Auto-dismiss**: 5 seconds with progress bar

---

## Landing Page Specific

### Hero Section
**Layout**: 70vh height, centered content with max-w-4xl
**Headline**: text-6xl font-bold, gradient text effect (primary to lighter shade)
**Subheading**: text-xl text-secondary, max-w-2xl
**CTA Buttons**: Large primary button + secondary outline button side-by-side
**Background**: Subtle grid pattern overlay with gradient fade

### Feature Sections
**Grid Layout**: 3 columns on desktop (grid-cols-1 md:grid-cols-3), gap-8
**Feature Cards**: Icon at top (w-12 h-12, primary background, rounded-lg), title (text-xl font-semibold), description (text-secondary)

### Social Proof Section
**Testimonial Cards**: 2-column grid, surface background, rounded-xl, p-8
**Avatar + Name + Role**: Horizontal layout with avatar (w-12 h-12 rounded-full)

### Pricing Section (if needed)
**Comparison Table**: 3 tiers side-by-side, highlighted "Popular" tier with primary border

### Footer
**Multi-Column**: 4 columns (Product, Company, Resources, Legal)
**Newsletter**: Single-line input + button combo
**Social Links**: Icon-only buttons with hover color change

---

## Dashboard Layouts

### Main Dashboard
**Stats Grid**: 4-column grid (grid-cols-1 sm:grid-cols-2 lg:grid-cols-4)
**Stat Cards**: Number (text-3xl font-bold), label (text-sm text-secondary), trend indicator (small up/down arrow with percentage)

### Product List
**List View**: Table with columns (Name, Plans, Created, Status, Actions)
**Card View** (mobile): Stacked cards with condensed info

### Product Creation Wizard
**Multi-Step Form**: Stepper progress indicator at top, single step visible per screen, back/next navigation at bottom
**Steps**: 1) Product Info, 2) Pricing Plans, 3) Integration Settings, 4) Review & Generate

### Admin Panel
**Sidebar Tabs**: Users, Products, Analytics, Settings, Content (Blog)
**User Management**: Table with search, filters, bulk actions
**Analytics Dashboard**: Chart.js charts with responsive containers

---

## Images

### Landing Page Hero
**Image**: None - use gradient background with subtle geometric grid pattern overlay instead. Focus on typography and clean CTAs.

### Feature Section Icons
**Style**: Heroicons (outline style), primary color, 24px size within 48px colored circles

### Dashboard/App
**Product Thumbnails**: If user provides logo/image, show 64px rounded square. Otherwise, use colored initial circles (first letter of product name).

### Blog (MDX)
**Featured Images**: 16:9 aspect ratio, rounded-xl, shadow-md. Use Next.js Image component for optimization. Place at top of post with caption support.

---

## Animations

**Transitions**: Use sparingly - only for state changes (menu open/close, modal appear, page transitions)
**Duration**: Fast (150-200ms) for most interactions
**Easing**: ease-in-out
**Hover Effects**: Subtle scale (1.02) or brightness changes
**Loading States**: Simple spinner or skeleton screens - no elaborate animations

---

## Accessibility & Responsiveness

**Mobile Breakpoints**: 
- Mobile: < 640px (stack everything)
- Tablet: 640-1024px (2-column layouts)
- Desktop: > 1024px (full multi-column)

**Touch Targets**: Minimum 44px height for all interactive elements
**Focus States**: Visible ring-2 with primary color on all focusable elements
**Color Contrast**: WCAG AA compliance minimum
**Dark Mode Toggle**: Persistent in header, respects system preference by default

---

## Brand Elements

**Logo**: Text-based "AutoBill" with stylized lightning bolt icon (signifying automation/speed). Primary color on light backgrounds, white on dark.
**Tagline**: "Instant Payment Setup for Your SaaS"
**Voice**: Professional but approachable, technical but not jargon-heavy