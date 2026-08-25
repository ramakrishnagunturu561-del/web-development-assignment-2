# Force Lab — Interactive Physics Simulation

An interactive web-based Physics learning platform designed for Class 11/12 students.

Force Lab transforms core mechanics concepts into interactive simulations, visual explanations, worked examples, and concept-check challenges.

## 🚀 Live Demo

https://cyclotron-lab.vercel.app/

## 💻 GitHub Repository

https://github.com/ramakrishnagunturu561-del/web-development-assignment-2

---

## 📚 Topics Covered

The simulation contains 10 sections covering fundamental force and motion concepts:

1. **Overview**
2. **Newton's First Law**
3. **Newton's Second Law**
4. **Newton's Third Law**
5. **Free-Body Diagrams**
6. **Friction**
7. **Translational Equilibrium**
8. **Atwood Machine**
9. **Circular Motion**
10. **Final Challenge**

---

## ✨ Key Features

### Interactive Physics Simulations
Users can modify physical parameters and observe how the results change in real time.

### Newton's Laws
Explore the relationship between force, mass, acceleration, and action-reaction pairs.

### Free-Body Diagrams
Visualize forces such as:

- Weight
- Normal force
- Applied force
- Friction

### Friction Simulator
Experiment with:

- Applied force
- Mass
- Coefficient of static friction
- Coefficient of kinetic friction
- Static and sliding states
- Breakaway threshold

### Translational Equilibrium
Understand balanced forces and zero acceleration using interactive force controls.

### Atwood Machine
Explore two connected masses with:

- Acceleration
- Tension
- Direction of motion
- Equal-mass equilibrium

### Circular Motion
Interact with:

- Radius
- Speed
- Mass
- Centripetal acceleration
- Centripetal force
- Angular velocity
- Period

### Worked Examples
Each major topic includes step-by-step worked examples to help students understand the calculation process.

### Concept Checks
Every section contains interactive questions with immediate feedback and explanations.

### Final Challenge
A 5-question assessment combines the concepts covered throughout the simulation and provides:

- Live score
- Progress tracking
- Instant feedback
- Percentage score
- Retry functionality
- Completion screen

---

## 🧮 Physics Models

The simulation uses standard mechanics equations including:

### Newton's Second Law

\[
\sum \vec{F} = m\vec{a}
\]

### Friction

\[
f_s \leq \mu_sN
\]

\[
f_k = \mu_kN
\]

### Translational Equilibrium

\[
\sum \vec{F}=0
\]

### Atwood Machine

\[
a=\frac{(m_A-m_B)g}{m_A+m_B}
\]

\[
T=\frac{2m_Am_Bg}{m_A+m_B}
\]

### Circular Motion

\[
a_c=\frac{v^2}{r}
\]

\[
F_c=\frac{mv^2}{r}
\]

\[
\omega=\frac{v}{r}
\]

\[
T=\frac{2\pi r}{v}
\]

---

## 🛠️ Tech Stack

- **React**
- **TypeScript**
- **Vite**
- **CSS**
- **KaTeX / LaTeX**
- **Lucide Icons**
- **Git & GitHub**
- **Vercel**

---

## 📁 Project Structure

```text
ForceLab/
│
├── public/
│
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   └── sections/
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## ⚙️ Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/ramakrishnagunturu561-del/web-development-assignment-2

# 2. Navigate into the project
cd web-development-assignment-2

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev

# 5. Build for production
npm run build
```

---

## 🌐 Deployment

Deployed on **Vercel**.

- Build command: `npm run build`
- Output directory: `dist`
- Framework preset: `Vite`

---

## 🧠 Design Decisions

**Why KaTeX instead of MathJax?**
I chose KaTeX because it renders math synchronously and purely to a string (via `katex.renderToString`), which means equations appear immediately on first paint with no layout shift. MathJax requires an async post-processing step that causes rendered pages to reflow — visually distracting in a simulation where equations update live. KaTeX's bundled output is also considerably smaller (~150 KB minified) compared to a full MathJax load (~600 KB+), and the React integration is one function call without any additional context providers or lifecycle hooks.

**Why localStorage for progress persistence?**
The target deployment is a fully static site on Vercel — no server, no database, no authentication. LocalStorage gives students persistence across page reloads without any infrastructure, and since this is a classroom-facing tool, in-session memory of completed sections is the most useful thing to preserve. The known limitation is that progress doesn't sync across browsers or devices: a student who works on a school Chromebook and then continues at home starts fresh. Accepting that trade-off was the right call for a zero-login-required tool.

**Why the predict-then-reveal pattern applies only to Newton's 2nd Law and the Atwood Machine — not all 8 sections?**
These two simulations have the clearest single-variable causal relationships: change one quantity (force, mass, m₁, m₂) and get a clean, unambiguous effect on acceleration and direction. That makes prediction questions answerable without ambiguity. In contrast, Friction has a non-linear static/kinetic threshold that produces counterintuitive step-changes; Circular Motion has three mutually-coupled variables (mass, velocity, radius); and Equilibrium resolves 2D vector sums that don't reduce to a single "up/down/same" answer. Adding prediction questions to those sections would have required either oversimplified questions or explanations too long to fit the interaction pattern.

**What was intentionally left out and why?**
There are no user accounts, no backend, and no server-side analytics. From the start the goal was a tool a student could open via a shared URL and start using immediately — any login or account step would add friction that hurts classroom adoption. Likewise, server-side progress storage would require infrastructure (database, auth service, API) that is unnecessary overhead for a single-chapter interactive module. Keeping the entire project as a static Vite build that deploys in seconds to Vercel was the deliberate architectural choice.

**One thing I would do differently with more time?**
The main `App.tsx` grew into a 5 750-line monolith that houses all section content directly rather than lazily importing each section. This was the fastest way to get everything working, but it means the entire chapter is bundled upfront. With more time I would split each section into a separately lazy-loaded route, which would cut initial bundle size and make the code significantly easier to maintain.