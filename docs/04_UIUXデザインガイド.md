# UI/UXデザインガイド - Asset Allocation Tool

## 1. デザイン原則

### 1.1 Core Principles

1. **Clarity First**: 複雑な金融データをシンプルに表現
2. **Mobile First**: モバイルファーストでレスポンシブデザイン
3. **Data Visualization**: データの視覚化を最優先
4. **Accessibility**: すべてのユーザーがアクセス可能
5. **Performance**: 高速なインタラクション

### 1.2 Design System

- **Design Token Based**: 一貫性のあるデザイントークン
- **Component Driven**: 再利用可能なコンポーネント
- **Theme Support**: ダーク/ライトモード対応
- **Motion Design**: 意味のあるアニメーション

## 2. カラーパレット

### 2.1 Primary Colors

```css
/* Light Theme */
--primary-50: #eff6ff;
--primary-100: #dbeafe;
--primary-200: #bfdbfe;
--primary-300: #93c5fd;
--primary-400: #60a5fa;
--primary-500: #3b82f6; /* Main */
--primary-600: #2563eb;
--primary-700: #1d4ed8;
--primary-800: #1e40af;
--primary-900: #1e3a8a;

/* Dark Theme Primary */
--primary-dark: #60a5fa;
```

### 2.2 Semantic Colors

```css
/* Status Colors */
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
--info: #3b82f6;

/* Chart Colors */
--chart-1: #3b82f6;
--chart-2: #10b981;
--chart-3: #f59e0b;
--chart-4: #ef4444;
--chart-5: #8b5cf6;
--chart-6: #ec4899;
--chart-7: #14b8a6;
--chart-8: #f97316;

/* Gain/Loss */
--gain: #10b981;
--loss: #ef4444;
--neutral: #6b7280;
```

### 2.3 Neutral Colors

```css
/* Gray Scale */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;

/* Background */
--bg-primary: #ffffff;
--bg-secondary: #f9fafb;
--bg-tertiary: #f3f4f6;

/* Dark Mode Background */
--bg-dark-primary: #0f172a;
--bg-dark-secondary: #1e293b;
--bg-dark-tertiary: #334155;
```

## 3. タイポグラフィ

### 3.1 Font Family

```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Courier New', monospace;
--font-display: 'Cal Sans', 'Inter', sans-serif;
```

### 3.2 Font Scale

```css
/* Text Sizes */
--text-xs: 0.75rem; /* 12px */
--text-sm: 0.875rem; /* 14px */
--text-base: 1rem; /* 16px */
--text-lg: 1.125rem; /* 18px */
--text-xl: 1.25rem; /* 20px */
--text-2xl: 1.5rem; /* 24px */
--text-3xl: 1.875rem; /* 30px */
--text-4xl: 2.25rem; /* 36px */
--text-5xl: 3rem; /* 48px */

/* Line Heights */
--leading-none: 1;
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;

/* Font Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

## 4. スペーシング

### 4.1 Spacing Scale

```css
--space-0: 0;
--space-1: 0.25rem; /* 4px */
--space-2: 0.5rem; /* 8px */
--space-3: 0.75rem; /* 12px */
--space-4: 1rem; /* 16px */
--space-5: 1.25rem; /* 20px */
--space-6: 1.5rem; /* 24px */
--space-8: 2rem; /* 32px */
--space-10: 2.5rem; /* 40px */
--space-12: 3rem; /* 48px */
--space-16: 4rem; /* 64px */
--space-20: 5rem; /* 80px */
--space-24: 6rem; /* 96px */
```

### 4.2 Border Radius

```css
--radius-none: 0;
--radius-sm: 0.125rem; /* 2px */
--radius-default: 0.25rem; /* 4px */
--radius-md: 0.375rem; /* 6px */
--radius-lg: 0.5rem; /* 8px */
--radius-xl: 0.75rem; /* 12px */
--radius-2xl: 1rem; /* 16px */
--radius-full: 9999px;
```

## 5. コンポーネントデザイン

### 5.1 Button Component

```tsx
// Primary Button
<Button variant="primary" size="md">
  Optimize Portfolio
</Button>

// Variants
variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'

// Sizes
size: 'sm' | 'md' | 'lg' | 'icon'

// States
- Default
- Hover (brightness +10%)
- Active (scale 0.98)
- Focus (ring-2 ring-primary-500)
- Disabled (opacity 50%)
- Loading (spinner icon)
```

### 5.2 Card Component

```tsx
<Card>
  <CardHeader>
    <CardTitle>Portfolio Performance</CardTitle>
    <CardDescription>Last 30 days</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
  <CardFooter>
    {/* Actions */}
  </CardFooter>
</Card>

// Card Styles
- Background: bg-white dark:bg-gray-800
- Border: border border-gray-200 dark:border-gray-700
- Shadow: shadow-sm hover:shadow-md
- Radius: rounded-lg
```

### 5.3 Input Component

```tsx
<Input
  type="text"
  placeholder="Search assets..."
  leftIcon={<SearchIcon />}
  rightIcon={<ClearIcon />}
/>

// Input States
- Default: border-gray-300
- Focus: border-primary-500 ring-2
- Error: border-red-500
- Success: border-green-500
- Disabled: bg-gray-100 cursor-not-allowed
```

### 5.4 Chart Components

```tsx
// Line Chart
<LineChart
  data={priceHistory}
  height={400}
  interactive
  showGrid
  showTooltip
  showLegend
/>

// Chart Features
- Responsive sizing
- Interactive tooltips
- Zoom and pan
- Crosshair cursor
- Export functionality
- Dark mode support
```

## 6. レイアウトパターン

### 6.1 Responsive Breakpoints

```css
--screen-sm: 640px; /* Mobile landscape */
--screen-md: 768px; /* Tablet */
--screen-lg: 1024px; /* Desktop */
--screen-xl: 1280px; /* Large desktop */
--screen-2xl: 1536px; /* Extra large */
```

### 6.2 Grid System

```css
/* 12-column grid */
.grid-cols-1   /* Mobile: 1 column */
.sm:grid-cols-2 /* Small: 2 columns */
.md:grid-cols-3 /* Medium: 3 columns */
.lg:grid-cols-4 /* Large: 4 columns */
.xl:grid-cols-6 /* Extra large: 6 columns */

/* Gap */
gap-4 /* 16px gap */
```

### 6.3 Container Widths

```css
.container {
  --max-width-sm: 640px;
  --max-width-md: 768px;
  --max-width-lg: 1024px;
  --max-width-xl: 1280px;
  --max-width-2xl: 1536px;

  margin: 0 auto;
  padding: 0 1rem;
}
```

## 7. インタラクションデザイン

### 7.1 Animations

```css
/* Transition Durations */
--duration-75: 75ms;
--duration-100: 100ms;
--duration-150: 150ms;
--duration-200: 200ms;
--duration-300: 300ms;
--duration-500: 500ms;
--duration-700: 700ms;

/* Easing Functions */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### 7.2 Framer Motion Animations

```tsx
// Page Transitions
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

// Stagger Children
const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

// Chart Animations
const chartVariants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}
```

### 7.3 Micro-interactions

```css
/* Hover Effects */
.hover-scale:hover {
  transform: scale(1.02);
  transition: transform 200ms ease;
}

/* Focus Effects */
.focus-ring:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
}

/* Loading States */
.skeleton {
  animation: shimmer 2s infinite;
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
```

## 8. モバイルデザイン

### 8.1 Touch Targets

```css
/* Minimum touch target size: 44x44px */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### 8.2 Mobile Navigation

```tsx
// Bottom Navigation for Mobile
<MobileNav>
  <NavItem icon={<HomeIcon />} label="Home" active />
  <NavItem icon={<ChartIcon />} label="Portfolio" />
  <NavItem icon={<PlusIcon />} label="Add" featured />
  <NavItem icon={<AnalysisIcon />} label="Analysis" />
  <NavItem icon={<SettingsIcon />} label="Settings" />
</MobileNav>
```

### 8.3 Gesture Support

```tsx
// Swipe to Delete
<SwipeableItem
  onSwipeLeft={() => handleDelete()}
  onSwipeRight={() => handleArchive()}
>
  <PortfolioCard />
</SwipeableItem>

// Pull to Refresh
<PullToRefresh onRefresh={handleRefresh}>
  <PortfolioList />
</PullToRefresh>
```

## 9. アクセシビリティ

### 9.1 WCAG 2.1 Guidelines

- **Color Contrast**: AA level (4.5:1 for normal text, 3:1 for large text)
- **Focus Indicators**: Visible focus states for all interactive elements
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Proper ARIA labels and semantic HTML
- **Alt Text**: Descriptive alt text for all images and charts

### 9.2 ARIA Patterns

```tsx
// Chart Accessibility
<div
  role="img"
  aria-label="Portfolio performance chart showing 15% growth over 6 months"
>
  <canvas id="chart" />
</div>

// Loading State
<div role="status" aria-live="polite">
  <Spinner />
  <span className="sr-only">Loading portfolio data...</span>
</div>

// Error State
<div role="alert" aria-live="assertive">
  Failed to load data. Please try again.
</div>
```

### 9.3 Keyboard Shortcuts

```
⌘K / Ctrl+K: Open search
⌘N / Ctrl+N: New portfolio
⌘S / Ctrl+S: Save portfolio
⌘/ / Ctrl+/: Show shortcuts
Esc: Close modal/dialog
Tab: Navigate forward
Shift+Tab: Navigate backward
Enter: Activate button/link
Space: Check/uncheck checkbox
Arrow keys: Navigate lists/menus
```

## 10. パフォーマンス最適化

### 10.1 Image Optimization

```tsx
// Next.js Image Component
<Image
  src="/chart-preview.png"
  alt="Portfolio chart"
  width={800}
  height={400}
  loading="lazy"
  placeholder="blur"
  quality={85}
/>
```

### 10.2 Code Splitting

```tsx
// Lazy loading heavy components
const HeavyChart = dynamic(() => import('@/components/charts/HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
})
```

### 10.3 Performance Metrics

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **TTI (Time to Interactive)**: < 3.8s
- **FCP (First Contentful Paint)**: < 1.8s

## 11. デザイントークン (CSS Variables)

```css
:root {
  /* Colors */
  --color-primary: var(--primary-500);
  --color-primary-hover: var(--primary-600);
  --color-background: var(--bg-primary);
  --color-surface: var(--bg-secondary);
  --color-text: var(--gray-900);
  --color-text-secondary: var(--gray-600);

  /* Spacing */
  --spacing-unit: 0.25rem;
  --container-padding: var(--space-4);

  /* Typography */
  --font-family-base: var(--font-sans);
  --font-size-base: var(--text-base);
  --line-height-base: var(--leading-normal);

  /* Borders */
  --border-width: 1px;
  --border-color: var(--gray-200);
  --border-radius: var(--radius-md);

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);

  /* Z-index */
  --z-dropdown: 10;
  --z-sticky: 20;
  --z-overlay: 30;
  --z-modal: 40;
  --z-tooltip: 50;
}

/* Dark Mode */
[data-theme='dark'] {
  --color-background: var(--bg-dark-primary);
  --color-surface: var(--bg-dark-secondary);
  --color-text: var(--gray-100);
  --color-text-secondary: var(--gray-400);
  --border-color: var(--gray-700);
}
```

## 12. コンポーネントライブラリ (shadcn/ui)

### 12.1 Available Components

- Accordion
- Alert & Alert Dialog
- Avatar
- Badge
- Button
- Calendar
- Card
- Checkbox
- Command (⌘K menu)
- Dialog
- Dropdown Menu
- Form
- Input
- Label
- Navigation Menu
- Popover
- Progress
- Radio Group
- Select
- Separator
- Sheet (Mobile drawer)
- Skeleton
- Slider
- Switch
- Table
- Tabs
- Textarea
- Toast
- Tooltip

### 12.2 Custom Components

```tsx
// Portfolio Card
<PortfolioCard
  title="My Balanced Portfolio"
  value={25000}
  change={+5.2}
  sparkline={data}
  assets={[...]}
/>

// Metric Card
<MetricCard
  label="Sharpe Ratio"
  value={0.85}
  change={+0.12}
  trend="up"
  info="Risk-adjusted return metric"
/>

// Asset Selector
<AssetSelector
  selected={['AAPL', 'GOOGL']}
  onChange={handleChange}
  max={10}
  suggestions={popularAssets}
/>
```

---

_Last Updated: December 2024_  
_Version: 1.0.0_
