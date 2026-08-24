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