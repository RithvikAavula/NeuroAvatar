<p align="center">
  <img src="public/neurologo.png" alt="NeuroAvatar Logo" width="120" />
</p>

<h1 align="center">NeuroAvatar</h1>

<p align="center">
  <strong>Your Mind. Your Movement. Your Second Body.</strong>
</p>

<p align="center">
  <em>A brain-computer interface platform that enables humans to control humanoid robots through motor intention — transforming robotics into physical extensions of the human body.</em>
</p>

<p align="center">
  <a href="#-live-demo">Live Demo</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-sections--features">Sections</a> •
  <a href="#-3d-meshy-ai-models">3D Models</a> •
  <a href="#-design-system">Design System</a> •
  <a href="#-animations">Animations</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-challenges--solutions">Challenges</a> •
  <a href="#-deployment">Deployment</a>
</p>

---

## 🧠 Overview

NeuroAvatar is a **research-grade interactive web platform** that showcases the future of human-robot teleoperation through brain-computer interfaces (BCI). The application presents a comprehensive investor and research information portal featuring:

- **14 immersive content sections** with scroll-triggered animations
- **Meshy AI 3D Humanoid & Avatar Pipeline** — Generative 3D cybernetic operator and robot models with real-time skeletal animations (running, boxing, dancing, gestures)
- **Dual-theme system** (Deep Space Dark / Crystal Ivory Light) with seamless live switching
- **Real-time interactive elements** — parallax, magnetic buttons, GSAP choreography
- **Simulated BCI telemetry pipeline** visualization
- **Mobile-first responsive design** with touch optimizations

> **Note**: All demonstrations are simulated. This platform is for research communication and investor information purposes.

---

## 🚀 Live Demo

🌐 **Live Site**: [https://neuro-avatar.vercel.app](https://neuro-avatar.vercel.app)

📦 **Repository**: [https://github.com/RithvikAavula/NeuroAvatar](https://github.com/RithvikAavula/NeuroAvatar)

Or run locally:

```bash
# Clone & install
git clone https://github.com/RithvikAavula/NeuroAvatar.git
cd NeuroAvatar
npm install

# Development server (hot reload)
npm run dev

# Production build
npm run build
npm run preview
```

---

## 🏗 Architecture

```
NeuroAvatar/
├── public/                    # Static assets (logo, OG images)
├── src/
│   ├── components/
│   │   ├── features/          # 14 section components
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ProblemSection.tsx
│   │   │   ├── BigIdeaSection.tsx
│   │   │   ├── NotAnAISection.tsx
│   │   │   ├── HowItWorksSection.tsx
│   │   │   ├── DemoSection.tsx
│   │   │   ├── NeuralDecoderSection.tsx
│   │   │   ├── TwowaySection.tsx
│   │   │   ├── RoadmapSection.tsx
│   │   │   ├── ApplicationsSection.tsx
│   │   │   ├── ResearchSection.tsx
│   │   │   ├── MarketSection.tsx
│   │   │   ├── InvestorSection.tsx
│   │   │   └── ClosingSection.tsx
│   │   ├── layout/            # Navbar, ThemeProvider
│   │   └── ui/                # Shadcn/UI primitives
│   ├── hooks/                 # useTheme, useInView
│   ├── pages/                 # Index, NotFound
│   ├── App.tsx                # Root with providers
│   ├── index.css              # Design system + animations
│   └── main.tsx               # Entry point
├── index.html                 # SEO-optimized shell
├── vercel.json                # Vercel deployment config
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.app.json          # TypeScript config
└── vite.config.ts             # Vite bundler config
```

---

## 📖 Sections & Features

| # | Section | Description | Key Interactions |
|---|---------|-------------|------------------|
| 1 | **Hero** | Kinetic headline with typewriter subtitle | Mouse parallax, magnetic CTAs, continuous glow/shimmer animations, floating particles |
| 2 | **Problem** | Why current robotics interfaces fail | 4 animated bottleneck cards, comparison matrix |
| 3 | **Big Idea** | The NeuroAvatar paradigm shift | Side-by-side 3D Meshy operator & robot avatars, scroll-triggered reveals |
| 4 | **Not An AI** | Motor intention vs. AI command distinction | Flip cards with front/back comparison, VS divider |
| 5 | **How It Works** | 5-stage BCI pipeline walkthrough | Step-by-step reveal, signal flow animation |
| 6 | **Demo** | Interactive BCI humanoid action simulator | 4 real-time Meshy AI skeletal animation modes (Running, Boxing, Dance, Gesture), telemetry metrics |
| 7 | **Neural Decoder** | EEG → kinematics signal processing | Raw EEG spectrum, technical processing cards |
| 8 | **Two-Way** | Bidirectional feedback loop | Dual Meshy 3D viewports (Neural Vanguard & Cybernetic Sentinel), animated transmission pathways |
| 9 | **Roadmap** | Development milestones timeline | Interactive modal detail views |
| 10 | **Applications** | Use cases across verticals | Expandable application cards |
| 11 | **Research** | Academic foundation & citations | Publication cards with links |
| 12 | **Market** | TAM/SAM/SOM market analysis | Animated counters, data visualizations |
| 13 | **Investor** | Executive investment brief | 6-stage telemetry pipeline, platform expansion cards, deck request form |
| 14 | **Closing** | Brand signature & manifesto | Semi-opaque logo watermark, atmospheric aura, return-to-top |

---

## 🎨 Design System

### Color Palette

#### Dark Theme — *Deep Space + Ember + Electric Violet*

| Token | HSL | Usage |
|-------|-----|-------|
| `--background` | `222 35% 4%` | Deep obsidian base |
| `--foreground` | `38 18% 93%` | Warm ivory text |
| `--primary` | `38 92% 54%` | Amber/gold accent |
| `--secondary` | `258 80% 62%` | Electric violet |
| `--neural-cyan` | `38 92% 54%` | Primary interactive color |
| `--neural-violet` | `258 80% 62%` | Secondary accent |
| `--neural-blue` | `210 100% 60%` | Tertiary accent |
| `--surface-1..4` | `222 35-22% 4-14%` | Layered surface hierarchy |

#### Light Theme — *Crystal Ivory + Deep Amber + Regal Violet*

| Token | HSL | Usage |
|-------|-----|-------|
| `--background` | `36 28% 91%` | Warm ivory canvas |
| `--foreground` | `222 45% 5%` | Near-black text |
| `--primary` | `38 88% 36%` | Deep amber |
| `--secondary` | `258 70% 42%` | Regal violet |
| `--neural-cyan` | `38 85% 32%` | Deep amber interactive |

### Typography

| Font | Weight | Usage |
|------|--------|-------|
| **Outfit** | 300–900 | Headlines, CTAs, wordmarks |
| **Inter** | 300–600 | Body text, descriptions |
| **IBM Plex Mono** | 400–600 | Technical labels, metrics, code |

### Gradient Systems

```css
/* Tri-color gradient text */
.gradient-text-tri → cyan → violet → blue

/* Shimmer text (animated) */
.shimmer-text → sweeping gradient across neural-cyan, neural-glow, foreground, violet

/* Dynamic gradient (theme-adaptive) */
.gradient-text-dynamic → #00d4ff → #b872ff → #e0c2ff (dark)
                        → #0284c7 → #6d28d9 → #4338ca (light)
```

### Glass Morphism

```css
.glass-panel      → frosted card with backdrop blur + subtle border
.glass-panel-bright → elevated glass with stronger opacity
```

---

## ✨ Animations

### Scroll Animations (GSAP + ScrollTrigger)
- **Section entrance**: Fade-in with directional slide (alternating left/center/right)
- **Glass panel reveal**: Scale-up with opacity transition
- **Divider lines**: Draw-in from left with `scaleX` animation
- **Scroll progress bar**: Fixed top indicator tracking page progress

### Hero Section Animations
| Animation | Type | Details |
|-----------|------|---------|
| Headline reveal | GSAP Timeline | Lines stagger in with `skewY`, `rotateX`, `power4.out` easing |
| Typewriter | JavaScript interval | 18ms per character with blinking cursor |
| Parallax | Mouse tracking | Multi-layer depth (aurora orbs, grid, logo, content) |
| Floating particles | CSS `@keyframes` | 50 particles with randomized sizes, colors, durations |
| Aurora orbs | CSS animation | Soft pulsating gradient orbs with mouse parallax |
| Logo watermark | CSS mask | Centered semi-opaque (`0.18`/`0.13`) with radial feather mask |
| Primary CTA | Continuous | Glow pulse + shimmer sweep + bottom bar pulse |
| Secondary CTA | Continuous | Border breathe + blinking dot indicator |
| Magnetic buttons | GSAP | Cursor-following translation with elastic snap-back |

### Section-Specific Animations
| Section | Animation |
|---------|-----------|
| Problem | Bottleneck card hover transforms |
| Not An AI | 3D flip cards with backface diagrams |
| Demo | One-way signal transmission with mesh characters |
| Neural Decoder | Step-by-step processing pipeline reveal |
| Roadmap | Modal open/close with centered positioning |
| Investor | 6-node telemetry pipeline with live throughput beam |
| Closing | Background logo fade-in with scale transition, orbital rings |

### Global Animation Keyframes
```
shimmer, hero-orbit-spin, hero-orbit-spin-reverse, hero-aura-pulse,
hero-logo-scan, hero-btn-glow, hero-btn-shimmer, hero-btn-bar-pulse,
hero-btn-border-breathe, hero-btn-dot-blink, closing-pulse-ring,
pipeline-beam, count-up, blink, float-particle, scan-line,
aurora-orb-drift, glow-pulse, dot-flow, node-pulse, red-decay
```

---

## 🤖 3D Meshy AI Models & Interactive WebGL Pipeline

NeuroAvatar features an end-to-end 3D character pipeline powered by **Meshy AI** (generative 3D mesh modeling and texturing) integrated with **Three.js**, **React Three Fiber (`@react-three/fiber`)**, and **`@react-three/drei`**.

### Model Roster & GLB Assets

| Asset File | Character / Role | BCI Integration & Behavior |
|------------|------------------|----------------------------|
| `Meshy_AI_Neural_Vanguard_0918185718_texture.glb` | **Neural Vanguard (Operator)** | Human cybernetic operator avatar situated at the neural recording station. Features detailed cyberware textures, neural headset apparatus, and ambient signal aura. |
| `Meshy_AI_Cybernetic_Sentinel_0918184736_texture.glb` | **Cybernetic Sentinel (Avatar)** | Full-scale humanoid teleoperation robot avatar designed for remote embodiment. Used as the default physical counterpart in the two-way teleoperation loop. |
| `Meshy_AI_Cybernetic_Sentinel_Running.glb` | **Locomotion Kinematics** | Continuous bipedal running animation triggered when the simulated BCI pipeline classifies active forward locomotion motor-imagery intent. |
| `Meshy_AI_Cybernetic_Sentinel_Boxing_Practice.glb` | **Upper-Body Manipulation** | High-dexterity boxing and arm-strike kinematic stream, demonstrating low-latency upper-limb coordination and defensive posturing. |
| `Meshy_AI_Cybernetic_Sentinel_All_Night_Dance.glb` | **Whole-Body Agility** | Fluid, synchronized whole-body dance movements illustrating complex multi-joint degrees of freedom (DoF) and dynamic balance. |
| `Meshy_AI_Cybernetic_Sentinel_Agree_Gesture.glb` | **Social Telepresence** | Fine-motor expressive nod/affirmation gesture, demonstrating conversational presence and social interaction feedback channels. |

### WebGL Architecture & Shading Highlights
- **Dynamic Action Switching**: The `DemoSection` allows users to select between simulated motor imagery states (Running, Boxing, Dancing, Gestures), dynamically swapping and blending skeletal animation tracks via `@react-three/drei`'s `useAnimations`.
- **Preloading Strategy**: Assets are preloaded at module initialization with `useGLTF.preload(...)` to eliminate network stalls and ensure instantaneous animation playback.
- **Atmospheric Lighting**: Three-point studio lighting with high-intensity cyan/violet rim lights, directional key lighting, and subtle ground bounce illumination that adapts to both Dark and Light themes.
- **Hardware-Constrained OrbitControls**: Damped rotation with constrained polar angles (`minPolarAngle: Math.PI / 4`, `maxPolarAngle: Math.PI / 2`) prevents camera clipping beneath ground planes while allowing full 360° orbital inspection.
- **Theme-Aware Hologram & Normal Overlays**: Models feature custom cybernetic shaders that transition seamlessly between standard PBR materials, wireframe hologram projections, and neural particle auras.

---

## 🛠 Tech Stack

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3 | UI component framework |
| **TypeScript** | 5.5 | Type-safe development |
| **Vite** | 5.4 | Lightning-fast HMR bundler |

### Styling & Design
| Technology | Purpose |
|------------|---------|
| **Tailwind CSS** 3.4 | Utility-first CSS framework |
| **Shadcn/UI** | Accessible component primitives (Radix UI) |
| **Custom CSS** | Design system, animations, gradient systems |

### Animation
| Technology | Purpose |
|------------|---------|
| **GSAP** 3.15 | ScrollTrigger, timeline choreography, magnetic effects |
| **Framer Motion** 12.x | Component-level transitions |
| **CSS Keyframes** | Continuous ambient animations |

### 3D & Visualization
| Technology | Purpose |
|------------|---------|
| **Meshy AI** | Generative 3D mesh modeling, topology & texturing for humanoid avatars |
| **Three.js** 0.181 | 3D scene rendering engine |
| **React Three Fiber** 8.18 | Declarative React bindings for Three.js |
| **React Three Drei** 9.122 | High-performance shaders, loaders (`useGLTF`), controls (`OrbitControls`) |
| **Chart.js** / **Recharts** | Telemetry and market data visualizations |

### State & Data
| Technology | Purpose |
|------------|---------|
| **Zustand** 5.0 | Lightweight state management |
| **React Query** 5.x | Server state & caching |
| **React Router** 6.x | Client-side routing |
| **React Hook Form** + **Zod** | Form validation |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| **Vercel** | Deployment & edge CDN |
| **PostCSS** + **Autoprefixer** | CSS processing pipeline |
| **ESLint** | Code quality |

---

## 📱 Mobile Compatibility

The application is fully responsive across all device sizes:

| Breakpoint | Target | Optimizations |
|------------|--------|---------------|
| `≤ 480px` | Small phones | Scaled typography, stacked CTAs, reduced particle opacity |
| `481–768px` | Tablets | Balanced scaling, wrapped layouts |
| `769–1024px` | Small laptops | Proportional heading sizes |
| `≥ 1025px` | Desktop | Full experience with all animations |

### Touch Optimizations
- **44px minimum tap targets** for all interactive elements
- **Disabled magnetic hover effects** on touch devices
- **`prefers-reduced-motion`** respected for accessibility
- **Safe area padding** for notched devices (iPhone, etc.)

---

## 🌐 Deployment

### Vercel (Recommended)

1. **Connect your repository** to [Vercel](https://vercel.com)
2. Vercel auto-detects the Vite framework via `vercel.json`
3. Settings are pre-configured:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **SPA Rewrites**: All routes → `index.html`
   - **Asset Caching**: Immutable hashed assets cached for 1 year
   - **Security Headers**: `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`

### Manual Deployment

```bash
# Build production bundle
npm run build

# Preview locally
npm run preview

# The dist/ folder is ready for any static hosting
```

---

## 🔒 SEO & Performance

- **Meta tags**: Title, description, keywords, Open Graph, Twitter Cards
- **Structured data**: JSON-LD schema for WebSite
- **Semantic HTML**: Proper heading hierarchy, landmark elements
- **Font optimization**: Preconnect to Google Fonts, display=swap
- **Asset optimization**: Vite's tree-shaking, code splitting, hashed filenames
- **Favicon**: Custom logo as favicon and Apple touch icon

---

## 🧩 Challenges & Solutions

Building a visually rich, animation-heavy research platform across 14 sections presented several engineering challenges. Below is a summary of the key problems encountered and how they were solved.

### 1. Roadmap Section Folder Animation Fluctuating & Jitter

**Challenge**: After deployment, the interactive 3D folder component in the Roadmap section occasionally fluctuated or stuttered during scroll and interaction:
- **Dual State Divergence**: Both the parent `RoadmapSection` and the child `Folder` component maintained independent `open` states. When clicked, uncoordinated event bubbling caused double toggling and out-of-sync states where open papers hovered while the floating CSS animation was still running.
- **Hover Boundary Flutter**: As the folder floated up and down via keyframes, hovering near the element edge triggered CSS `translateY(-8px)`, causing the cursor to move outside the hit box and creating a high-frequency hover enter/leave oscillation loop.
- **High-Frequency Mousemove Re-renders**: An unthrottled `mousemove` listener on papers was updating React state 60–120 times per second for unused CSS variables, thrashing the virtual DOM and stalling CSS transitions.
- **Scroll Trigger Drift**: Opening the 10-phase grid dynamically expanded section height by ~800px without recalibrating GSAP's scroll cache, causing subsequent section triggers down the page to jump or fire prematurely.

**Solution**:
- **Controlled Single Source of Truth**: Refactored `Folder.tsx` to accept a controlled `open` prop and `onToggle` callback with `e.stopPropagation()`, completely preventing race conditions and double toggles.
- **Hover Buffer Pseudo-Element**: Added an invisible hit-expansion buffer (`.folder::before` with negative inset) so the cursor never slips out of the hover zone during floating motion.
- **Eliminated Unused State Updates**: Removed the heavy mousemove re-render cycle, letting the GPU handle paper transitions purely via hardware-accelerated CSS transforms.
- **Hardware Acceleration (translate3d)**: Upgraded all keyframe and transition transforms from 2D (`translateY`) to 3D (`translate3d(0, -9px, 0)`), adding `will-change: transform` and `backface-visibility: hidden` for dedicated GPU compositor layer allocation.
- **Dynamic ScrollTrigger Recalibration**: Attached `ScrollTrigger.refresh()` callbacks on card stagger completion and folder state change, ensuring buttery-smooth scroll offsets across the entire page.

---

### 2. Scroll Animation Smoothness & Compositor Layer Optimization

**Challenge**: Scrolling through 14 animated sections created persistent GPU memory overhead and micro-stutters when multiple full-width sections retained inline GSAP CSS transforms after completing their entrance animations. Furthermore, lingering container transforms interfered with child hover animations and fixed overlay modals.

**Solution**:
- **GSAP `clearProps: "transform"`**: Applied automatic `clearProps: "transform"` upon completion of section and card entrance animations. Once in view, elements revert to standard layout flow without lingering composite layers or subpixel rasterization artifacts.
- **Passive Scroll Listeners**: Implemented passive event listeners for the top scroll progress bar (`{ passive: true }`) to ensure the browser's main thread is never blocked during scroll.
- **Decoupled ScrollTrigger Instances**: Wrapped each section's triggers in `gsap.context()` with explicit `ctx.revert()` lifecycles, ensuring memory is cleaned up on unmount or page transitions.

---

### 2. Dual-Theme System Across 14 Sections

**Challenge**: Maintaining visual consistency and readability when switching between a dark (Deep Space) and light (Crystal Ivory) theme across 14 sections with gradient text, glass panels, glows, and animated elements. Inline styles with HSL values wouldn't automatically adapt.

**Solution**:
- Built a CSS custom property system (`--neural-cyan`, `--surface-1..4`, `--foreground`, etc.) that swaps values via a root class (`dark-theme` / `light-theme`)
- Created theme-specific overrides in `index.css` for glass panels, gradient text, shimmer effects, and glow intensities
- All components read `isDark` from `useTheme()` and adjust inline styles (box-shadows, border colors, background opacities) dynamically
- Added `transition: background-color 0.5s ease, color 0.5s ease` on `html, body` for smooth theme crossfade

---

### 3. GSAP ScrollTrigger + Framer Motion Coexistence

**Challenge**: Using both GSAP ScrollTrigger (for scroll-based section reveals, divider line draws, and glass panel staggers) and Framer Motion (for component-level micro-interactions) simultaneously caused conflicts — Framer would reset GSAP-applied transforms and vice versa.

**Solution**:
- Established clear ownership boundaries: GSAP owns scroll-triggered entrance animations via the `Index.tsx` orchestrator, while Framer Motion handles component-level interactions (hover states, presence transitions)
- Used `gsap.context()` with cleanup (`ctx.revert()`) in every `useEffect` to prevent stale ScrollTrigger instances on re-renders
- Scoped GSAP animations to `main > section:not(:first-child)` to avoid touching the Hero (which uses its own dedicated GSAP timeline)

---

### 4. Hero Section Performance with 50+ Animated Particles

**Challenge**: The Hero section renders 50 floating particles, 5 aurora orbs, a background grid, mouse-parallax, typewriter animation, and GSAP headline choreography simultaneously. On lower-end devices, this caused frame drops below 30fps.

**Solution**:
- All particles use pure CSS `@keyframes` with randomized delays/durations (no JavaScript animation loop)
- Aurora orbs use `filter: blur()` with `will-change: transform, opacity` for GPU compositing
- Mouse parallax uses `requestAnimationFrame`-throttled updates with proportional depth multipliers
- Mobile breakpoints reduce particle opacity and disable magnetic button effects via `@media (hover: none)`

---

### 5. Light Theme Text Readability

**Challenge**: Many sections used gradient text fills (`-webkit-text-fill-color: transparent` + `background-clip: text`) designed for dark backgrounds. On the light theme, these gradients became washed out and unreadable.

**Solution**:
- Created dedicated light-theme gradient palettes (`#0284c7 → #6d28d9 → #4338ca` instead of `#00d4ff → #b872ff`)
- Applied `!important` overrides via `html.light-theme .gradient-text-dynamic` selectors
- Added a blanket override forcing all headings to `color: hsl(215 45% 4%) !important` in light mode
- Adjusted glass panel backgrounds from dark translucent to bright ivory translucent

---

### 6. Roadmap Detail Modal Centering

**Challenge**: The roadmap phase detail modal wasn't centering correctly because it was positioned inside a deeply nested scrollable section with `overflow: hidden` ancestors.

**Solution**:
- Used React `createPortal()` to render the modal directly into `document.body`, bypassing all parent overflow/transform contexts
- Applied `position: fixed; inset: 0; display: flex; align-items: center; justify-content: center` on the overlay
- Added GSAP entrance animation (`scale: 0.88 → 1`, `opacity: 0 → 1`) for polished open/close transitions

---

### 7. Mobile Responsiveness at Scale

**Challenge**: 14 content-heavy sections with fixed pixel widths, large font sizes, and side-by-side layouts didn't adapt to mobile viewports. The folder-cards side-by-side layout in the Roadmap section broke completely on phones.

**Solution**:
- Added responsive media queries at 3 breakpoints (`≤480px`, `481–768px`, `769–1024px`) with `clamp()` typography
- Used `flex-direction: column` overrides for stacking on small screens
- Added `@media (hover: none) and (pointer: coarse)` for touch device optimizations (44px min tap targets, disabled magnetic hover)
- Implemented `@media (prefers-reduced-motion: reduce)` for accessibility compliance
- Added `@supports (padding: env(safe-area-inset-bottom))` for notched device safe areas

---

### 8. Production Bundle Size Optimization

**Challenge**: The production bundle exceeded 1.6MB (471KB gzipped) due to Three.js, GSAP, Framer Motion, and Recharts all being bundled together.

**Solution**:
- Vite's automatic tree-shaking eliminates unused module exports
- Hashed filenames (`index-Ck4p1Qfh.js`) enable immutable caching with `Cache-Control: max-age=31536000`
- `vercel.json` configured with framework-aware build settings and security headers
- Future improvement: Dynamic `import()` for below-fold sections (Three.js scenes, charts) to reduce initial payload

---

### 9. Meshy 3D Model Memory Management & Skeletal Animation Switching

**Challenge**: Rendering multiple high-fidelity 3D humanoid GLB models (generated via Meshy AI) with distinct skeletal bone animations across multiple viewports (Demo section, Two-Way section, Big Idea section) created performance risks:
- WebGL memory leaks and context loss when navigating or re-mounting components
- Frame drops and visual hitching when swapping between heavy animation files (Running, Boxing, Dance, Gesture) during runtime
- High fragment shader and draw-call overhead on mobile GPUs with retina-resolution screens

**Solution**:
- **Module-Level Preloading**: Implemented `useGLTF.preload(...)` for all 6 Meshy model assets (`Neural_Vanguard`, `Cybernetic_Sentinel`, and kinematic variants) so geometry and textures are parsed once and cached in the GPU buffer.
- **Suspense Boundaries & Fallback Shaders**: Wrapped all Canvas scenes in React `Suspense` with lightweight glowing holographic skeleton loaders, ensuring the main thread remains responsive during asynchronous GLTF parsing.
- **Three.js AnimationMixer Cross-Fading**: Applied smooth blend weights across skeletal tracks rather than abruptly destroying and rebuilding scenes, yielding seamless kinematic transitions when users switch BCI intention states.
- **Dynamic DPR Capping**: Set `dpr={[1, 2]}` on R3F `<Canvas>` elements to prevent retina devices (such as iPhone and 4K displays) from rendering at 3x/4x pixel density, preserving a constant 60fps framerate.

---

## 📄 License

This project is proprietary. All rights reserved by NeuroAvatar.

---

<p align="center">
  <strong>NeuroAvatar</strong> — The body is only the beginning.
</p>
