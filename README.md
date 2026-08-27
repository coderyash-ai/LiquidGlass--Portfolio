# ?? Himanshu Liquid Portfolio

A **premium futuristic personal portfolio** built with React 19, Three.js, and Vite. Features a live interactive 3D Neural Core orb, liquid glassmorphism UI, dark/light theme switching, and smooth micro-animations throughout.

---

## ? Features

- **Interactive 3D Neural Core** — A revolving icosahedron orb with an electric orange torus knot inside, powered by React Three Fiber. Click to trigger a 600-particle burst detonation, orbital ring loop, and smooth re-assembly.
- **Dark / Light Theme** — Toggle between obsidian-black dark mode and clean light mode. Theme persists via `localStorage` and prevents FOUC on reload.
- **Liquid Glassmorphism UI** — iOS / visionOS-inspired crystalline glass cards with delicate borders, specular reflections, and backdrop blur.
- **Skeuomorphic 3D Buttons** — Orange accent buttons with layered gradients, specular inset highlights, and tactile active-press depth.
- **Neomorphic Inputs** — Soft concave inset shadows on form fields and search bars.
- **Micro-Animations** — Hero entrance fade-up, logo spin on hover, FAB breathing pulse glow, system row slide-ins, and chip pop scaling.
- **Fully Responsive** — Mobile-first layout with a glassmorphic drawer navigation.
- **Netlify Ready** — Pre-configured `netlify.toml` with SPA redirects, security headers, and asset caching.

---

## ?? Tech Stack

| Layer | Technology |
| :--- | :--- |
| Framework | React 19 |
| Build Tool | Vite 6 |
| Language | TypeScript 5 |
| 3D Engine | Three.js + React Three Fiber + Drei |
| Styling | Vanilla CSS (custom design system) |
| Deployment | Netlify |

---

## ?? Getting Started

### Prerequisites
- **Node.js** >= 18
- **npm** >= 9

### Installation

`ash
git clone https://github.com/YOUR_USERNAME/himanshu-liquid-portfolio.git
cd himanshu-liquid-portfolio
npm install
`

### Development Server

`ash
npm run dev
`

Open http://localhost:5173 in your browser.

### Production Build

`ash
npm run build
`

Output is in the `dist/` folder.

### Preview Production Build

`ash
npm run preview
`

---

## ?? Project Structure

`
himanshu-liquid-portfolio/
+-- public/
¦   +-- _redirects              # Netlify SPA redirect rule
+-- src/
¦   +-- components/
¦   ¦   +-- glass/              # UI components (Navbar, ThemeToggle, GlassControl…)
¦   ¦   +-- three/
¦   ¦       +-- NeuralCore.tsx  # Interactive 3D orb (Three.js)
¦   +-- hooks/
¦   ¦   +-- useTheme.ts                    # Dark/Light theme hook
¦   ¦   +-- usePrefersReducedMotion.ts
¦   +-- styles/
¦   ¦   +-- global.css          # Design tokens, glass material, theme variables
¦   ¦   +-- app.css             # Component styles, animations
¦   +-- App.tsx                 # Main app layout
+-- index.html
+-- netlify.toml                # Netlify build & deploy config
+-- vite.config.ts
+-- tsconfig.json
`

---

## ?? Design System

### Color Palette

| Token | Light Mode | Dark Mode |
| :--- | :--- | :--- |
| Accent | #ff5500 (Electric Orange) | #ff6600 |
| Background | #f5f5f7 | #000000 |
| Surface | #ffffff | #121214 |
| Ink | #1d1d1f | #f5f5f7 |
| Glass BG | rgba(255,255,255,0.55) | rgba(18,18,20,0.55) |

### Typography
- **Primary**: Inter (Google Fonts)

---

## ?? Deployment

### Deploy to Netlify (Recommended)

**Option A — Git Integration**
1. Push your code to GitHub
2. Go to app.netlify.com ? Add new site ? Import an existing project
3. Connect your GitHub repo — build settings are auto-detected from `netlify.toml`
4. Click **Deploy site**

**Option B — Drag and Drop**
1. Run `npm run build`
2. Go to netlify.com/drop
3. Drag the `dist/` folder onto the page

**Option C — Netlify CLI**
`ash
npm install -g netlify-cli
netlify login
npm run build
netlify deploy --prod --dir=dist
`

### What netlify.toml configures
- Node 20 build environment
- SPA redirect rules (/* ? /index.html 200)
- Security headers (CSP, X-Frame-Options, X-Content-Type)
- Aggressive asset caching (1 year for JS/CSS/images)

---

## ? 3D Orb — How It Works

The NeuralCore component (src/components/three/NeuralCore.tsx) is a full Three.js scene rendered via React Three Fiber:

1. **Outer Shell** — icosahedronGeometry wrapped in meshPhysicalMaterial with transmission=0.96 for smoky glass refraction.
2. **Orange Torus Core** — torusKnotGeometry with a glossy meshStandardMaterial in electric orange (#ff5500).
3. **Particle System** — 600 pre-generated particles with burst directions and orbital ring angles. Clicking triggers a 3-phase animation:
   - Phase 1 (0–0.4s): Radial explosion outward
   - Phase 2 (0.4–1.2s): Particles orbit into a circular ring
   - Phase 3 (1.2–1.8s): Ring collapses back and core re-assembles
4. **Earth Revolution** — Continuous Y-axis rotation (delta * 0.95 rad/s) with pointer-linked tilt.
5. **Ambient Field** — 140 floating toxic-green accent dots rotating slowly around the orb.

---

## ?? License

MIT © Himanshu

---

## ?? Acknowledgements

- React Three Fiber — https://github.com/pmndrs/react-three-fiber
- Drei — https://github.com/pmndrs/drei
- Three.js — https://threejs.org
- Vite — https://vitejs.dev
