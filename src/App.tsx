import { useMemo, useState } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

type Section = {
  id: number;
  title: string;
  shortTitle: string;
  duration: string;
};

const sections: Section[] = [
  { id: 1, title: "Chapter Overview", shortTitle: "Overview", duration: "5 min" },
  { id: 2, title: "Newton's First Law", shortTitle: "Newton 1", duration: "8 min" },
  { id: 3, title: "Newton's Second Law", shortTitle: "Newton 2", duration: "10 min" },
  { id: 4, title: "Newton's Third Law", shortTitle: "Newton 3", duration: "8 min" },
  { id: 5, title: "Free-Body Diagrams", shortTitle: "FBD", duration: "10 min" },
  { id: 6, title: "Friction", shortTitle: "Friction", duration: "12 min" },
  { id: 7, title: "Translational Equilibrium", shortTitle: "Equilibrium", duration: "10 min" },
  { id: 8, title: "Atwood Machine", shortTitle: "Atwood", duration: "12 min" },
  { id: 9, title: "Uniform Circular Motion", shortTitle: "Circular Motion", duration: "10 min" },
  { id: 10, title: "Final Chapter Challenge", shortTitle: "Challenge", duration: "15 min" },
];

function Equation({
  expression,
  display = true,
}: {
  expression: string;
  display?: boolean;
}) {
  const html = useMemo(
    () =>
      katex.renderToString(expression, {
        throwOnError: false,
        displayMode: display,
      }),
    [expression, display]
  );

  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function App() {
  const [activeSection, setActiveSection] = useState(1);
  const [completed, setCompleted] = useState<number[]>([1]);
  const [mobileMenu, setMobileMenu] = useState(false);

  const progress = Math.round((completed.length / sections.length) * 100);

  const selectSection = (id: number) => {
    setActiveSection(id);
    setMobileMenu(false);
  };

  const markComplete = () => {
    if (!completed.includes(activeSection)) {
      setCompleted((previous) => [...previous, activeSection]);
    }

    if (activeSection < sections.length) {
      setActiveSection(activeSection + 1);
    }
  };

  return (
    <div className="app-shell">
      {mobileMenu && (
        <button
          className="mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">Σ</div>

          <div>
            <div className="brand-name">ForceLab</div>
            <div className="brand-subtitle">
              IB Physics • Chapter 2
            </div>
          </div>
        </div>

        <div className="sidebar-progress">
          <div className="progress-heading">
            <span>Chapter Progress</span>
            <strong>
              {completed.length}/{sections.length}
            </strong>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="progress-caption">
            {progress}% mastered
          </div>
        </div>

        <nav className="section-nav">
          <div className="nav-label">CHAPTER 2</div>

          {sections.map((section) => {
            const isActive = activeSection === section.id;
            const isComplete = completed.includes(section.id);

            return (
              <button
                key={section.id}
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={() => selectSection(section.id)}
              >
                <span
                  className={`nav-number ${
                    isComplete ? "complete" : ""
                  }`}
                >
                  {isComplete ? "✓" : section.id}
                </span>

                <span className="nav-content">
                  <span className="nav-title">
                    {section.shortTitle}
                  </span>
                  <span className="nav-duration">
                    {section.duration}
                  </span>
                </span>

                {isActive && (
                  <span className="nav-arrow">›</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="course-label">
            IB DIPLOMA PHYSICS
          </div>

          <div className="course-small">
            Forces & Newton's Laws
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button
            className="menu-button"
            onClick={() => setMobileMenu(true)}
            aria-label="Open navigation"
          >
            ☰
          </button>

          <div className="topbar-title">
            <span className="topbar-kicker">
              INTERACTIVE PHYSICS LAB
            </span>

            <span className="topbar-main">
              Forces & Newton's Laws
            </span>
          </div>

          <div className="topbar-progress">
            <span>Progress</span>
            <strong>
              {completed.length}/{sections.length}
            </strong>
          </div>
        </header>

        <div className="content-container">
          <div className="breadcrumb">
            IB Diploma Physics <span>/</span> Chapter 2{" "}
            <span>/</span> {sections[activeSection - 1].title}
          </div>

          {activeSection === 1 && (
            <Overview
              onStart={() => selectSection(2)}
              completed={completed}
            />
          )}

          {activeSection === 2 && (
            <NewtonFirstLaw
              onComplete={markComplete}
              onBack={() => selectSection(1)}
            />
          )}

          {activeSection === 3 && (
            <NewtonSecondLaw
              onComplete={markComplete}
              onBack={() => selectSection(2)}
            />
          )}

          {activeSection === 4 && (
            <NewtonThirdLaw
              onComplete={markComplete}
              onBack={() => selectSection(3)}
            />
          )}

          {activeSection === 5 && (
            <FreeBodyDiagram
              onComplete={markComplete}
              onBack={() => selectSection(4)}
            />
          )}

          {activeSection === 6 && (
            <FrictionLesson
              onComplete={markComplete}
              onBack={() => selectSection(5)}
            />
          )}

          {activeSection === 7 && (
            <EquilibriumLesson
              onComplete={markComplete}
              onBack={() => selectSection(6)}
            />
          )}

          {activeSection === 8 && (
            <AtwoodMachineLesson
              onComplete={markComplete}
              onBack={() => selectSection(7)}
            />
          )}

          {activeSection === 9 && (
            <CircularMotionLesson
              onComplete={markComplete}
              onBack={() => selectSection(8)}
            />
          )}

          {activeSection === 10 && (
            <FinalChallenge
              onComplete={markComplete}
              onBack={() => selectSection(9)}
            />
          )}

          {activeSection > 10 && (
            <PlaceholderSection
              section={sections[activeSection - 1]}
              onComplete={markComplete}
              onBack={() =>
                selectSection(
                  Math.max(1, activeSection - 1)
                )
              }
            />
          )}
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   SECTION 1 — OVERVIEW
========================================================= */

function Overview({
  onStart,
  completed,
}: {
  onStart: () => void;
  completed: number[];
}) {
  const [pushForce, setPushForce] = useState(30);

  const friction = 30;
  const netForce = pushForce - friction;
  const balanced = Math.abs(netForce) < 0.5;

  return (
    <>
      <section className="hero-card">
        <div className="hero-eyebrow">
          IB PHYSICS • CHAPTER 2
        </div>

        <h1>
          Forces & <span>Newton's Laws</span>
        </h1>

        <p className="hero-description">
          Learn how forces create, change, and balance motion
          through interactive models, mathematical relationships,
          worked examples, and immediate self-assessment.
        </p>

        <div className="hero-actions">
          <button
            className="primary-button"
            onClick={onStart}
          >
            Start Learning <span>→</span>
          </button>

          <div className="mastery-status">
            <span className="status-dot" />
            {completed.length}/10 Sections Started
          </div>
        </div>
      </section>

      <section className="overview-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">
              LEARNING OBJECTIVES
            </span>

            <h2>What You Will Master</h2>
          </div>
        </div>

        <div className="objective-grid">
          <article className="objective-card">
            <span className="objective-number">01</span>
            <h3>Explain forces</h3>
            <p>
              Identify forces acting on an object and explain
              how the net force affects its motion.
            </p>
          </article>

          <article className="objective-card">
            <span className="objective-number">02</span>
            <h3>Use Newton's laws</h3>
            <p>
              Apply Newton's laws to solve physical situations
              rather than memorizing isolated formulas.
            </p>
          </article>

          <article className="objective-card">
            <span className="objective-number">03</span>
            <h3>Model systems</h3>
            <p>
              Construct free-body diagrams and choose a suitable
              system and coordinate direction.
            </p>
          </article>

          <article className="objective-card">
            <span className="objective-number">04</span>
            <h3>Predict motion</h3>
            <p>
              Connect force, mass, acceleration, friction,
              tension, and circular motion.
            </p>
          </article>
        </div>
      </section>

      <section className="overview-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">
              CORE CONCEPTS
            </span>

            <h2>Build the Mental Model</h2>
          </div>
        </div>

        <div className="concept-grid">
          <article className="concept-panel">
            <div className="concept-icon">ΣF</div>

            <div>
              <h3>Net Force</h3>

              <p>
                Forces are vectors. The acceleration depends on
                the vector sum of all external forces.
              </p>

              <div className="equation-box">
                <Equation expression="\sum \vec{F}=m\vec{a}" />
              </div>
            </div>
          </article>

          <article className="concept-panel">
            <div className="concept-icon">a</div>

            <div>
              <h3>Acceleration</h3>

              <p>
                A non-zero net force produces acceleration in
                the direction of the net force.
              </p>

              <div className="equation-box">
                <Equation expression="\vec{a}=\frac{\sum\vec{F}}{m}" />
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="interactive-overview">
        <div className="interactive-heading">
          <div>
            <span className="section-kicker">
              TRY IT BEFORE YOU LEARN IT
            </span>

            <h2>Can you balance the forces?</h2>

            <p>
              Adjust the applied force. Can you make the net
              force equal to zero?
            </p>
          </div>

          <div
            className={`result-badge ${
              balanced ? "balanced" : ""
            }`}
          >
            {balanced
              ? "FORCES BALANCED"
              : "NET FORCE ≠ 0"}
          </div>
        </div>

        <div className="force-lab">
          <div className="force-stage">
            <div className="stage-axis">
              <span>←</span>
              <span>horizontal direction</span>
              <span>→</span>
            </div>

            <div className="force-object">
              <div className="object-block">m</div>

              <div
                className="force-arrow applied"
                style={{
                  width: `${Math.max(
                    25,
                    pushForce * 2.2
                  )}px`,
                }}
              >
                <span>F applied</span>
                <b>→</b>
              </div>

              <div
                className="force-arrow friction"
                style={{
                  width: `${friction * 2.2}px`,
                }}
              >
                <b>←</b>
                <span>friction</span>
              </div>
            </div>

            <div className="net-display">
              <span>Net force</span>

              <strong>
                {netForce > 0 ? "+" : ""}
                {netForce} N
              </strong>
            </div>
          </div>

          <div className="force-controls">
            <label htmlFor="force-slider">
              Applied force
              <strong>{pushForce} N</strong>
            </label>

            <input
              id="force-slider"
              type="range"
              min="0"
              max="60"
              value={pushForce}
              onChange={(event) =>
                setPushForce(
                  Number(event.target.value)
                )
              }
            />

            <div className="slider-labels">
              <span>0 N</span>
              <span>30 N = balanced</span>
              <span>60 N</span>
            </div>

            <div className="insight-box">
              <span>💡</span>

              <p>
                {balanced ? (
                  <>
                    <strong>Balanced!</strong> Since{" "}
                    <Equation
                      expression="\sum\vec{F}=0"
                      display={false}
                    />
                    , the acceleration is zero.
                  </>
                ) : (
                  <>
                    The forces do not balance. The object has
                    a net force of{" "}
                    <strong>{Math.abs(netForce)} N</strong>.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="two-column-section">
        <article className="misconception-card">
          <div className="card-label">
            COMMON MISCONCEPTION
          </div>

          <h2>
            “If an object is moving, there must be a force in
            the direction of motion.”
          </h2>

          <div className="answer-line">
            <span>Reality</span>

            <p>
              Motion does not require a net force. A net force
              is required to <strong>change</strong> velocity.
              If the net force is zero, an object can remain at
              rest or continue with constant velocity.
            </p>
          </div>
        </article>

        <article className="exam-tip-card">
          <div className="card-label">EXAM TIP</div>

          <h2>Always identify the system first.</h2>

          <p>
            Before writing an equation, decide which object or
            system you are analyzing. Then draw only the
            external forces acting on that system.
          </p>

          <div className="tip-sequence">
            <span>System</span>
            <b>→</b>
            <span>Forces</span>
            <b>→</b>
            <span>Net force</span>
            <b>→</b>
            <span>Motion</span>
          </div>
        </article>
      </section>

      <section className="mastery-strip">
        <div>
          <span className="section-kicker">
            CHAPTER ROADMAP
          </span>

          <h2>
            From forces → equations → physical models
          </h2>

          <p>
            The following sections progressively build from
            Newton's laws to free-body diagrams, friction,
            connected systems, and circular motion.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={onStart}
        >
          Begin Newton's First Law
          <span>→</span>
        </button>
      </section>
    </>
  );
}

/* =========================================================
   SECTION 2 — NEWTON'S FIRST LAW
========================================================= */

function NewtonFirstLaw({
  onComplete,
  onBack,
}: {
  onComplete: () => void;
  onBack: () => void;
}) {
  const [appliedForce, setAppliedForce] = useState(0);
  const [exampleStep, setExampleStep] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);

  const objectMoving = appliedForce > 0;
  const acceleration = appliedForce / 5;

  return (
    <section className="lesson-page first-law-page">
      <div className="lesson-header">
        <span className="section-kicker">
          SECTION 02 • 8 MIN
        </span>

        <h1>Newton's First Law</h1>

        <p>
          An object remains at rest or continues moving with
          constant velocity unless acted on by a non-zero net
          external force.
        </p>
      </div>

      {/* Law statement */}
      <article className="law-card">
        <div className="law-symbol">I</div>

        <div>
          <span className="card-label">
            NEWTON'S FIRST LAW
          </span>

          <h2>The Law of Inertia</h2>

          <p>
            The key idea is not “objects need force to keep
            moving.” Instead, force is required to change an
            object's velocity.
          </p>

          <div className="large-equation">
            <Equation expression="\sum \vec{F}=0\quad\Longrightarrow\quad\vec{a}=0" />
          </div>

          <p className="equation-note">
            Zero net force means zero acceleration. The object's
            velocity therefore remains constant.
          </p>
        </div>
      </article>

      {/* Interactive */}
      <section className="lesson-section">
        <div className="lesson-section-heading">
          <div>
            <span className="section-kicker">
              INTERACTIVE MODEL
            </span>

            <h2>What happens when the net force changes?</h2>

            <p>
              Start with no applied force. Then gradually apply
              a force and observe what changes.
            </p>
          </div>

          <div className="live-pill">
            <span />
            LIVE MODEL
          </div>
        </div>

        <div className="first-law-simulator">
          <div className="motion-stage">
            <div className="stage-grid" />

            <div
              className={`motion-ball ${
                objectMoving ? "moving" : ""
              }`}
              style={{
                transform: `translateX(${
                  Math.min(appliedForce * 4, 180)
                }px)`,
              }}
            >
              <span>m</span>
            </div>

            <div className="ground-line" />

            <div className="velocity-label">
              v ={" "}
              <strong>
                {objectMoving
                  ? `${(acceleration * 2).toFixed(1)} m/s`
                  : "0.0 m/s"}
              </strong>
            </div>
          </div>

          <div className="simulator-controls">
            <div className="control-title">
              <span>Applied net force</span>
              <strong>{appliedForce} N</strong>
            </div>

            <input
              type="range"
              min="0"
              max="20"
              value={appliedForce}
              onChange={(event) =>
                setAppliedForce(
                  Number(event.target.value)
                )
              }
            />

            <div className="sim-scale">
              <span>0 N</span>
              <span>10 N</span>
              <span>20 N</span>
            </div>

            <div className="model-result">
              {appliedForce === 0 ? (
                <>
                  <span className="result-icon">✓</span>
                  <div>
                    <strong>No acceleration</strong>
                    <p>
                      With zero net force, velocity does not
                      change.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <span className="result-icon force">→</span>
                  <div>
                    <strong>Velocity is changing</strong>
                    <p>
                      A non-zero net force produces
                      acceleration.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Inertia cards */}
      <section className="lesson-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">
              THREE WAYS TO THINK ABOUT INERTIA
            </span>
            <h2>Rest, constant velocity, and changing velocity</h2>
          </div>
        </div>

        <div className="inertia-grid">
          <article className="inertia-card">
            <div className="inertia-number">01</div>
            <h3>Object at rest</h3>
            <p>
              If the net force is zero, an object initially at
              rest remains at rest.
            </p>

            <div className="small-equation">
              <Equation expression="v=0\quad\text{remains}\quad v=0" />
            </div>
          </article>

          <article className="inertia-card">
            <div className="inertia-number">02</div>
            <h3>Constant velocity</h3>
            <p>
              An object already moving continues with constant
              velocity when the net force is zero.
            </p>

            <div className="small-equation">
              <Equation expression="\vec{v}=\text{constant}" />
            </div>
          </article>

          <article className="inertia-card">
            <div className="inertia-number">03</div>
            <h3>Changing velocity</h3>
            <p>
              A non-zero net force causes acceleration, changing
              the object's velocity.
            </p>

            <div className="small-equation">
              <Equation expression="\sum\vec{F}\ne0\Rightarrow\vec{a}\ne0" />
            </div>
          </article>
        </div>
      </section>

      {/* Worked example */}
      <section className="worked-example">
        <div className="worked-header">
          <div>
            <span className="section-kicker">
              WORKED EXAMPLE
            </span>

            <h2>Is the cyclist accelerating?</h2>
          </div>

          <span className="example-tag">
            STEP-BY-STEP
          </span>
        </div>

        <div className="problem-box">
          <p>
            A cyclist travels in a straight line at a constant
            velocity of{" "}
            <strong>8.0 m/s</strong>. The total forward force
            and total resistive force are both{" "}
            <strong>120 N</strong>.
          </p>

          <p className="question-text">
            What is the cyclist's acceleration?
          </p>
        </div>

        <div className="steps-container">
          <ExampleStep
            number={1}
            title="Identify the net force"
            visible={exampleStep >= 1}
          >
            The forward and resistive forces have equal
            magnitudes and opposite directions.
            <div className="step-equation">
              <Equation expression="\sum F=120-120=0\text{ N}" />
            </div>
          </ExampleStep>

          <ExampleStep
            number={2}
            title="Apply Newton's First Law"
            visible={exampleStep >= 2}
          >
            Since the net force is zero, the acceleration must
            also be zero.
            <div className="step-equation">
              <Equation expression="\sum\vec F=0\Rightarrow\vec a=0" />
            </div>
          </ExampleStep>

          <ExampleStep
            number={3}
            title="State the physical meaning"
            visible={exampleStep >= 3}
          >
            The cyclist continues moving at constant velocity.
            Constant velocity means both constant speed and
            constant direction.
          </ExampleStep>
        </div>

        {exampleStep < 3 ? (
          <button
            className="primary-button reveal-button"
            onClick={() =>
              setExampleStep((step) => step + 1)
            }
          >
            Reveal Step {exampleStep + 1}
            <span>→</span>
          </button>
        ) : (
          <div className="solution-complete">
            ✓ Complete solution revealed
          </div>
        )}
      </section>

      {/* Misconception */}
      <section className="two-column-section">
        <article className="misconception-card">
          <div className="card-label">
            COMMON MISCONCEPTION
          </div>

          <h2>
            “A moving object needs a forward force to keep
            moving.”
          </h2>

          <div className="answer-line">
            <span>FALSE</span>

            <p>
              If all forces balance, an object can continue
              moving at constant velocity. A net force is
              required to change velocity, not to maintain it.
            </p>
          </div>
        </article>

        <article className="exam-tip-card">
          <div className="card-label">
            EXAM STRATEGY
          </div>

          <h2>Look for the phrase “constant velocity.”</h2>

          <p>
            When a problem says an object moves with constant
            velocity, immediately recognize that its acceleration
            is zero and therefore the net force is zero.
          </p>

          <div className="tip-equation">
            <Equation expression="\vec v=\text{constant}\Rightarrow\vec a=0\Rightarrow\sum\vec F=0" />
          </div>
        </article>
      </section>

      {/* Quiz */}
      <section className="quiz-card">
        <div className="quiz-header">
          <div>
            <span className="section-kicker">
              CHECK YOURSELF
            </span>

            <h2>Quick Concept Check</h2>
          </div>

          <span className="question-number">
            1 QUESTION
          </span>
        </div>

        <p className="quiz-question">
          A hockey puck slides across nearly frictionless ice
          with constant velocity. Which statement is correct?
        </p>

        <div className="quiz-options">
          {[
            {
              id: "a",
              text: "There must be a constant forward force.",
            },
            {
              id: "b",
              text: "The net force on the puck is approximately zero.",
            },
            {
              id: "c",
              text: "The puck must be accelerating forward.",
            },
            {
              id: "d",
              text: "There is no force of any kind acting on the puck.",
            },
          ].map((option) => {
            const selected = answer === option.id;

            return (
              <button
                key={option.id}
                className={`quiz-option ${
                  selected ? "selected" : ""
                } ${
                  selected && option.id === "b"
                    ? "correct"
                    : ""
                } ${
                  selected && option.id !== "b"
                    ? "incorrect"
                    : ""
                }`}
                onClick={() => setAnswer(option.id)}
              >
                <span className="option-letter">
                  {option.id.toUpperCase()}
                </span>

                <span>{option.text}</span>

                {selected && (
                  <span className="option-status">
                    {option.id === "b" ? "✓" : "×"}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {answer && (
          <div
            className={`quiz-feedback ${
              answer === "b" ? "feedback-correct" : ""
            }`}
          >
            <strong>
              {answer === "b"
                ? "Correct!"
                : "Not quite — think about the net force."}
            </strong>

            <p>
              Constant velocity means zero acceleration. By
              Newton's First Law, zero acceleration corresponds
              to zero net force.
            </p>

            <div>
              <Equation expression="\vec a=0\Rightarrow\sum\vec F=0" />
            </div>
          </div>
        )}
      </section>

      {/* Navigation */}
      <div className="lesson-actions">
        <button
          className="secondary-button"
          onClick={onBack}
        >
          ← Chapter Overview
        </button>

        <button
          className="primary-button"
          onClick={onComplete}
        >
          Complete & Continue
          <span>→</span>
        </button>
      </div>
    </section>
  );
}

function ExampleStep({
  number,
  title,
  visible,
  children,
}: {
  number: number;
  title: string;
  visible: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`example-step ${
        visible ? "step-visible" : "step-hidden"
      }`}
    >
      <div className="step-number">{number}</div>

      <div className="step-content">
        <h3>{title}</h3>

        {visible && <div>{children}</div>}
      </div>
    </div>
  );
}

/* =========================================================
   SECTION 3 — NEWTON'S SECOND LAW
========================================================= */

function NewtonSecondLaw({
  onComplete,
  onBack,
}: {
  onComplete: () => void;
  onBack: () => void;
}) {
  const [force, setForce] = useState(20);
  const [mass, setMass] = useState(5);
  const [exampleStep, setExampleStep] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);

  const acceleration = force / mass;

  const accelerationLevel = Math.min(
    acceleration / 8,
    1
  );

  return (
    <section className="lesson-page second-law-page">
      {/* Header */}

      <div className="lesson-header">
        <span className="section-kicker">
          SECTION 03 • 10 MIN
        </span>

        <h1>Newton's Second Law</h1>

        <p>
          The acceleration of an object depends directly on
          the net force acting on it and inversely on its mass.
        </p>
      </div>

      {/* Main law */}

      <article className="law-card second-law-card">
        <div className="law-symbol">II</div>

        <div>
          <span className="card-label">
            NEWTON'S SECOND LAW
          </span>

          <h2>Force causes acceleration</h2>

          <p>
            The acceleration of an object points in the
            direction of the net force. For a constant mass,
            increasing the net force increases acceleration.
          </p>

          <div className="large-equation">
            <Equation expression="\sum \vec{F}=m\vec{a}" />
          </div>

          <div className="equation-forms">
            <div>
              <span>Acceleration</span>
              <Equation
                expression="a=\frac{\sum F}{m}"
                display={false}
              />
            </div>

            <div>
              <span>Net Force</span>
              <Equation
                expression="\sum F=ma"
                display={false}
              />
            </div>

            <div>
              <span>Mass</span>
              <Equation
                expression="m=\frac{\sum F}{a}"
                display={false}
              />
            </div>
          </div>
        </div>
      </article>

      {/* Interactive simulator */}

      <section className="lesson-section">
        <div className="lesson-section-heading">
          <div>
            <span className="section-kicker">
              INTERACTIVE MODEL
            </span>

            <h2>Explore F, m, and a</h2>

            <p>
              Change the force and mass. Watch the acceleration
              update instantly.
            </p>
          </div>

          <div className="live-pill">
            <span />
            REAL-TIME PHYSICS
          </div>
        </div>

        <div className="second-law-simulator">
          <div className="acceleration-stage">
            <div className="stage-grid" />

            <div className="force-vector">
              <span>F</span>
              <div
                className="vector-line"
                style={{
                  width: `${Math.max(
                    45,
                    force * 4
                  )}px`,
                }}
              >
                <b>→</b>
              </div>
            </div>

            <div
              className="mass-object"
              style={{
                width: `${70 + mass * 7}px`,
                height: `${70 + mass * 7}px`,
              }}
            >
              <span>{mass.toFixed(1)} kg</span>
            </div>

            <div className="acceleration-indicator">
              <span>acceleration</span>

              <strong>
                {acceleration.toFixed(2)} m/s²
              </strong>
            </div>

            <div className="acceleration-meter">
              <div
                className="acceleration-meter-fill"
                style={{
                  width: `${accelerationLevel * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="physics-controls">
            <div className="physics-control">
              <label htmlFor="force-control">
                <span>Net force</span>
                <strong>{force} N</strong>
              </label>

              <input
                id="force-control"
                type="range"
                min="0"
                max="40"
                step="1"
                value={force}
                onChange={(event) =>
                  setForce(
                    Number(event.target.value)
                  )
                }
              />

              <div className="control-scale">
                <span>0 N</span>
                <span>20 N</span>
                <span>40 N</span>
              </div>
            </div>

            <div className="physics-control">
              <label htmlFor="mass-control">
                <span>Mass</span>
                <strong>{mass.toFixed(1)} kg</strong>
              </label>

              <input
                id="mass-control"
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={mass}
                onChange={(event) =>
                  setMass(
                    Number(event.target.value)
                  )
                }
              />

              <div className="control-scale">
                <span>1 kg</span>
                <span>5 kg</span>
                <span>10 kg</span>
              </div>
            </div>

            <div className="calculation-card">
              <div className="calculation-title">
                LIVE CALCULATION
              </div>

              <div className="calculation-equation">
                <Equation
                  expression={`a=\\frac{${force}}{${mass.toFixed(
                    1
                  )}}=${acceleration.toFixed(2)}\\;\\mathrm{m/s^2}`}
                />
              </div>
            </div>

            <div className="physics-insight">
              <span>💡</span>

              <p>
                {force === 0 ? (
                  <>
                    With zero net force, acceleration is{" "}
                    <strong>zero</strong>.
                  </>
                ) : mass > 7 ? (
                  <>
                    A larger mass produces a{" "}
                    <strong>smaller acceleration</strong>
                    for the same force.
                  </>
                ) : (
                  <>
                    Increasing the net force increases the
                    object's <strong>acceleration</strong>.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Relationship cards */}

      <section className="lesson-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">
              PHYSICS RELATIONSHIPS
            </span>

            <h2>What happens when one variable changes?</h2>
          </div>
        </div>

        <div className="relationship-grid">
          <article className="relationship-card">
            <div className="relationship-icon">↑F</div>

            <h3>Increase force</h3>

            <p>
              Keep mass constant and increase the net force.
              Acceleration increases proportionally.
            </p>

            <div className="relationship-equation">
              <Equation expression="F\uparrow\Rightarrow a\uparrow" />
            </div>

            <span className="relationship-label">
              DIRECT RELATIONSHIP
            </span>
          </article>

          <article className="relationship-card">
            <div className="relationship-icon">↑m</div>

            <h3>Increase mass</h3>

            <p>
              Keep force constant and increase mass.
              Acceleration decreases.
            </p>

            <div className="relationship-equation">
              <Equation expression="m\uparrow\Rightarrow a\downarrow" />
            </div>

            <span className="relationship-label">
              INVERSE RELATIONSHIP
            </span>
          </article>

          <article className="relationship-card">
            <div className="relationship-icon">
              F = ma
            </div>

            <h3>Same acceleration</h3>

            <p>
              Objects with larger mass require a larger net
              force to produce the same acceleration.
            </p>

            <div className="relationship-equation">
              <Equation expression="F\propto m" />
            </div>

            <span className="relationship-label">
              SAME a
            </span>
          </article>
        </div>
      </section>

      {/* Worked example */}

      <section className="worked-example second-law-example">
        <div className="worked-header">
          <div>
            <span className="section-kicker">
              WORKED EXAMPLE
            </span>

            <h2>Calculate the acceleration</h2>
          </div>

          <span className="example-tag">
            STEP-BY-STEP
          </span>
        </div>

        <div className="problem-box">
          <p>
            A{" "}
            <strong>4.0 kg</strong> box is pushed horizontally
            by a net force of{" "}
            <strong>20 N</strong>.
          </p>

          <p className="question-text">
            Calculate the acceleration of the box.
          </p>
        </div>

        <div className="steps-container">
          <ExampleStep
            number={1}
            title="Write the equation"
            visible={exampleStep >= 1}
          >
            Start with Newton's Second Law.

            <div className="step-equation">
              <Equation expression="\sum F=ma" />
            </div>
          </ExampleStep>

          <ExampleStep
            number={2}
            title="Rearrange for acceleration"
            visible={exampleStep >= 2}
          >
            Divide both sides by mass.

            <div className="step-equation">
              <Equation expression="a=\frac{\sum F}{m}" />
            </div>
          </ExampleStep>

          <ExampleStep
            number={3}
            title="Substitute the values"
            visible={exampleStep >= 3}
          >
            Substitute 20 N for force and 4.0 kg for mass.

            <div className="step-equation">
              <Equation expression="a=\frac{20}{4.0}" />
            </div>
          </ExampleStep>

          <ExampleStep
            number={4}
            title="Calculate and state the answer"
            visible={exampleStep >= 4}
          >
            Therefore:

            <div className="step-equation">
              <Equation expression="a=5.0\\;\\mathrm{m/s^2}" />
            </div>
          </ExampleStep>
        </div>

        {exampleStep < 4 ? (
          <button
            className="primary-button reveal-button"
            onClick={() =>
              setExampleStep((step) => step + 1)
            }
          >
            Reveal Step {exampleStep + 1}
            <span>→</span>
          </button>
        ) : (
          <div className="solution-complete">
            ✓ Complete solution revealed
          </div>
        )}
      </section>

      {/* Misconception */}

      <section className="two-column-section">
        <article className="misconception-card">
          <div className="card-label">
            COMMON MISCONCEPTION
          </div>

          <h2>
            “A larger force always means a larger
            acceleration.”
          </h2>

          <div className="answer-line">
            <span>NOT ALWAYS</span>

            <p>
              Acceleration depends on both force and mass.
              A large force acting on a very large mass may
              produce the same acceleration as a smaller force
              acting on a smaller mass.
            </p>
          </div>
        </article>

        <article className="exam-tip-card">
          <div className="card-label">
            EXAM STRATEGY
          </div>

          <h2>Check your units.</h2>

          <p>
            Force should be measured in newtons and mass in
            kilograms. The resulting acceleration is measured
            in metres per second squared.
          </p>

          <div className="tip-equation">
            <Equation expression="\frac{\text{N}}{\text{kg}}=\text{m/s}^2" />
          </div>
        </article>
      </section>

      {/* Quiz */}

      <section className="quiz-card">
        <div className="quiz-header">
          <div>
            <span className="section-kicker">
              CHECK YOURSELF
            </span>

            <h2>Quick Concept Check</h2>
          </div>

          <span className="question-number">
            1 QUESTION
          </span>
        </div>

        <p className="quiz-question">
          A 2 kg object experiences a net force of 10 N.
          What is its acceleration?
        </p>

        <div className="quiz-options">
          {[
            {
              id: "a",
              text: "2 m/s²",
            },
            {
              id: "b",
              text: "5 m/s²",
            },
            {
              id: "c",
              text: "10 m/s²",
            },
            {
              id: "d",
              text: "20 m/s²",
            },
          ].map((option) => {
            const selected = answer === option.id;

            return (
              <button
                key={option.id}
                className={`quiz-option ${
                  selected ? "selected" : ""
                } ${
                  selected && option.id === "b"
                    ? "correct"
                    : ""
                } ${
                  selected && option.id !== "b"
                    ? "incorrect"
                    : ""
                }`}
                onClick={() => setAnswer(option.id)}
              >
                <span className="option-letter">
                  {option.id.toUpperCase()}
                </span>

                <span>{option.text}</span>

                {selected && (
                  <span className="option-status">
                    {option.id === "b" ? "✓" : "×"}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {answer && (
          <div
            className={`quiz-feedback ${
              answer === "b"
                ? "feedback-correct"
                : ""
            }`}
          >
            <strong>
              {answer === "b"
                ? "Correct!"
                : "Not quite."}
            </strong>

            <p>
              Use Newton's Second Law:
            </p>

            <div>
              <Equation expression="a=\frac{F}{m}=\frac{10}{2}=5\\;\\mathrm{m/s^2}" />
            </div>
          </div>
        )}
      </section>

      {/* Bottom navigation */}

      <div className="lesson-actions">
        <button
          className="secondary-button"
          onClick={onBack}
        >
          ← Newton's First Law
        </button>

        <button
          className="primary-button"
          onClick={onComplete}
        >
          Complete & Continue
          <span>→</span>
        </button>
      </div>
    </section>
  );
}

/* =========================================================
   SECTION 4 — NEWTON'S THIRD LAW
========================================================= */

function NewtonThirdLaw({
  onComplete,
  onBack,
}: {
  onComplete: () => void;
  onBack: () => void;
}) {
  const [force, setForce] = useState(50);
  const [answer, setAnswer] = useState<string | null>(null);
  const [exampleStep, setExampleStep] = useState(0);

  return (
    <section className="lesson-page third-law-page">
      <div className="lesson-header">
        <span className="section-kicker">
          SECTION 04 • 8 MIN
        </span>

        <h1>Newton's Third Law</h1>

        <p>
          When two objects interact, they exert forces on each
          other that are equal in magnitude and opposite in
          direction.
        </p>
      </div>

      <article className="law-card">
        <div className="law-symbol">III</div>

        <div>
          <span className="card-label">
            NEWTON'S THIRD LAW
          </span>

          <h2>Forces always come in pairs</h2>

          <p>
            If object A exerts a force on object B, object B
            simultaneously exerts a force of equal magnitude
            and opposite direction on object A.
          </p>

          <div className="large-equation">
            <Equation expression="\vec F_{A\rightarrow B}=-\vec F_{B\rightarrow A}" />
          </div>

          <p className="equation-note">
            The two forces act on different objects. Therefore,
            they do not cancel each other on a single free-body
            diagram.
          </p>
        </div>
      </article>

      <section className="lesson-section">
        <div className="lesson-section-heading">
          <div>
            <span className="section-kicker">
              INTERACTIVE MODEL
            </span>

            <h2>Push against another object</h2>

            <p>
              Increase the interaction force and observe both
              sides of the action–reaction pair.
            </p>
          </div>

          <div className="live-pill">
            <span />
            ACTION ↔ REACTION
          </div>
        </div>

        <div className="third-law-simulator">
          <div className="third-law-stage">
            <div className="stage-grid" />

            <div className="interaction-label">
              <span>Object A</span>
              <b>interaction</b>
              <span>Object B</span>
            </div>

            <div className="third-objects">
              <div className="third-object object-a">
                <span>A</span>

                <div
                  className="third-arrow arrow-right"
                  style={{
                    width: `${Math.max(35, force * 2.1)}px`,
                  }}
                >
                  <span>F A→B</span>
                  <b>→</b>
                </div>
              </div>

              <div className="third-object object-b">
                <span>B</span>

                <div
                  className="third-arrow arrow-left"
                  style={{
                    width: `${Math.max(35, force * 2.1)}px`,
                  }}
                >
                  <b>←</b>
                  <span>F B→A</span>
                </div>
              </div>
            </div>

            <div className="equal-forces">
              <span>{force} N</span>
              <div>=</div>
              <span>{force} N</span>
            </div>
          </div>

          <div className="third-law-controls">
            <div className="control-title">
              <span>Interaction force</span>
              <strong>{force} N</strong>
            </div>

            <input
              type="range"
              min="10"
              max="80"
              value={force}
              onChange={(event) =>
                setForce(Number(event.target.value))
              }
            />

            <div className="control-scale">
              <span>10 N</span>
              <span>45 N</span>
              <span>80 N</span>
            </div>

            <div className="pair-result">
              <div className="pair-row">
                <span>A → B</span>
                <strong>{force} N</strong>
              </div>

              <div className="pair-row">
                <span>B → A</span>
                <strong>{force} N</strong>
              </div>

              <div className="pair-rule">
                <Equation expression="|\vec F_{A\rightarrow B}|=|\vec F_{B\rightarrow A}|" />
              </div>
            </div>

            <div className="physics-insight">
              <span>💡</span>

              <p>
                The forces are equal and opposite, but they act
                on <strong>different objects</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="lesson-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">
              THE IMPORTANT DISTINCTION
            </span>

            <h2>Why don't the forces cancel?</h2>
          </div>
        </div>

        <div className="third-law-grid">
          <article className="third-law-card">
            <div className="third-law-card-number">01</div>

            <h3>Equal magnitude</h3>

            <p>
              The two interaction forces always have the same
              magnitude.
            </p>

            <div className="small-equation">
              <Equation expression="F_1=F_2" />
            </div>
          </article>

          <article className="third-law-card">
            <div className="third-law-card-number">02</div>

            <h3>Opposite direction</h3>

            <p>
              Their vector directions are opposite to one
              another.
            </p>

            <div className="small-equation">
              <Equation expression="\vec F_1=-\vec F_2" />
            </div>
          </article>

          <article className="third-law-card">
            <div className="third-law-card-number">03</div>

            <h3>Different objects</h3>

            <p>
              Each force acts on a different object, so they
              cannot cancel in one object's force equation.
            </p>

            <div className="small-equation">
              <Equation expression="A\neq B" />
            </div>
          </article>
        </div>
      </section>

      <section className="worked-example">
        <div className="worked-header">
          <div>
            <span className="section-kicker">
              WORKED EXAMPLE
            </span>

            <h2>Walking and the ground</h2>
          </div>

          <span className="example-tag">
            STEP-BY-STEP
          </span>
        </div>

        <div className="problem-box">
          <p>
            A student pushes backward on the ground with a
            horizontal force of <strong>150 N</strong>.
          </p>

          <p className="question-text">
            What force does the ground exert on the student?
          </p>
        </div>

        <div className="steps-container">
          <ExampleStep
            number={1}
            title="Identify the interaction"
            visible={exampleStep >= 1}
          >
            The student and the ground interact through a
            horizontal contact force.
          </ExampleStep>

          <ExampleStep
            number={2}
            title="Apply Newton's Third Law"
            visible={exampleStep >= 2}
          >
            The ground exerts an equal and opposite force on
            the student.

            <div className="step-equation">
              <Equation expression="\vec F_{\text{student}\rightarrow\text{ground}}=-\vec F_{\text{ground}\rightarrow\text{student}}" />
            </div>
          </ExampleStep>

          <ExampleStep
            number={3}
            title="Calculate the reaction force"
            visible={exampleStep >= 3}
          >
            Therefore, the ground pushes forward on the student
            with a magnitude of 150 N.

            <div className="step-equation">
              <Equation expression="F_{\text{ground}\rightarrow\text{student}}=150\\;N" />
            </div>
          </ExampleStep>
        </div>

        {exampleStep < 3 ? (
          <button
            className="primary-button reveal-button"
            onClick={() =>
              setExampleStep((step) => step + 1)
            }
          >
            Reveal Step {exampleStep + 1}
            <span>→</span>
          </button>
        ) : (
          <div className="solution-complete">
            ✓ Complete solution revealed
          </div>
        )}
      </section>

      <section className="two-column-section">
        <article className="misconception-card">
          <div className="card-label">
            COMMON MISCONCEPTION
          </div>

          <h2>
            “The stronger object exerts the bigger force.”
          </h2>

          <div className="answer-line">
            <span>FALSE</span>

            <p>
              Newton's Third Law says the interaction forces
              have equal magnitude. Different masses may have
              different accelerations, but the interaction force
              pair remains equal and opposite.
            </p>
          </div>
        </article>

        <article className="exam-tip-card">
          <div className="card-label">
            EXAM STRATEGY
          </div>

          <h2>Ask two questions.</h2>

          <p>
            First: “Who exerts the force?” Second: “Who
            experiences the force?” If the two answers are
            reversed, you have probably found a Third Law pair.
          </p>

          <div className="tip-sequence">
            <span>Object A</span>
            <b>→</b>
            <span>force on B</span>
            <b>↔</b>
            <span>force on A</span>
          </div>
        </article>
      </section>

      <section className="quiz-card">
        <div className="quiz-header">
          <div>
            <span className="section-kicker">
              CHECK YOURSELF
            </span>

            <h2>Quick Concept Check</h2>
          </div>

          <span className="question-number">
            1 QUESTION
          </span>
        </div>

        <p className="quiz-question">
          A book rests on a table. Which statement correctly
          describes a Newton's Third Law pair?
        </p>

        <div className="quiz-options">
          {[
            {
              id: "a",
              text: "The book's weight and the table's normal force.",
            },
            {
              id: "b",
              text: "The force of the book on the table and the force of the table on the book.",
            },
            {
              id: "c",
              text: "The book's weight and the book's acceleration.",
            },
            {
              id: "d",
              text: "The normal force and the book's mass.",
            },
          ].map((option) => {
            const selected = answer === option.id;

            return (
              <button
                key={option.id}
                className={`quiz-option ${
                  selected ? "selected" : ""
                } ${
                  selected && option.id === "b"
                    ? "correct"
                    : ""
                } ${
                  selected && option.id !== "b"
                    ? "incorrect"
                    : ""
                }`}
                onClick={() => setAnswer(option.id)}
              >
                <span className="option-letter">
                  {option.id.toUpperCase()}
                </span>

                <span>{option.text}</span>

                {selected && (
                  <span className="option-status">
                    {option.id === "b" ? "✓" : "×"}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {answer && (
          <div
            className={`quiz-feedback ${
              answer === "b"
                ? "feedback-correct"
                : ""
            }`}
          >
            <strong>
              {answer === "b"
                ? "Correct!"
                : "Not quite."}
            </strong>

            <p>
              A Third Law pair acts on two different objects:
              the book pushes on the table and the table pushes
              back on the book.
            </p>

            <div>
              <Equation expression="\vec F_{book\rightarrow table}=-\vec F_{table\rightarrow book}" />
            </div>
          </div>
        )}
      </section>

      <div className="lesson-actions">
        <button
          className="secondary-button"
          onClick={onBack}
        >
          ← Newton's Second Law
        </button>

        <button
          className="primary-button"
          onClick={onComplete}
        >
          Complete & Continue
          <span>→</span>
        </button>
      </div>
    </section>
  );
}

/* =========================================================
   SECTION 5 — FREE-BODY DIAGRAMS
========================================================= */

function FreeBodyDiagram({
  onComplete,
  onBack,
}: {
  onComplete: () => void;
  onBack: () => void;
}) {
  const [forces, setForces] = useState({
    weight: true,
    normal: true,
    applied: true,
    friction: false,
  });

  const [applied, setApplied] = useState(20);
  const [friction, setFriction] = useState(8);
  const [answer, setAnswer] = useState<string | null>(null);
  const [exampleStep, setExampleStep] = useState(0);

  const toggleForce = (name: keyof typeof forces) => {
    setForces((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));
  };

  const horizontalForce =
    (forces.applied ? applied : 0) -
    (forces.friction ? friction : 0);

  const verticalForce =
    (forces.normal ? 50 : 0) -
    (forces.weight ? 50 : 0);

  const netForce = Math.sqrt(
    horizontalForce ** 2 + verticalForce ** 2
  );

  return (
    <section className="lesson-page fbd-page">
      <div className="lesson-header">
        <span className="section-kicker">
          SECTION 05 • 10 MIN
        </span>

        <h1>Free-Body Diagrams</h1>

        <p>
          Isolate an object, identify the external forces acting
          on it, and represent those forces with vectors.
        </p>
      </div>

      <article className="law-card">
        <div className="law-symbol">FBD</div>

        <div>
          <span className="card-label">
            CORE SKILL
          </span>

          <h2>Draw the forces, not the motion</h2>

          <p>
            A free-body diagram represents all external forces
            acting on one selected object. It does not show the
            object's path or velocity.
          </p>

          <div className="large-equation">
            <Equation expression="\sum\vec F=\vec F_1+\vec F_2+\vec F_3+\cdots" />
          </div>

          <p className="equation-note">
            Once the forces are identified, resolve them into
            components and calculate the net force.
          </p>
        </div>
      </article>

      <section className="lesson-section">
        <div className="lesson-section-heading">
          <div>
            <span className="section-kicker">
              INTERACTIVE FBD BUILDER
            </span>

            <h2>Build the free-body diagram</h2>

            <p>
              Toggle forces on and off and change their
              magnitudes.
            </p>
          </div>

          <div className="live-pill">
            <span />
            LIVE FBD
          </div>
        </div>

        <div className="fbd-builder">
          <div className="fbd-stage">
            <div className="stage-grid" />

            <div className="fbd-vector vector-up">
              {forces.normal && (
                <>
                  <span>Normal</span>
                  <b>↑</b>
                </>
              )}
            </div>

            <div className="fbd-vector vector-down">
              {forces.weight && (
                <>
                  <b>↓</b>
                  <span>Weight</span>
                </>
              )}
            </div>

            <div className="fbd-vector vector-right">
              {forces.applied && (
                <>
                  <span>Applied</span>
                  <b>→</b>
                </>
              )}
            </div>

            <div className="fbd-vector vector-left">
              {forces.friction && (
                <>
                  <b>←</b>
                  <span>Friction</span>
                </>
              )}
            </div>

            <div className="fbd-block">
              <span>OBJECT</span>
            </div>

            <div className="fbd-axis">
              <span>x</span>
              <span>y</span>
            </div>
          </div>

          <div className="fbd-controls">
            <div className="fbd-control-heading">
              <span>FORCES</span>
              <small>Toggle visibility</small>
            </div>

            <ForceToggle
              label="Weight"
              value={forces.weight}
              onClick={() => toggleForce("weight")}
              colorClass="weight-force"
            />

            <ForceToggle
              label="Normal"
              value={forces.normal}
              onClick={() => toggleForce("normal")}
              colorClass="normal-force"
            />

            <ForceToggle
              label="Applied force"
              value={forces.applied}
              onClick={() => toggleForce("applied")}
              colorClass="applied-force"
            />

            <ForceToggle
              label="Friction"
              value={forces.friction}
              onClick={() => toggleForce("friction")}
              colorClass="friction-force"
            />

            {forces.applied && (
              <div className="fbd-slider">
                <label>
                  Applied force
                  <strong>{applied} N</strong>
                </label>

                <input
                  type="range"
                  min="0"
                  max="40"
                  value={applied}
                  onChange={(event) =>
                    setApplied(
                      Number(event.target.value)
                    )
                  }
                />
              </div>
            )}

            {forces.friction && (
              <div className="fbd-slider">
                <label>
                  Friction
                  <strong>{friction} N</strong>
                </label>

                <input
                  type="range"
                  min="0"
                  max="40"
                  value={friction}
                  onChange={(event) =>
                    setFriction(
                      Number(event.target.value)
                    )
                  }
                />
              </div>
            )}

            <div className="fbd-result">
              <span>NET FORCE</span>

              <strong>
                {netForce.toFixed(1)} N
              </strong>

              <p>
                Horizontal:{" "}
                {horizontalForce.toFixed(1)} N
                <br />
                Vertical:{" "}
                {verticalForce.toFixed(1)} N
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="lesson-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">
              HOW TO DRAW AN FBD
            </span>

            <h2>Four steps to a clean diagram</h2>
          </div>
        </div>

        <div className="fbd-steps">
          <article>
            <span>01</span>
            <h3>Choose the object</h3>
            <p>
              Decide which object you are analyzing and isolate
              it from its surroundings.
            </p>
          </article>

          <article>
            <span>02</span>
            <h3>Identify interactions</h3>
            <p>
              Look for gravity, contact, friction, tension, and
              other external interactions.
            </p>
          </article>

          <article>
            <span>03</span>
            <h3>Draw force vectors</h3>
            <p>
              Draw arrows from the object and label each force
              clearly.
            </p>
          </article>

          <article>
            <span>04</span>
            <h3>Calculate the net force</h3>
            <p>
              Resolve components and add the forces
              algebraically.
            </p>
          </article>
        </div>
      </section>

      <section className="worked-example">
        <div className="worked-header">
          <div>
            <span className="section-kicker">
              WORKED EXAMPLE
            </span>

            <h2>Box pulled across a floor</h2>
          </div>

          <span className="example-tag">
            STEP-BY-STEP
          </span>
        </div>

        <div className="problem-box">
          <p>
            A box is pulled horizontally with a force of{" "}
            <strong>30 N</strong>. Friction acts opposite the
            motion with a force of <strong>10 N</strong>.
            Its weight and normal force are both{" "}
            <strong>50 N</strong>.
          </p>

          <p className="question-text">
            Find the horizontal net force.
          </p>
        </div>

        <div className="steps-container">
          <ExampleStep
            number={1}
            title="Choose the horizontal forces"
            visible={exampleStep >= 1}
          >
            The applied force acts to the right and friction
            acts to the left.
          </ExampleStep>

          <ExampleStep
            number={2}
            title="Assign signs"
            visible={exampleStep >= 2}
          >
            Take right as positive.

            <div className="step-equation">
              <Equation expression="F_x=30-10" />
            </div>
          </ExampleStep>

          <ExampleStep
            number={3}
            title="Calculate the net force"
            visible={exampleStep >= 3}
          >
            <div className="step-equation">
              <Equation expression="F_x=20\\;N" />
            </div>

            The net force is 20 N to the right.
          </ExampleStep>
        </div>

        {exampleStep < 3 ? (
          <button
            className="primary-button reveal-button"
            onClick={() =>
              setExampleStep((step) => step + 1)
            }
          >
            Reveal Step {exampleStep + 1}
            <span>→</span>
          </button>
        ) : (
          <div className="solution-complete">
            ✓ Complete solution revealed
          </div>
        )}
      </section>

      <section className="two-column-section">
        <article className="misconception-card">
          <div className="card-label">
            COMMON MISCONCEPTION
          </div>

          <h2>
            “The direction the object is moving must be the
            direction of every force.”
          </h2>

          <div className="answer-line">
            <span>FALSE</span>

            <p>
              Forces can act in many directions. The object's
              acceleration depends on the vector sum of those
              forces.
            </p>
          </div>
        </article>

        <article className="exam-tip-card">
          <div className="card-label">
            EXAM STRATEGY
          </div>

          <h2>Never draw forces without a label.</h2>

          <p>
            A clear FBD should show the direction and name of
            each external force. Avoid drawing velocity arrows
            as if they were forces.
          </p>

          <div className="tip-sequence">
            <span>Object</span>
            <b>→</b>
            <span>Forces</span>
            <b>→</b>
            <span>Components</span>
            <b>→</b>
            <span>ΣF</span>
          </div>
        </article>
      </section>

      <section className="quiz-card">
        <div className="quiz-header">
          <div>
            <span className="section-kicker">
              CHECK YOURSELF
            </span>

            <h2>Quick Concept Check</h2>
          </div>

          <span className="question-number">
            1 QUESTION
          </span>
        </div>

        <p className="quiz-question">
          A box rests on a horizontal table. Which two forces
          should appear on the box's free-body diagram?
        </p>

        <div className="quiz-options">
          {[
            {
              id: "a",
              text: "Weight and normal force.",
            },
            {
              id: "b",
              text: "Weight and the table's weight.",
            },
            {
              id: "c",
              text: "Normal force and the table's acceleration.",
            },
            {
              id: "d",
              text: "Only the weight.",
            },
          ].map((option) => {
            const selected = answer === option.id;

            return (
              <button
                key={option.id}
                className={`quiz-option ${
                  selected ? "selected" : ""
                } ${
                  selected && option.id === "a"
                    ? "correct"
                    : ""
                } ${
                  selected && option.id !== "a"
                    ? "incorrect"
                    : ""
                }`}
                onClick={() => setAnswer(option.id)}
              >
                <span className="option-letter">
                  {option.id.toUpperCase()}
                </span>

                <span>{option.text}</span>

                {selected && (
                  <span className="option-status">
                    {option.id === "a" ? "✓" : "×"}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {answer && (
          <div
            className={`quiz-feedback ${
              answer === "a"
                ? "feedback-correct"
                : ""
            }`}
          >
            <strong>
              {answer === "a"
                ? "Correct!"
                : "Not quite."}
            </strong>

            <p>
              The box experiences its weight downward and the
              table's normal force upward.
            </p>

            <div>
              <Equation expression="\sum F_y=N-mg" />
            </div>
          </div>
        )}
      </section>

      <div className="lesson-actions">
        <button
          className="secondary-button"
          onClick={onBack}
        >
          ← Newton's Third Law
        </button>

        <button
          className="primary-button"
          onClick={onComplete}
        >
          Complete & Continue
          <span>→</span>
        </button>
      </div>
    </section>
  );
}

function ForceToggle({
  label,
  value,
  onClick,
  colorClass,
}: {
  label: string;
  value: boolean;
  onClick: () => void;
  colorClass: string;
}) {
  return (
    <button
      className={`force-toggle ${value ? "enabled" : ""}`}
      onClick={onClick}
    >
      <span className={`force-dot ${colorClass}`} />

      <span>{label}</span>

      <strong>{value ? "ON" : "OFF"}</strong>
    </button>
  );
}

/* =========================================================
   SECTION 6 — FRICTION
========================================================= */

function FrictionLesson({
  onComplete,
  onBack,
}: {
  onComplete: () => void;
  onBack: () => void;
}) {
  const [appliedForce, setAppliedForce] = useState(0);
  const [muStatic, setMuStatic] = useState(0.5);
  const [muKinetic, setMuKinetic] = useState(0.3);
  const [mass, setMass] = useState(10);
  const [answer, setAnswer] = useState<string | null>(null);
  const [exampleStep, setExampleStep] = useState(0);

  const g = 9.8;
  const normal = mass * g;

  const maxStatic = muStatic * normal;
  const kinetic = muKinetic * normal;

  const isMoving = appliedForce > maxStatic;
  const frictionForce = isMoving
    ? kinetic
    : appliedForce;

  const netForce = isMoving
    ? appliedForce - kinetic
    : 0;

  return (
    <section className="lesson-page friction-page">
      <div className="lesson-header">
        <span className="section-kicker">
          SECTION 06 • 12 MIN
        </span>

        <h1>Friction</h1>

        <p>
          Friction opposes relative motion between surfaces.
          Explore how static friction prevents motion and how
          kinetic friction acts once sliding begins.
        </p>
      </div>

      <article className="law-card">
        <div className="law-symbol">μ</div>

        <div>
          <span className="card-label">
            CORE CONCEPT
          </span>

          <h2>Static vs kinetic friction</h2>

          <p>
            Static friction adjusts to match the applied force
            until it reaches a maximum value. Once the object
            begins sliding, kinetic friction acts opposite the
            direction of motion.
          </p>

          <div className="friction-equations">
            <div className="large-equation">
              <Equation expression="f_s\leq\mu_sN" />
            </div>

            <div className="large-equation">
              <Equation expression="f_k=\mu_kN" />
            </div>
          </div>

          <p className="equation-note">
            Usually, the coefficient of static friction is
            greater than the coefficient of kinetic friction.
          </p>
        </div>
      </article>

      <section className="lesson-section">
        <div className="lesson-section-heading">
          <div>
            <span className="section-kicker">
              INTERACTIVE FRICTION LAB
            </span>

            <h2>Can you make the box move?</h2>

            <p>
              Increase the applied force. Watch static friction
              respond until the box breaks free.
            </p>
          </div>

          <div
            className={`live-pill ${
              isMoving ? "moving-pill" : ""
            }`}
          >
            <span />
            {isMoving ? "SLIDING" : "STATIC"}
          </div>
        </div>

        <div className="friction-simulator">
          <div className="friction-stage">
            <div className="stage-grid" />

            <div className="friction-surface" />

            <div
              className={`friction-box ${
                isMoving ? "friction-moving" : ""
              }`}
              style={{
                transform: `translateX(${
                  Math.min(
                    Math.max(appliedForce - maxStatic, 0) *
                      4,
                    180
                  )
                }px)`,
              }}
            >
              <span>{mass} kg</span>
            </div>

            <div
              className="friction-force-arrow applied-friction-arrow"
              style={{
                width: `${Math.max(
                  35,
                  appliedForce * 2
                )}px`,
              }}
            >
              <span>Applied</span>
              <b>→</b>
            </div>

            <div
              className="friction-force-arrow opposing-friction-arrow"
              style={{
                width: `${Math.max(
                  35,
                  frictionForce * 2
                )}px`,
              }}
            >
              <b>←</b>
              <span>Friction</span>
            </div>

            <div className="friction-status">
              {isMoving ? (
                <>
                  <strong>Object is sliding</strong>
                  <span>
                    Net force = {netForce.toFixed(1)} N
                  </span>
                </>
              ) : (
                <>
                  <strong>Object remains at rest</strong>
                  <span>
                    Static friction ={" "}
                    {frictionForce.toFixed(1)} N
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="friction-controls">
            <div className="friction-control">
              <label>
                Applied force
                <strong>
                  {appliedForce.toFixed(1)} N
                </strong>
              </label>

              <input
                type="range"
                min="0"
                max="80"
                step="1"
                value={appliedForce}
                onChange={(event) =>
                  setAppliedForce(
                    Number(event.target.value)
                  )
                }
              />

              <div className="control-scale">
                <span>0 N</span>
                <span>{maxStatic.toFixed(0)} N threshold</span>
                <span>80 N</span>
              </div>
            </div>

            <div className="friction-control">
              <label>
                Mass
                <strong>{mass} kg</strong>
              </label>

              <input
                type="range"
                min="5"
                max="20"
                value={mass}
                onChange={(event) =>
                  setMass(Number(event.target.value))
                }
              />
            </div>

            <div className="friction-control">
              <label>
                Static coefficient μs
                <strong>{muStatic.toFixed(2)}</strong>
              </label>

              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.05"
                value={muStatic}
                onChange={(event) =>
                  setMuStatic(
                    Number(event.target.value)
                  )
                }
              />
            </div>

            <div className="friction-control">
              <label>
                Kinetic coefficient μk
                <strong>{muKinetic.toFixed(2)}</strong>
              </label>

              <input
                type="range"
                min="0.05"
                max="0.7"
                step="0.05"
                value={muKinetic}
                onChange={(event) =>
                  setMuKinetic(
                    Number(event.target.value)
                  )
                }
              />
            </div>

            <div className="friction-result">
              <div>
                <span>Maximum static friction</span>
                <strong>
                  {maxStatic.toFixed(1)} N
                </strong>
              </div>

              <div>
                <span>Kinetic friction</span>
                <strong>
                  {kinetic.toFixed(1)} N
                </strong>
              </div>

              <div>
                <span>Current friction</span>
                <strong>
                  {frictionForce.toFixed(1)} N
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lesson-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">
              THE FRICTION CURVE
            </span>

            <h2>What happens as the force increases?</h2>
          </div>
        </div>

        <div className="friction-curve-card">
          <div className="friction-graph">
            <div className="graph-y-label">
              friction force
            </div>

            <div className="graph-line static-line" />

            <div className="graph-line kinetic-line" />

            <div
              className="graph-current"
              style={{
                left: `${Math.min(
                  95,
                  appliedForce * 1.15
                )}%`,
              }}
            />

            <div className="graph-x-label">
              applied force →
            </div>
          </div>

          <div className="friction-curve-explanation">
            <div>
              <span className="curve-dot static-dot" />
              <div>
                <strong>Static friction</strong>
                <p>
                  Increases with the applied force until the
                  maximum static friction is reached.
                </p>
              </div>
            </div>

            <div>
              <span className="curve-dot kinetic-dot" />
              <div>
                <strong>Kinetic friction</strong>
                <p>
                  Once sliding begins, friction is approximately
                  constant for the model used here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lesson-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">
              KEY RELATIONSHIPS
            </span>

            <h2>What controls friction?</h2>
          </div>
        </div>

        <div className="relationship-grid">
          <article className="relationship-card">
            <div className="relationship-icon">
              μ
            </div>

            <h3>Surface properties</h3>

            <p>
              The coefficient of friction represents how strongly
              two surfaces resist relative motion.
            </p>

            <div className="relationship-equation">
              <Equation expression="f\propto\mu" />
            </div>
          </article>

          <article className="relationship-card">
            <div className="relationship-icon">
              N
            </div>

            <h3>Normal force</h3>

            <p>
              For the simple model, increasing the normal force
              increases the maximum friction force.
            </p>

            <div className="relationship-equation">
              <Equation expression="f_k=\mu_kN" />
            </div>
          </article>

          <article className="relationship-card">
            <div className="relationship-icon">
              f
            </div>

            <h3>Direction</h3>

            <p>
              Friction acts opposite the relative motion or
              tendency of relative motion.
            </p>

            <div className="relationship-equation">
              <Equation expression="\vec f\leftarrow\text{motion}" />
            </div>
          </article>
        </div>
      </section>

      <section className="worked-example">
        <div className="worked-header">
          <div>
            <span className="section-kicker">
              WORKED EXAMPLE
            </span>

            <h2>Will the box start moving?</h2>
          </div>

          <span className="example-tag">
            STEP-BY-STEP
          </span>
        </div>

        <div className="problem-box">
          <p>
            A 10 kg box is on a horizontal surface with
            μs = 0.50. A horizontal force of 40 N is applied.
          </p>

          <p className="question-text">
            Determine whether the box moves.
          </p>
        </div>

        <div className="steps-container">
          <ExampleStep
            number={1}
            title="Calculate the normal force"
            visible={exampleStep >= 1}
          >
            On a horizontal surface:

            <div className="step-equation">
              <Equation expression="N=mg=(10)(9.8)=98\\;N" />
            </div>
          </ExampleStep>

          <ExampleStep
            number={2}
            title="Calculate maximum static friction"
            visible={exampleStep >= 2}
          >
            <div className="step-equation">
              <Equation expression="f_{s,max}=\mu_sN=(0.50)(98)=49\\;N" />
            </div>
          </ExampleStep>

          <ExampleStep
            number={3}
            title="Compare the applied force"
            visible={exampleStep >= 3}
          >
            The applied force is 40 N, which is less than the
            maximum static friction of 49 N.

            <div className="step-equation">
              <Equation expression="40<49" />
            </div>
          </ExampleStep>

          <ExampleStep
            number={4}
            title="State the conclusion"
            visible={exampleStep >= 4}
          >
            The box does not move. Static friction adjusts to
            40 N and balances the applied force.
          </ExampleStep>
        </div>

        {exampleStep < 4 ? (
          <button
            className="primary-button reveal-button"
            onClick={() =>
              setExampleStep((step) => step + 1)
            }
          >
            Reveal Step {exampleStep + 1}
            <span>→</span>
          </button>
        ) : (
          <div className="solution-complete">
            ✓ Complete solution revealed
          </div>
        )}
      </section>

      <section className="two-column-section">
        <article className="misconception-card">
          <div className="card-label">
            COMMON MISCONCEPTION
          </div>

          <h2>
            “Static friction always equals μsN.”
          </h2>

          <div className="answer-line">
            <span>NOT EXACTLY</span>

            <p>
              The maximum possible static friction is μsN.
              Actual static friction can be any value up to
              that maximum, depending on the applied force.
            </p>
          </div>
        </article>

        <article className="exam-tip-card">
          <div className="card-label">
            EXAM STRATEGY
          </div>

          <h2>Check whether the object is moving first.</h2>

          <p>
            If the object is not sliding, consider static
            friction. If it is sliding, use the kinetic
            friction model.
          </p>

          <div className="tip-sequence">
            <span>At rest</span>
            <b>→</b>
            <span>μsN</span>
            <b>→</b>
            <span>Threshold</span>
            <b>→</b>
            <span>Sliding</span>
          </div>
        </article>
      </section>

      <section className="quiz-card">
        <div className="quiz-header">
          <div>
            <span className="section-kicker">
              CHECK YOURSELF
            </span>

            <h2>Quick Concept Check</h2>
          </div>

          <span className="question-number">
            1 QUESTION
          </span>
        </div>

        <p className="quiz-question">
          A box has a maximum static friction of 60 N. An
          applied force of 45 N acts horizontally. What is the
          magnitude of static friction?
        </p>

        <div className="quiz-options">
          {[
            {
              id: "a",
              text: "15 N",
            },
            {
              id: "b",
              text: "45 N",
            },
            {
              id: "c",
              text: "60 N",
            },
            {
              id: "d",
              text: "105 N",
            },
          ].map((option) => {
            const selected = answer === option.id;

            return (
              <button
                key={option.id}
                className={`quiz-option ${
                  selected ? "selected" : ""
                } ${
                  selected && option.id === "b"
                    ? "correct"
                    : ""
                } ${
                  selected && option.id !== "b"
                    ? "incorrect"
                    : ""
                }`}
                onClick={() => setAnswer(option.id)}
              >
                <span className="option-letter">
                  {option.id.toUpperCase()}
                </span>

                <span>{option.text}</span>

                {selected && (
                  <span className="option-status">
                    {option.id === "b" ? "✓" : "×"}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {answer && (
          <div
            className={`quiz-feedback ${
              answer === "b"
                ? "feedback-correct"
                : ""
            }`}
          >
            <strong>
              {answer === "b"
                ? "Correct!"
                : "Not quite."}
            </strong>

            <p>
              Static friction adjusts to match the applied
              force as long as the applied force is below its
              maximum value.
            </p>

            <div>
              <Equation expression="f_s=45\\;N<60\\;N" />
            </div>
          </div>
        )}
      </section>

      <div className="lesson-actions">
        <button
          className="secondary-button"
          onClick={onBack}
        >
          ← Free-Body Diagrams
        </button>

        <button
          className="primary-button"
          onClick={onComplete}
        >
          Complete & Continue
          <span>→</span>
        </button>
      </div>
    </section>
  );
}

/* =========================================================
   SECTION 7 — TRANSLATIONAL EQUILIBRIUM
========================================================= */

function EquilibriumLesson({
  onComplete,
  onBack,
}: {
  onComplete: () => void;
  onBack: () => void;
}) {
  const [leftForce, setLeftForce] = useState(50);
  const [rightForce, setRightForce] = useState(50);
  const [answer, setAnswer] = useState<string | null>(null);
  const [exampleStep, setExampleStep] = useState(0);

  const netForce = rightForce - leftForce;
  const equilibrium = Math.abs(netForce) < 0.01;

  return (
    <section className="lesson-page equilibrium-page">
      <div className="lesson-header">
        <span className="section-kicker">
          SECTION 07 • 10 MIN
        </span>

        <h1>Translational Equilibrium</h1>

        <p>
          An object is in translational equilibrium when the
          vector sum of all external forces is zero.
        </p>
      </div>

      <article className="law-card">
        <div className="law-symbol">ΣF</div>

        <div>
          <span className="card-label">
            EQUILIBRIUM CONDITION
          </span>

          <h2>Balanced forces mean zero acceleration</h2>

          <p>
            Translational equilibrium does not necessarily mean
            the object is stationary. An object can move at
            constant velocity while the net force remains zero.
          </p>

          <div className="large-equation">
            <Equation expression="\sum\vec F=0" />
          </div>

          <div className="equation-forms">
            <div>
              <span>x direction</span>
              <Equation
                expression="\sum F_x=0"
                display={false}
              />
            </div>

            <div>
              <span>y direction</span>
              <Equation
                expression="\sum F_y=0"
                display={false}
              />
            </div>

            <div>
              <span>acceleration</span>
              <Equation
                expression="\vec a=0"
                display={false}
              />
            </div>
          </div>
        </div>
      </article>

      <section className="lesson-section">
        <div className="lesson-section-heading">
          <div>
            <span className="section-kicker">
              INTERACTIVE BALANCE LAB
            </span>

            <h2>Can you balance the object?</h2>

            <p>
              Adjust the two horizontal forces until the net
              force becomes zero.
            </p>
          </div>

          <div
            className={`live-pill ${
              equilibrium ? "equilibrium-pill" : ""
            }`}
          >
            <span />
            {equilibrium
              ? "EQUILIBRIUM"
              : "UNBALANCED"}
          </div>
        </div>

        <div className="equilibrium-simulator">
          <div className="equilibrium-stage">
            <div className="stage-grid" />

            <div
              className="equilibrium-arrow equilibrium-left"
              style={{
                width: `${Math.max(
                  45,
                  leftForce * 2.5
                )}px`,
              }}
            >
              <b>←</b>
              <span>{leftForce} N</span>
            </div>

            <div className="equilibrium-object">
              <span>m</span>
            </div>

            <div
              className="equilibrium-arrow equilibrium-right"
              style={{
                width: `${Math.max(
                  45,
                  rightForce * 2.5
                )}px`,
              }}
            >
              <span>{rightForce} N</span>
              <b>→</b>
            </div>

            <div
              className={`equilibrium-result ${
                equilibrium ? "result-balanced" : ""
              }`}
            >
              <span>NET FORCE</span>

              <strong>
                {netForce > 0 ? "+" : ""}
                {netForce.toFixed(1)} N
              </strong>

              <small>
                {equilibrium
                  ? "Acceleration = 0"
                  : "Acceleration ≠ 0"}
              </small>
            </div>
          </div>

          <div className="equilibrium-controls">
            <div className="equilibrium-control">
              <label>
                Left force
                <strong>{leftForce} N</strong>
              </label>

              <input
                type="range"
                min="0"
                max="100"
                value={leftForce}
                onChange={(event) =>
                  setLeftForce(
                    Number(event.target.value)
                  )
                }
              />

              <div className="control-scale">
                <span>0 N</span>
                <span>50 N</span>
                <span>100 N</span>
              </div>
            </div>

            <div className="equilibrium-control">
              <label>
                Right force
                <strong>{rightForce} N</strong>
              </label>

              <input
                type="range"
                min="0"
                max="100"
                value={rightForce}
                onChange={(event) =>
                  setRightForce(
                    Number(event.target.value)
                  )
                }
              />

              <div className="control-scale">
                <span>0 N</span>
                <span>50 N</span>
                <span>100 N</span>
              </div>
            </div>

            <button
              className="secondary-button balance-button"
              onClick={() => {
                setRightForce(leftForce);
              }}
            >
              Balance Forces
            </button>

            <div className="equilibrium-insight">
              <span>💡</span>

              <p>
                {equilibrium ? (
                  <>
                    <strong>Balanced!</strong> The object has
                    zero acceleration.
                  </>
                ) : (
                  <>
                    The forces are unbalanced by{" "}
                    <strong>
                      {Math.abs(netForce).toFixed(1)} N
                    </strong>
                    .
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="lesson-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">
              EQUILIBRIUM IN TWO DIMENSIONS
            </span>

            <h2>Balance each direction separately</h2>
          </div>
        </div>

        <div className="equilibrium-grid">
          <article className="equilibrium-card">
            <div className="equilibrium-card-icon">x</div>

            <h3>Horizontal equilibrium</h3>

            <p>
              The total force to the right must equal the total
              force to the left.
            </p>

            <div className="small-equation">
              <Equation expression="\sum F_x=0" />
            </div>
          </article>

          <article className="equilibrium-card">
            <div className="equilibrium-card-icon">y</div>

            <h3>Vertical equilibrium</h3>

            <p>
              The total upward force must equal the total
              downward force.
            </p>

            <div className="small-equation">
              <Equation expression="\sum F_y=0" />
            </div>
          </article>

          <article className="equilibrium-card">
            <div className="equilibrium-card-icon">a</div>

            <h3>Zero acceleration</h3>

            <p>
              If the net force is zero, Newton's Second Law gives
              zero acceleration.
            </p>

            <div className="small-equation">
              <Equation expression="\sum\vec F=0\Rightarrow\vec a=0" />
            </div>
          </article>
        </div>
      </section>

      <section className="worked-example">
        <div className="worked-header">
          <div>
            <span className="section-kicker">
              WORKED EXAMPLE
            </span>

            <h2>Hanging lamp</h2>
          </div>

          <span className="example-tag">
            STEP-BY-STEP
          </span>
        </div>

        <div className="problem-box">
          <p>
            A lamp with a weight of{" "}
            <strong>80 N</strong> hangs motionless from a
            vertical cable.
          </p>

          <p className="question-text">
            What is the tension in the cable?
          </p>
        </div>

        <div className="steps-container">
          <ExampleStep
            number={1}
            title="Identify the vertical forces"
            visible={exampleStep >= 1}
          >
            The lamp has weight acting downward and tension
            acting upward.
          </ExampleStep>

          <ExampleStep
            number={2}
            title="Apply the equilibrium condition"
            visible={exampleStep >= 2}
          >
            Since the lamp is stationary, its acceleration is
            zero.

            <div className="step-equation">
              <Equation expression="\sum F_y=0" />
            </div>
          </ExampleStep>

          <ExampleStep
            number={3}
            title="Set the forces equal"
            visible={exampleStep >= 3}
          >
            Take upward as positive.

            <div className="step-equation">
              <Equation expression="T-80=0" />
            </div>
          </ExampleStep>

          <ExampleStep
            number={4}
            title="Calculate the tension"
            visible={exampleStep >= 4}
          >
            Therefore:

            <div className="step-equation">
              <Equation expression="T=80\\;N" />
            </div>
          </ExampleStep>
        </div>

        {exampleStep < 4 ? (
          <button
            className="primary-button reveal-button"
            onClick={() =>
              setExampleStep((step) => step + 1)
            }
          >
            Reveal Step {exampleStep + 1}
            <span>→</span>
          </button>
        ) : (
          <div className="solution-complete">
            ✓ Complete solution revealed
          </div>
        )}
      </section>

      <section className="two-column-section">
        <article className="misconception-card">
          <div className="card-label">
            COMMON MISCONCEPTION
          </div>

          <h2>
            “Equilibrium means the object is not moving.”
          </h2>

          <div className="answer-line">
            <span>FALSE</span>

            <p>
              Equilibrium means zero acceleration. The object
              may be stationary or may move with constant
              velocity.
            </p>
          </div>
        </article>

        <article className="exam-tip-card">
          <div className="card-label">
            EXAM STRATEGY
          </div>

          <h2>Write one equation for each axis.</h2>

          <p>
            For two-dimensional problems, do not combine
            horizontal and vertical forces into one scalar
            equation. Treat each direction separately.
          </p>

          <div className="tip-equation">
            <Equation expression="\sum F_x=0,\qquad\sum F_y=0" />
          </div>
        </article>
      </section>

      <section className="quiz-card">
        <div className="quiz-header">
          <div>
            <span className="section-kicker">
              CHECK YOURSELF
            </span>

            <h2>Quick Concept Check</h2>
          </div>

          <span className="question-number">
            1 QUESTION
          </span>
        </div>

        <p className="quiz-question">
          An object moves in a straight line at constant
          velocity. What is the net force acting on it?
        </p>

        <div className="quiz-options">
          {[
            {
              id: "a",
              text: "Greater than zero.",
            },
            {
              id: "b",
              text: "Less than zero.",
            },
            {
              id: "c",
              text: "Equal to zero.",
            },
            {
              id: "d",
              text: "It depends only on the mass.",
            },
          ].map((option) => {
            const selected = answer === option.id;

            return (
              <button
                key={option.id}
                className={`quiz-option ${
                  selected ? "selected" : ""
                } ${
                  selected && option.id === "c"
                    ? "correct"
                    : ""
                } ${
                  selected && option.id !== "c"
                    ? "incorrect"
                    : ""
                }`}
                onClick={() => setAnswer(option.id)}
              >
                <span className="option-letter">
                  {option.id.toUpperCase()}
                </span>

                <span>{option.text}</span>

                {selected && (
                  <span className="option-status">
                    {option.id === "c" ? "✓" : "×"}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {answer && (
          <div
            className={`quiz-feedback ${
              answer === "c"
                ? "feedback-correct"
                : ""
            }`}
          >
            <strong>
              {answer === "c"
                ? "Correct!"
                : "Not quite."}
            </strong>

            <p>
              Constant velocity means zero acceleration.
              Therefore, Newton's Second Law gives zero net
              force.
            </p>

            <div>
              <Equation expression="\vec v=\text{constant}\Rightarrow\vec a=0\Rightarrow\sum\vec F=0" />
            </div>
          </div>
        )}
      </section>

      <div className="lesson-actions">
        <button
          className="secondary-button"
          onClick={onBack}
        >
          ← Friction
        </button>

        <button
          className="primary-button"
          onClick={onComplete}
        >
          Complete & Continue
          <span>→</span>
        </button>
      </div>
    </section>
  );
}

/* =========================================================
   SECTION 8 — ATWOOD MACHINE
========================================================= */

function AtwoodMachineLesson({
  onComplete,
  onBack,
}: {
  onComplete: () => void;
  onBack: () => void;
}) {
  const [massA, setMassA] = useState(5);
  const [massB, setMassB] = useState(3);
  const [answer, setAnswer] = useState<string | null>(null);
  const [exampleStep, setExampleStep] = useState(0);

  const g = 9.8;

  const acceleration =
    ((massA - massB) * g) / (massA + massB);

  const heavierA = massA > massB;
  const equalMasses = Math.abs(massA - massB) < 0.001;

  const accelerationMagnitude = Math.abs(acceleration);

  const tension =
    (2 * massA * massB * g) /
    (massA + massB);

  return (
    <section className="lesson-page atwood-page">
      <div className="lesson-header">
        <span className="section-kicker">
          SECTION 08 • 12 MIN
        </span>

        <h1>Atwood Machine</h1>

        <p>
          Explore how two connected masses move when gravity
          acts on them through a pulley and an ideal rope.
        </p>
      </div>

      <article className="law-card">
        <div className="law-symbol">AM</div>

        <div>
          <span className="card-label">
            CONNECTED SYSTEMS
          </span>

          <h2>Two masses, one acceleration</h2>

          <p>
            For an ideal Atwood machine, the two masses share
            the same magnitude of acceleration while the
            tension in the rope connects their motion.
          </p>

          <div className="atwood-equations">
            <div className="large-equation">
              <Equation
                expression="a=\frac{(m_A-m_B)g}{m_A+m_B}"
              />
            </div>

            <div className="large-equation">
              <Equation
                expression="T=\frac{2m_Am_Bg}{m_A+m_B}"
              />
            </div>
          </div>

          <p className="equation-note">
            These equations assume an ideal rope and pulley,
            negligible pulley mass, and negligible friction.
          </p>
        </div>
      </article>

      <section className="lesson-section">
        <div className="lesson-section-heading">
          <div>
            <span className="section-kicker">
              INTERACTIVE SIMULATION
            </span>

            <h2>Change the masses</h2>

            <p>
              Adjust either mass and watch the direction,
              acceleration, and tension change.
            </p>
          </div>

          <div
            className={`live-pill ${
              equalMasses ? "atwood-balanced-pill" : ""
            }`}
          >
            <span />
            {equalMasses ? "BALANCED" : "MOVING"}
          </div>
        </div>

        <div className="atwood-simulator">
          <div className="atwood-stage">
            <div className="stage-grid" />

            <div className="pulley">
              <div className="pulley-wheel" />
              <div className="pulley-rope" />
            </div>

            <div
              className="atwood-mass mass-a"
              style={{
                transform: `translateY(${
                  heavierA
                    ? Math.min(
                        accelerationMagnitude * 22,
                        70
                      )
                    : 0
                }px)`,
              }}
            >
              <span>A</span>
              <small>{massA} kg</small>

              {!equalMasses && heavierA && (
                <b>↓</b>
              )}

              {!equalMasses && !heavierA && (
                <b>↑</b>
              )}
            </div>

            <div
              className="atwood-mass mass-b"
              style={{
                transform: `translateY(${
                  heavierA
                    ? -Math.min(
                        accelerationMagnitude * 22,
                        70
                      )
                    : Math.min(
                        accelerationMagnitude * 22,
                        70
                      )
                }px)`,
              }}
            >
              <span>B</span>
              <small>{massB} kg</small>

              {!equalMasses && heavierA && (
                <b>↑</b>
              )}

              {!equalMasses && !heavierA && (
                <b>↓</b>
              )}
            </div>

            <div className="atwood-tension">
              T = {tension.toFixed(1)} N
            </div>

            <div
              className={`atwood-motion ${
                equalMasses ? "motion-zero" : ""
              }`}
            >
              {equalMasses
                ? "No acceleration"
                : heavierA
                  ? "A ↓   B ↑"
                  : "A ↑   B ↓"}
            </div>
          </div>

          <div className="atwood-controls">
            <div className="atwood-control">
              <label>
                Mass A
                <strong>{massA} kg</strong>
              </label>

              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={massA}
                onChange={(event) =>
                  setMassA(
                    Number(event.target.value)
                  )
                }
              />

              <div className="control-scale">
                <span>1 kg</span>
                <span>5 kg</span>
                <span>10 kg</span>
              </div>
            </div>

            <div className="atwood-control">
              <label>
                Mass B
                <strong>{massB} kg</strong>
              </label>

              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={massB}
                onChange={(event) =>
                  setMassB(
                    Number(event.target.value)
                  )
                }
              />

              <div className="control-scale">
                <span>1 kg</span>
                <span>5 kg</span>
                <span>10 kg</span>
              </div>
            </div>

            <div className="atwood-results">
              <div>
                <span>Acceleration</span>

                <strong>
                  {accelerationMagnitude.toFixed(2)}
                  {" m/s²"}
                </strong>
              </div>

              <div>
                <span>Tension</span>

                <strong>
                  {tension.toFixed(2)}
                  {" N"}
                </strong>
              </div>

              <div>
                <span>Heavier side</span>

                <strong>
                  {equalMasses
                    ? "Neither"
                    : heavierA
                      ? "Mass A"
                      : "Mass B"}
                </strong>
              </div>
            </div>

            <div className="atwood-insight">
              <span>💡</span>

              <p>
                {equalMasses ? (
                  <>
                    Equal masses produce{" "}
                    <strong>zero acceleration</strong>.
                  </>
                ) : (
                  <>
                    The heavier mass moves{" "}
                    <strong>downward</strong> while the lighter
                    mass moves upward.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="lesson-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">
              FORCE ANALYSIS
            </span>

            <h2>Apply Newton's Second Law to each mass</h2>
          </div>
        </div>

        <div className="atwood-analysis-grid">
          <article className="atwood-analysis-card">
            <div className="analysis-label">
              MASS A
            </div>

            <h3>Downward positive</h3>

            <p>
              If A is the heavier mass, its weight pulls it
              downward while tension acts upward.
            </p>

            <div className="analysis-equation">
              <Equation expression="m_Ag-T=m_Aa" />
            </div>
          </article>

          <article className="atwood-analysis-card">
            <div className="analysis-label">
              MASS B
            </div>

            <h3>Upward positive</h3>

            <p>
              The tension pulls B upward while its weight acts
              downward.
            </p>

            <div className="analysis-equation">
              <Equation expression="T-m_Bg=m_Ba" />
            </div>
          </article>

          <article className="atwood-analysis-card">
            <div className="analysis-label">
              COMBINE
            </div>

            <h3>Eliminate tension</h3>

            <p>
              Adding the two equations eliminates tension and
              gives the acceleration of the system.
            </p>

            <div className="analysis-equation">
              <Equation
                expression="a=\frac{(m_A-m_B)g}{m_A+m_B}"
              />
            </div>
          </article>
        </div>
      </section>

      <section className="worked-example">
        <div className="worked-header">
          <div>
            <span className="section-kicker">
              WORKED EXAMPLE
            </span>

            <h2>Two masses connected by a rope</h2>
          </div>

          <span className="example-tag">
            STEP-BY-STEP
          </span>
        </div>

        <div className="problem-box">
          <p>
            An ideal Atwood machine has masses{" "}
            <strong>6 kg</strong> and{" "}
            <strong>4 kg</strong>.
          </p>

          <p className="question-text">
            Calculate the acceleration of the system.
          </p>
        </div>

        <div className="steps-container">
          <ExampleStep
            number={1}
            title="Write the equation"
            visible={exampleStep >= 1}
          >
            For an ideal Atwood machine:

            <div className="step-equation">
              <Equation
                expression="a=\frac{(m_A-m_B)g}{m_A+m_B}"
              />
            </div>
          </ExampleStep>

          <ExampleStep
            number={2}
            title="Substitute the masses"
            visible={exampleStep >= 2}
          >
            Substitute 6 kg and 4 kg.

            <div className="step-equation">
              <Equation
                expression="a=\frac{(6-4)(9.8)}{6+4}"
              />
            </div>
          </ExampleStep>

          <ExampleStep
            number={3}
            title="Simplify"
            visible={exampleStep >= 3}
          >
            <div className="step-equation">
              <Equation
                expression="a=\frac{19.6}{10}"
              />
            </div>
          </ExampleStep>

          <ExampleStep
            number={4}
            title="Final answer"
            visible={exampleStep >= 4}
          >
            <div className="step-equation">
              <Equation
                expression="a=1.96\\;\\mathrm{m/s^2}"
              />
            </div>

            The 6 kg mass moves downward and the 4 kg mass
            moves upward.
          </ExampleStep>
        </div>

        {exampleStep < 4 ? (
          <button
            className="primary-button reveal-button"
            onClick={() =>
              setExampleStep((step) => step + 1)
            }
          >
            Reveal Step {exampleStep + 1}
            <span>→</span>
          </button>
        ) : (
          <div className="solution-complete">
            ✓ Complete solution revealed
          </div>
        )}
      </section>

      <section className="two-column-section">
        <article className="misconception-card">
          <div className="card-label">
            COMMON MISCONCEPTION
          </div>

          <h2>
            “The tension is always equal to the weight of the
            heavier mass.”
          </h2>

          <div className="answer-line">
            <span>FALSE</span>

            <p>
              When the system accelerates, the tension is not
              equal to either weight. The tension must satisfy
              Newton's Second Law for both masses.
            </p>
          </div>
        </article>

        <article className="exam-tip-card">
          <div className="card-label">
            EXAM STRATEGY
          </div>

          <h2>Draw both free-body diagrams.</h2>

          <p>
            Write one Newton's Second Law equation for each
            mass, then combine the equations to solve for the
            unknown acceleration or tension.
          </p>

          <div className="tip-equation">
            <Equation expression="m_Ag-T=m_Aa" />
            <br />
            <Equation expression="T-m_Bg=m_Ba" />
          </div>
        </article>
      </section>

      <section className="quiz-card">
        <div className="quiz-header">
          <div>
            <span className="section-kicker">
              CHECK YOURSELF
            </span>

            <h2>Quick Concept Check</h2>
          </div>

          <span className="question-number">
            1 QUESTION
          </span>
        </div>

        <p className="quiz-question">
          In an ideal Atwood machine, what happens when the two
          masses are equal?
        </p>

        <div className="quiz-options">
          {[
            {
              id: "a",
              text: "The heavier mass accelerates downward.",
            },
            {
              id: "b",
              text: "The lighter mass accelerates downward.",
            },
            {
              id: "c",
              text: "The acceleration is zero.",
            },
            {
              id: "d",
              text: "The tension becomes zero.",
            },
          ].map((option) => {
            const selected = answer === option.id;

            return (
              <button
                key={option.id}
                className={`quiz-option ${
                  selected ? "selected" : ""
                } ${
                  selected && option.id === "c"
                    ? "correct"
                    : ""
                } ${
                  selected && option.id !== "c"
                    ? "incorrect"
                    : ""
                }`}
                onClick={() => setAnswer(option.id)}
              >
                <span className="option-letter">
                  {option.id.toUpperCase()}
                </span>

                <span>{option.text}</span>

                {selected && (
                  <span className="option-status">
                    {option.id === "c" ? "✓" : "×"}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {answer && (
          <div
            className={`quiz-feedback ${
              answer === "c"
                ? "feedback-correct"
                : ""
            }`}
          >
            <strong>
              {answer === "c"
                ? "Correct!"
                : "Not quite."}
            </strong>

            <p>
              Equal masses have equal gravitational forces, so
              the net driving force is zero.
            </p>

            <div>
              <Equation expression="m_A=m_B\Rightarrow a=0" />
            </div>
          </div>
        )}
      </section>

      <div className="lesson-actions">
        <button
          className="secondary-button"
          onClick={onBack}
        >
          ← Equilibrium
        </button>

        <button
          className="primary-button"
          onClick={onComplete}
        >
          Complete & Continue
          <span>→</span>
        </button>
      </div>
    </section>
  );
}

/* =========================================================
   SECTION 9 — CIRCULAR MOTION
========================================================= */

function CircularMotionLesson({
  onComplete,
  onBack,
}: {
  onComplete: () => void;
  onBack: () => void;
}) {
  const [radius, setRadius] = useState(2);
  const [speed, setSpeed] = useState(5);
  const [mass, setMass] = useState(2);
  const [running, setRunning] = useState(true);
  const [answer, setAnswer] = useState<string | null>(null);
  const [exampleStep, setExampleStep] = useState(0);

  const centripetalAcceleration =
    (speed * speed) / radius;

  const centripetalForce =
    mass * centripetalAcceleration;

  const angularVelocity = speed / radius;

  const period =
    (2 * Math.PI * radius) / speed;

  return (
    <section className="lesson-page circular-page">
      <div className="lesson-header">
        <span className="section-kicker">
          SECTION 09 • 12 MIN
        </span>

        <h1>Circular Motion</h1>

        <p>
          An object moving in a circular path continuously
          changes the direction of its velocity, requiring an
          inward centripetal acceleration.
        </p>
      </div>

      <article className="law-card">
        <div className="law-symbol">↻</div>

        <div>
          <span className="card-label">
            CIRCULAR MOTION
          </span>

          <h2>Acceleration points toward the center</h2>

          <p>
            Even when the speed remains constant, the velocity
            changes because its direction changes. This produces
            centripetal acceleration toward the center of the
            circular path.
          </p>

          <div className="circular-equations">
            <div className="large-equation">
              <Equation
                expression="a_c=\frac{v^2}{r}"
              />
            </div>

            <div className="large-equation">
              <Equation
                expression="F_c=\frac{mv^2}{r}"
              />
            </div>

            <div className="large-equation">
              <Equation
                expression="v=\omega r"
              />
            </div>
          </div>

          <p className="equation-note">
            Centripetal force is not a new type of force. It is
            the net inward force required for circular motion.
          </p>
        </div>
      </article>

      <section className="lesson-section">
        <div className="lesson-section-heading">
          <div>
            <span className="section-kicker">
              INTERACTIVE ORBIT LAB
            </span>

            <h2>Control the circular motion</h2>

            <p>
              Change the radius, speed, and mass. Watch the
              orbit and physics values update in real time.
            </p>
          </div>

          <div className="live-pill">
            <span />
            {running ? "MOTION ACTIVE" : "PAUSED"}
          </div>
        </div>

        <div className="circular-simulator">
          <div className="orbit-stage">
            <div className="stage-grid" />

            <div
              className="orbit-path"
              style={{
                width: `${Math.min(
                  330,
                  150 + radius * 45
                )}px`,
                height: `${Math.min(
                  330,
                  150 + radius * 45
                )}px`,
              }}
            />

            <div className="orbit-center">
              <span>C</span>
            </div>

            <div
              className={`orbit-particle ${
                running ? "orbit-running" : ""
              }`}
              style={{
                animationDuration: `${Math.max(1.2, period)}s`,
                ["--orbit-radius" as string]: `${75 + radius * 22}px`,
              }}
            >
              <span />
            </div>

            <div className="radius-line">
              <span>r = {radius.toFixed(1)} m</span>
            </div>

            <div className="velocity-vector">
              <span>v</span>
              <b>→</b>
            </div>

            <div className="centripetal-vector">
              <b>←</b>
              <span>aᶜ</span>
            </div>

            <div className="orbit-caption">
              <span>INWARD</span>
              <strong>centripetal acceleration</strong>
            </div>
          </div>

          <div className="circular-controls">
            <div className="circular-control">
              <label>
                Radius
                <strong>{radius.toFixed(1)} m</strong>
              </label>

              <input
                type="range"
                min="1"
                max="4"
                step="0.1"
                value={radius}
                onChange={(event) =>
                  setRadius(
                    Number(event.target.value)
                  )
                }
              />

              <div className="control-scale">
                <span>1 m</span>
                <span>2.5 m</span>
                <span>4 m</span>
              </div>
            </div>

            <div className="circular-control">
              <label>
                Speed
                <strong>{speed.toFixed(1)} m/s</strong>
              </label>

              <input
                type="range"
                min="1"
                max="12"
                step="0.5"
                value={speed}
                onChange={(event) =>
                  setSpeed(
                    Number(event.target.value)
                  )
                }
              />

              <div className="control-scale">
                <span>1 m/s</span>
                <span>6.5 m/s</span>
                <span>12 m/s</span>
              </div>
            </div>

            <div className="circular-control">
              <label>
                Mass
                <strong>{mass.toFixed(1)} kg</strong>
              </label>

              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={mass}
                onChange={(event) =>
                  setMass(
                    Number(event.target.value)
                  )
                }
              />

              <div className="control-scale">
                <span>1 kg</span>
                <span>5.5 kg</span>
                <span>10 kg</span>
              </div>
            </div>

            <button
              className="secondary-button orbit-toggle"
              onClick={() => setRunning(!running)}
            >
              {running ? "Pause Motion" : "Resume Motion"}
            </button>

            <div className="circular-results">
              <div>
                <span>Centripetal acceleration</span>
                <strong>
                  {centripetalAcceleration.toFixed(2)}
                  {" m/s²"}
                </strong>
              </div>

              <div>
                <span>Centripetal force</span>
                <strong>
                  {centripetalForce.toFixed(2)}
                  {" N"}
                </strong>
              </div>

              <div>
                <span>Angular velocity</span>
                <strong>
                  {angularVelocity.toFixed(2)}
                  {" rad/s"}
                </strong>
              </div>

              <div>
                <span>Period</span>
                <strong>
                  {period.toFixed(2)}
                  {" s"}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lesson-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">
              WHAT CHANGES?
            </span>

            <h2>Explore the relationships</h2>
          </div>
        </div>

        <div className="circular-relationship-grid">
          <article className="circular-relationship-card">
            <div className="relationship-icon">
              v²
            </div>

            <h3>Speed has a strong effect</h3>

            <p>
              Doubling speed makes centripetal acceleration four
              times larger when radius stays constant.
            </p>

            <div className="relationship-equation">
              <Equation expression="a_c\propto v^2" />
            </div>
          </article>

          <article className="circular-relationship-card">
            <div className="relationship-icon">
              1/r
            </div>

            <h3>Radius matters</h3>

            <p>
              For constant speed, increasing the radius reduces
              the required centripetal acceleration.
            </p>

            <div className="relationship-equation">
              <Equation expression="a_c\propto\frac1r" />
            </div>
          </article>

          <article className="circular-relationship-card">
            <div className="relationship-icon">
              m
            </div>

            <h3>Mass affects force</h3>

            <p>
              For the same speed and radius, a larger mass
              requires a larger centripetal force.
            </p>

            <div className="relationship-equation">
              <Equation expression="F_c\propto m" />
            </div>
          </article>
        </div>
      </section>

      <section className="worked-example">
        <div className="worked-header">
          <div>
            <span className="section-kicker">
              WORKED EXAMPLE
            </span>

            <h2>Find the centripetal force</h2>
          </div>

          <span className="example-tag">
            STEP-BY-STEP
          </span>
        </div>

        <div className="problem-box">
          <p>
            A{" "}
            <strong>2 kg</strong> object moves in a circular
            path of radius <strong>4 m</strong> at a speed of{" "}
            <strong>6 m/s</strong>.
          </p>

          <p className="question-text">
            Calculate its centripetal force.
          </p>
        </div>

        <div className="steps-container">
          <ExampleStep
            number={1}
            title="Write the equation"
            visible={exampleStep >= 1}
          >
            <div className="step-equation">
              <Equation
                expression="F_c=\frac{mv^2}{r}"
              />
            </div>
          </ExampleStep>

          <ExampleStep
            number={2}
            title="Substitute the values"
            visible={exampleStep >= 2}
          >
            <div className="step-equation">
              <Equation
                expression="F_c=\frac{(2)(6^2)}{4}"
              />
            </div>
          </ExampleStep>

          <ExampleStep
            number={3}
            title="Calculate"
            visible={exampleStep >= 3}
          >
            <div className="step-equation">
              <Equation
                expression="F_c=\frac{72}{4}"
              />
            </div>
          </ExampleStep>

          <ExampleStep
            number={4}
            title="Final answer"
            visible={exampleStep >= 4}
          >
            <div className="step-equation">
              <Equation
                expression="F_c=18\\;N"
              />
            </div>

            The force is directed toward the center of the
            circular path.
          </ExampleStep>
        </div>

        {exampleStep < 4 ? (
          <button
            className="primary-button reveal-button"
            onClick={() =>
              setExampleStep((step) => step + 1)
            }
          >
            Reveal Step {exampleStep + 1}
            <span>→</span>
          </button>
        ) : (
          <div className="solution-complete">
            ✓ Complete solution revealed
          </div>
        )}
      </section>

      <section className="two-column-section">
        <article className="misconception-card">
          <div className="card-label">
            COMMON MISCONCEPTION
          </div>

          <h2>
            “Centripetal force is an additional force.”
          </h2>

          <div className="answer-line">
            <span>FALSE</span>

            <p>
              Centripetal force describes the net inward force.
              It can be provided by tension, gravity, friction,
              normal force, or another physical force.
            </p>
          </div>
        </article>

        <article className="exam-tip-card">
          <div className="card-label">
            EXAM STRATEGY
          </div>

          <h2>Point toward the center.</h2>

          <p>
            The centripetal acceleration vector always points
            radially inward, while the instantaneous velocity
            is tangent to the circular path.
          </p>

          <div className="tip-equation">
            <Equation expression="\vec a_c\perp\vec v" />
          </div>
        </article>
      </section>

      <section className="quiz-card">
        <div className="quiz-header">
          <div>
            <span className="section-kicker">
              CHECK YOURSELF
            </span>

            <h2>Quick Concept Check</h2>
          </div>

          <span className="question-number">
            1 QUESTION
          </span>
        </div>

        <p className="quiz-question">
          If the speed of an object in uniform circular motion
          doubles while the radius stays constant, what happens
          to its centripetal acceleration?
        </p>

        <div className="quiz-options">
          {[
            {
              id: "a",
              text: "It becomes half as large.",
            },
            {
              id: "b",
              text: "It stays the same.",
            },
            {
              id: "c",
              text: "It becomes twice as large.",
            },
            {
              id: "d",
              text: "It becomes four times as large.",
            },
          ].map((option) => {
            const selected = answer === option.id;

            return (
              <button
                key={option.id}
                className={`quiz-option ${
                  selected ? "selected" : ""
                } ${
                  selected && option.id === "d"
                    ? "correct"
                    : ""
                } ${
                  selected && option.id !== "d"
                    ? "incorrect"
                    : ""
                }`}
                onClick={() => setAnswer(option.id)}
              >
                <span className="option-letter">
                  {option.id.toUpperCase()}
                </span>

                <span>{option.text}</span>

                {selected && (
                  <span className="option-status">
                    {option.id === "d" ? "✓" : "×"}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {answer && (
          <div
            className={`quiz-feedback ${
              answer === "d"
                ? "feedback-correct"
                : ""
            }`}
          >
            <strong>
              {answer === "d"
                ? "Correct!"
                : "Not quite."}
            </strong>

            <p>
              Centripetal acceleration depends on the square of
              speed.
            </p>

            <div>
              <Equation
                expression="a_c=\frac{v^2}{r}"
              />
            </div>
          </div>
        )}
      </section>

      <div className="lesson-actions">
        <button
          className="secondary-button"
          onClick={onBack}
        >
          ← Atwood Machine
        </button>

        <button
          className="primary-button"
          onClick={onComplete}
        >
          Complete & Continue
          <span>→</span>
        </button>
      </div>
    </section>
  );
}

/* =========================================================
   SECTION 10 — FINAL CHALLENGE
========================================================= */

function FinalChallenge({
  onComplete,
  onBack,
}: {
  onComplete: () => void;
  onBack: () => void;
}) {
  const questions = [
    {
      topic: "Newton's First Law",
      question:
        "An object moves at constant velocity on a frictionless surface. What is the net force acting on it?",
      options: [
        "Zero",
        "Equal to its mass",
        "Greater than zero",
        "Equal to its velocity",
      ],
      correct: 0,
      explanation:
        "Constant velocity means zero acceleration. Therefore, Newton's Second Law gives a net force of zero.",
      equation: "\\vec a=0\\Rightarrow\\sum\\vec F=0",
    },
    {
      topic: "Newton's Second Law",
      question:
        "A 5 kg object experiences a net force of 20 N. What is its acceleration?",
      options: [
        "0.25 m/s²",
        "4 m/s²",
        "15 m/s²",
        "100 m/s²",
      ],
      correct: 1,
      explanation:
        "Use Newton's Second Law: acceleration equals net force divided by mass.",
      equation: "a=\\frac{F}{m}=\\frac{20}{5}=4\\;m/s^2",
    },
    {
      topic: "Friction",
      question:
        "A box has a maximum static friction of 50 N. An applied force of 30 N acts on it. What is the friction force?",
      options: [
        "20 N",
        "30 N",
        "50 N",
        "80 N",
      ],
      correct: 1,
      explanation:
        "Static friction adjusts to match the applied force as long as the applied force does not exceed maximum static friction.",
      equation: "f_s=30\\;N<50\\;N",
    },
    {
      topic: "Atwood Machine",
      question:
        "In an ideal Atwood machine, what happens when both masses are equal?",
      options: [
        "The heavier mass moves downward",
        "The lighter mass moves downward",
        "Acceleration is zero",
        "Tension is zero",
      ],
      correct: 2,
      explanation:
        "Equal masses produce equal gravitational forces, so the net driving force is zero.",
      equation: "m_A=m_B\\Rightarrow a=0",
    },
    {
      topic: "Circular Motion",
      question:
        "If the speed of an object doubles while its circular-path radius remains constant, what happens to centripetal acceleration?",
      options: [
        "It becomes half",
        "It stays the same",
        "It becomes twice as large",
        "It becomes four times as large",
      ],
      correct: 3,
      explanation:
        "Centripetal acceleration depends on the square of velocity.",
      equation: "a_c=\\frac{v^2}{r}",
    },
  ];

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [selected, setSelected] = useState<number | null>(
    null
  );

  const [score, setScore] = useState(0);

  const [answered, setAnswered] = useState(false);

  const [finished, setFinished] = useState(false);

  const [started, setStarted] = useState(false);

  const question = questions[currentQuestion];

  const percentage = Math.round(
    (score / questions.length) * 100
  );

  const handleAnswer = (index: number) => {
    if (answered) return;

    setSelected(index);
    setAnswered(true);

    if (index === question.correct) {
      setScore((value) => value + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion === questions.length - 1) {
      setFinished(true);
      return;
    }

    setCurrentQuestion((value) => value + 1);
    setSelected(null);
    setAnswered(false);
  };

  const restartChallenge = () => {
    setCurrentQuestion(0);
    setSelected(null);
    setScore(0);
    setAnswered(false);
    setFinished(false);
    setStarted(true);
  };

  if (finished) {
    return (
      <section className="lesson-page final-page">
        <div className="final-result">
          <div className="completion-ring">
            <span>{percentage}%</span>
          </div>

          <span className="section-kicker">
            FINAL CHALLENGE COMPLETE
          </span>

          <h1>
            {percentage >= 80
              ? "Excellent work."
              : percentage >= 60
                ? "Good work."
                : "Keep practicing."}
          </h1>

          <p>
            You completed the final physics challenge and
            demonstrated your understanding of the core forces
            and motion concepts.
          </p>

          <div className="final-score">
            <div>
              <span>SCORE</span>
              <strong>
                {score}/{questions.length}
              </strong>
            </div>

            <div>
              <span>PERCENTAGE</span>
              <strong>{percentage}%</strong>
            </div>

            <div>
              <span>QUESTIONS</span>
              <strong>{questions.length}</strong>
            </div>
          </div>

          <div className="topic-results">
            {questions.map((item, index) => {
              return (
                <div
                  key={item.topic}
                  className={
                    index < score
                      ? "topic-result"
                      : "topic-result"
                  }
                >
                  <span>{index + 1}</span>
                  <strong>{item.topic}</strong>
                </div>
              );
            })}
          </div>

          <div className="final-actions">
            <button
              className="secondary-button"
              onClick={restartChallenge}
            >
              Try Again
            </button>

            <button
              className="primary-button"
              onClick={onComplete}
            >
              Complete Course
              <span>→</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!started) {
    return (
      <section className="lesson-page final-page">
        <div className="final-intro">
          <div className="final-badge">
            FINAL
          </div>

          <span className="section-kicker">
            SECTION 10 • FINAL CHALLENGE
          </span>

          <h1>Put your physics knowledge to the test.</h1>

          <p>
            This challenge combines the concepts explored
            throughout the simulation. Read each problem
            carefully, choose the best answer, and use the
            equations when necessary.
          </p>

          <div className="challenge-stats">
            <div>
              <strong>5</strong>
              <span>Questions</span>
            </div>

            <div>
              <strong>5</strong>
              <span>Core topics</span>
            </div>

            <div>
              <strong>∞</strong>
              <span>Attempts</span>
            </div>
          </div>

          <div className="challenge-topics">
            <span>Newton's Laws</span>
            <span>Friction</span>
            <span>Equilibrium</span>
            <span>Atwood Machine</span>
            <span>Circular Motion</span>
          </div>

          <button
            className="primary-button final-start-button"
            onClick={() => setStarted(true)}
          >
            Start Final Challenge
            <span>→</span>
          </button>

          <button
            className="secondary-button final-back-button"
            onClick={onBack}
          >
            ← Circular Motion
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="lesson-page final-page">
      <div className="final-challenge-header">
        <div>
          <span className="section-kicker">
            FINAL CHALLENGE
          </span>

          <h1>Test Your Understanding</h1>
        </div>

        <div className="challenge-score">
          <span>SCORE</span>
          <strong>{score}</strong>
          <small>/ {questions.length}</small>
        </div>
      </div>

      <div className="challenge-progress">
        <div
          className="challenge-progress-fill"
          style={{
            width: `${
              ((currentQuestion + 1) /
                questions.length) *
              100
            }%`,
          }}
        />
      </div>

      <div className="question-meta">
        <span>{question.topic}</span>

        <strong>
          QUESTION {currentQuestion + 1} OF{" "}
          {questions.length}
        </strong>
      </div>

      <article className="final-question-card">
        <h2>{question.question}</h2>

        <div className="final-options">
          {question.options.map((option, index) => {
            const isSelected = selected === index;
            const isCorrect =
              index === question.correct;

            let stateClass = "";

            if (answered && isCorrect) {
              stateClass = "answer-correct";
            } else if (
              answered &&
              isSelected &&
              !isCorrect
            ) {
              stateClass = "answer-incorrect";
            } else if (isSelected) {
              stateClass = "answer-selected";
            }

            return (
              <button
                key={option}
                className={`final-option ${stateClass}`}
                onClick={() => handleAnswer(index)}
              >
                <span className="final-option-letter">
                  {String.fromCharCode(65 + index)}
                </span>

                <span>{option}</span>

                {answered && isCorrect && (
                  <span className="final-option-status">
                    ✓
                  </span>
                )}

                {answered &&
                  isSelected &&
                  !isCorrect && (
                    <span className="final-option-status">
                      ×
                    </span>
                  )}
              </button>
            );
          })}
        </div>

        {answered && (
          <div
            className={`final-feedback ${
              selected === question.correct
                ? "final-feedback-correct"
                : "final-feedback-wrong"
            }`}
          >
            <div className="feedback-title">
              {selected === question.correct
                ? "✓ Correct"
                : "× Incorrect"}
            </div>

            <p>{question.explanation}</p>

            <div className="feedback-equation">
              <Equation expression={question.equation} />
            </div>
          </div>
        )}
      </article>

      <div className="final-navigation">
        <button
          className="secondary-button"
          onClick={onBack}
        >
          ← Review Circular Motion
        </button>

        {answered && (
          <button
            className="primary-button"
            onClick={nextQuestion}
          >
            {currentQuestion === questions.length - 1
              ? "View Results"
              : "Next Question"}
            <span>→</span>
          </button>
        )}
      </div>
    </section>
  );
}

/* =========================================================
   PLACEHOLDER FOR FUTURE SECTIONS
========================================================= */

function PlaceholderSection({
  section,
  onComplete,
  onBack,
}: {
  section: Section;
  onComplete: () => void;
  onBack: () => void;
}) {
  return (
    <section className="lesson-page">
      <div className="lesson-header">
        <span className="section-kicker">
          SECTION {String(section.id).padStart(2, "0")}
        </span>

        <h1>{section.title}</h1>

        <p>
          This section will be built with the same learning
          pattern: concept → interactive model → worked example
          → self-assessment.
        </p>
      </div>

      <div className="lesson-grid">
        <article className="lesson-card concept-card">
          <span className="card-label">CONCEPT</span>

          <h2>Interactive lesson coming next</h2>

          <p>
            This section is intentionally kept as a placeholder
            until its complete physics model is implemented.
          </p>
        </article>

        <article className="lesson-card simulation-card">
          <span className="card-label">
            INTERACTIVE
          </span>

          <div className="simulation-placeholder">
            <div className="simulation-orbit" />
            <div className="simulation-object" />
          </div>

          <h2>Interactive model</h2>

          <p>
            A real physics simulation will replace this
            placeholder.
          </p>
        </article>

        <article className="lesson-card example-card">
          <span className="card-label">
            WORKED EXAMPLE
          </span>

          <h2>Step-by-step solution</h2>

          <p>
            The worked example will use progressive reveal
            steps.
          </p>
        </article>
      </div>

      <div className="lesson-actions">
        <button
          className="secondary-button"
          onClick={onBack}
        >
          ← Previous
        </button>

        <button
          className="primary-button"
          onClick={onComplete}
        >
          Mark Complete
          <span>→</span>
        </button>
      </div>
    </section>
  );
}

export default App;
