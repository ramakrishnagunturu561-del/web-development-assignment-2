import React from 'react';
import { AlertTriangle, CheckCircle2, XCircle, HelpCircle, BookOpen } from 'lucide-react';

/* ── Misconception data — aggregated from all 8 section MisconceptionCard props ── */
export interface MisconceptionEntry {
  sectionId: number;          // matches App.tsx section id (1–9)
  sectionTitle: string;
  myth: string;
  reality: string;
  scientificExplanation: string;
  whyItMatters?: string;
}

export const MISCONCEPTIONS: MisconceptionEntry[] = [
  {
    sectionId: 2,
    sectionTitle: "Newton's First Law",
    myth: "If an object is moving, there must be a forward force pushing it. Zero net force means zero velocity (the object must be stopped).",
    reality: "Zero net force means ZERO ACCELERATION (a = 0), which means velocity is CONSTANT. An object can move at 10,000 m/s with zero net force!",
    scientificExplanation:
      "Force is required only to CHANGE velocity (to accelerate, decelerate, or change direction). In the absence of resistance or external forces, motion continues indefinitely due to mass inertia.",
    whyItMatters:
      "IB exam problems often describe objects moving at constant velocity (e.g. aircraft in level flight, terminal velocity) where ΣF = 0 even though the object is moving.",
  },
  {
    sectionId: 3,
    sectionTitle: "Newton's Second Law",
    myth: "Acceleration is always in the direction of the applied force or the direction the object is currently moving.",
    reality: "Acceleration is ALWAYS in the direction of the RESULTANT NET FORCE (ΣF), not necessarily the applied force or the velocity vector!",
    scientificExplanation:
      "If a car is moving forward at 30 m/s and the driver hits the brakes, the net force points backwards (due to friction). The acceleration points backwards (a < 0) even though velocity is still forward!",
    whyItMatters:
      "IB examiners frequently test braking objects and upward projectiles where velocity and acceleration point in opposite directions.",
  },
  {
    sectionId: 4,
    sectionTitle: "Newton's Third Law",
    myth: "Action and reaction forces cancel each other out, making ΣF = 0, so nothing should ever be able to move or accelerate.",
    reality: "Action and reaction forces do NOT cancel out because they act on DIFFERENT OBJECTS! When calculating ΣF for body B, you only sum forces acting ON body B.",
    scientificExplanation:
      "To find the acceleration of body B, you evaluate ΣF_B / m_B, which includes F_{A→B}. The reaction force F_{B→A} acts on body A, so it has zero direct effect on body B's free-body diagram!",
    whyItMatters:
      "A common IB mistake is drawing Newton's 3rd Law pair forces on the same free-body diagram. Each FBD must represent only ONE body.",
  },
  {
    sectionId: 5,
    sectionTitle: "Free-Body Diagrams",
    myth: "The normal force N is always equal in magnitude to the weight mg.",
    reality: "The normal force N is a contact constraint force that adjusts to whatever value prevents the surfaces from penetrating! It is only equal to mg when resting on a horizontal surface with no vertical applied forces or accelerations.",
    scientificExplanation:
      "If you pull upward on an object with force F_lift, N = mg − F_lift (N < mg). In an upward accelerating elevator, N = m(g + a) (N > mg). On an incline of angle θ, N = mg cos(θ) (N < mg)!",
    whyItMatters:
      "IB Paper 2 routinely tests inclined planes and pulley systems where N ≠ mg. Using N = mg in those contexts produces the wrong friction force.",
  },
  {
    sectionId: 6,
    sectionTitle: "Friction Mechanics",
    myth: "Static friction is always equal to μs * N, and friction always opposes the direction an object is moving.",
    reality: "Static friction is an INEQUALITY (fs ≤ μs N) that exactly equals the applied force up to the threshold! Furthermore, static friction can ACCELERATE objects (e.g. friction between your shoes and the floor pushes you forward when walking!).",
    scientificExplanation:
      "If you push a 100 kg box with only 5 N, static friction responds with exactly 5 N (not μs N = 490 N). If static friction were always μs N, a light tap would cause the box to shoot backwards!",
    whyItMatters:
      "IB data-based questions often ask you to identify whether static or kinetic friction applies, and to calculate friction force correctly using the inequality, not the equality.",
  },
  {
    sectionId: 7,
    sectionTitle: "Translational Equilibrium",
    myth: "If a cable is pulled tighter and becomes nearly horizontal, the tension in the cable decreases because it does not carry much weight.",
    reality: "As a support cable approaches horizontal (θ → 0°), the required tension approaches INFINITY! It is physically impossible to pull any real cable into a perfectly horizontal line.",
    scientificExplanation:
      "To balance vertical weight W, the cable must supply an upward component 2T sin(θ) = W ⇒ T = W / (2 sin θ). As θ → 0°, sin(θ) → 0, so T → ∞!",
    whyItMatters:
      "Bridge cable and tightrope IB problems require calculating T at small angles where T is very large — using cos instead of sin is a common error that gives the wrong answer.",
  },
  {
    sectionId: 8,
    sectionTitle: "Atwood Machine",
    myth: "The tension T in the string is equal to the weight of the heavier mass (T = m₂g) or the sum of weights (T = m₁g + m₂g).",
    reality: "If T were equal to m₂g, the heavier mass would have zero net force and could not accelerate downwards! Tension T is strictly LESS than m₂g and GREATER than m₁g.",
    scientificExplanation:
      "For m₂ to accelerate down, m₂g > T. For m₁ to accelerate up, T > m₁g. Therefore, W₁ < T < W₂. Tension self-adjusts to the harmonic mean of the masses: T = 2m₁m₂g / (m₁ + m₂).",
    whyItMatters:
      "IB Paper 2 Atwood questions ask for both acceleration and tension separately. Using T = m₂g would give zero acceleration — a classic full-mark error.",
  },
  {
    sectionId: 9,
    sectionTitle: "Uniform Circular Motion",
    myth: "There is an outward 'centrifugal force' throwing objects away from the center of a circle. When a string snaps, the ball flies straight outwards.",
    reality: "Centrifugal force is a FICTITIOUS effect felt only in a rotating non-inertial frame. In reality, there is only an INWARD centripetal force! When the string snaps, the object flies off along the straight-line TANGENT (Newton's 1st Law), NOT radially outward!",
    scientificExplanation:
      "Try the 'Cut Tether String!' button in the simulation above: the particle instantly transitions into a straight line in the direction of its tangential velocity at that exact moment.",
    whyItMatters:
      "IB examiners explicitly prohibit drawing centrifugal force on free-body diagrams for objects in circular motion. Marks are deducted for including it.",
  },
];

/* ── Component ──────────────────────────────────────────────────────────── */
interface MisconceptionRecapProps {
  onJumpToSection: (sectionId: number) => void;
  onComplete: () => void;
  onBack: () => void;
}

export const MisconceptionRecap: React.FC<MisconceptionRecapProps> = ({
  onJumpToSection,
  onComplete,
  onBack,
}) => {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <section className="hero-card" style={{ padding: '2rem 2.5rem' }}>
        <div className="hero-eyebrow">REVIEW • CHAPTER 2</div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>
          Common{' '}
          <span style={{ color: 'var(--accent-primary, #06b6d4)' }}>
            Misconceptions
          </span>{' '}
          Recap
        </h1>
        <p
          style={{
            color: 'rgba(248,250,252,0.65)',
            fontSize: '1rem',
            maxWidth: '640px',
            lineHeight: '1.65',
            marginBottom: '1.5rem',
          }}
        >
          Every section in this chapter includes a misconception callout. Here
          they are all in one place — a quick-scan review of the eight most
          common physics thinking errors in IB Chapter 2, with jump links back
          to the original lesson.
        </p>
        <div className="hero-actions" style={{ flexDirection: 'row', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="secondary-button" onClick={onBack} type="button">
            ← Back
          </button>
          <button className="primary-button" onClick={onComplete} type="button">
            Continue to Final Challenge →
          </button>
        </div>
      </section>

      {/* Misconception Cards */}
      <div className="space-y-5">
        {MISCONCEPTIONS.map((m) => (
          <MisconceptionRecapCard
            key={m.sectionId}
            entry={m}
            onJump={() => onJumpToSection(m.sectionId)}
          />
        ))}
      </div>

      {/* Bottom CTA */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          borderRadius: '16px',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <p style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.95rem', margin: 0 }}>
            Reviewed all 8 misconceptions?
          </p>
          <p style={{ color: 'rgba(148,163,184,0.8)', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>
            Head to the Final Challenge to test your mastery.
          </p>
        </div>
        <button className="primary-button" onClick={onComplete} type="button">
          Final Challenge →
        </button>
      </div>
    </div>
  );
};

/* ── Individual card ─────────────────────────────────────────────────────── */
interface CardProps {
  entry: MisconceptionEntry;
  onJump: () => void;
}

const MisconceptionRecapCard: React.FC<CardProps> = ({ entry, onJump }) => (
  <div
    style={{
      background:
        'linear-gradient(135deg, rgba(30, 27, 75, 0.4) 0%, rgba(15, 23, 42, 0.9) 100%)',
      border: '1px solid rgba(244, 63, 94, 0.35)',
      borderRadius: '16px',
      boxShadow: '0 8px 30px rgba(244, 63, 94, 0.08)',
      padding: '1.25rem 1.5rem',
    }}
  >
    {/* Card header */}
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid rgba(244, 63, 94, 0.2)',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span
          style={{
            padding: '0.375rem',
            borderRadius: '8px',
            background: 'rgba(244, 63, 94, 0.15)',
            color: '#fb7185',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <AlertTriangle size={15} />
        </span>
        <div>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              color: '#fb7185',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              display: 'block',
            }}
          >
            Common Misconception Alert
          </span>
          <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>
            Section: {entry.sectionTitle}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={onJump}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          padding: '0.35rem 0.75rem',
          borderRadius: '8px',
          background: 'rgba(6, 182, 212, 0.1)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          color: '#67e8f9',
          fontSize: '11px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          whiteSpace: 'nowrap',
        }}
        aria-label={`Jump to ${entry.sectionTitle} lesson`}
      >
        <BookOpen size={12} />
        Jump to lesson
      </button>
    </div>

    {/* Myth vs Reality */}
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '0.75rem',
        marginBottom: '0.75rem',
      }}
    >
      {/* Myth */}
      <div
        style={{
          padding: '0.75rem',
          borderRadius: '12px',
          background: 'rgba(127, 29, 29, 0.25)',
          border: '1px solid rgba(244, 63, 94, 0.25)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            marginBottom: '0.35rem',
          }}
        >
          <XCircle size={13} color="#fb7185" />
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              color: '#fb7185',
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
            }}
          >
            Common Intuition (False)
          </span>
        </div>
        <p style={{ fontSize: '13px', color: 'rgba(254,202,202,0.9)', fontStyle: 'italic', margin: 0 }}>
          "{entry.myth}"
        </p>
      </div>

      {/* Reality */}
      <div
        style={{
          padding: '0.75rem',
          borderRadius: '12px',
          background: 'rgba(6, 78, 59, 0.25)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            marginBottom: '0.35rem',
          }}
        >
          <CheckCircle2 size={13} color="#34d399" />
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              color: '#34d399',
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
            }}
          >
            Physics Reality (True)
          </span>
        </div>
        <p style={{ fontSize: '13px', color: 'rgba(167,243,208,0.9)', fontWeight: 500, margin: 0 }}>
          "{entry.reality}"
        </p>
      </div>
    </div>

    {/* Scientific Explanation */}
    <div
      style={{
        padding: '0.75rem',
        borderRadius: '12px',
        background: 'rgba(15, 23, 42, 0.7)',
        border: '1px solid rgba(51, 65, 85, 0.8)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          marginBottom: '0.35rem',
          color: '#67e8f9',
          fontWeight: 600,
          fontSize: '12px',
        }}
      >
        <HelpCircle size={12} />
        Why this happens in physics:
      </div>
      <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
        {entry.scientificExplanation}
      </p>
      {entry.whyItMatters && (
        <p
          style={{
            marginTop: '0.5rem',
            paddingTop: '0.5rem',
            borderTop: '1px solid rgba(51,65,85,0.8)',
            fontSize: '11px',
            color: '#94a3b8',
            fontFamily: 'monospace',
            margin: '0.5rem 0 0',
          }}
        >
          <span style={{ color: '#fbbf24', fontWeight: 700 }}>IB Exam Note: </span>
          {entry.whyItMatters}
        </p>
      )}
    </div>
  </div>
);
