import { describe, it, expect } from 'vitest';
import {
  calculateNetForce,
  calculateAcceleration,
  calculateFriction,
  calculateEquilibrium,
  calculateAtwood,
  calculateCentripetal,
  STANDARD_GRAVITY,
} from './physics';
import type { ForceVector } from '../types/physics';

/* ──────────────────────────────────────────────────────────────────────────
   calculateNetForce
────────────────────────────────────────────────────────────────────────── */
describe('calculateNetForce', () => {
  it('sums two forces in the x-direction correctly', () => {
    const result = calculateNetForce([
      { fx: 10, fy: 0 },
      { fx: -4, fy: 0 },
    ]);
    expect(result.netFx).toBeCloseTo(6, 3);
    expect(result.netFy).toBeCloseTo(0, 3);
    expect(result.magnitude).toBeCloseTo(6, 3);
    expect(result.angleDeg).toBeCloseTo(0, 1);
  });

  it('sums forces in both x and y', () => {
    const result = calculateNetForce([
      { fx: 3, fy: 4 },
      { fx: 0, fy: 0 },
    ]);
    expect(result.netFx).toBeCloseTo(3, 3);
    expect(result.netFy).toBeCloseTo(4, 3);
    expect(result.magnitude).toBeCloseTo(5, 3); // 3-4-5 triangle
  });

  it('returns zero magnitude for opposing equal forces (zero-force case)', () => {
    const result = calculateNetForce([
      { fx: 5, fy: 3 },
      { fx: -5, fy: -3 },
    ]);
    expect(result.netFx).toBeCloseTo(0, 3);
    expect(result.netFy).toBeCloseTo(0, 3);
    expect(result.magnitude).toBeCloseTo(0, 3);
  });

  it('handles empty force array', () => {
    const result = calculateNetForce([]);
    expect(result.netFx).toBe(0);
    expect(result.netFy).toBe(0);
    expect(result.magnitude).toBe(0);
  });

  it('sums three forces correctly', () => {
    const result = calculateNetForce([
      { fx: 10, fy: 0 },
      { fx: -3, fy: 5 },
      { fx: 1, fy: -2 },
    ]);
    expect(result.netFx).toBeCloseTo(8, 3);
    expect(result.netFy).toBeCloseTo(3, 3);
  });
});

/* ──────────────────────────────────────────────────────────────────────────
   calculateAcceleration
────────────────────────────────────────────────────────────────────────── */
describe('calculateAcceleration', () => {
  it('computes a = F / m for normal inputs', () => {
    expect(calculateAcceleration(20, 4)).toBeCloseTo(5, 5);
  });

  it('returns negative acceleration for negative net force', () => {
    expect(calculateAcceleration(-15, 3)).toBeCloseTo(-5, 5);
  });

  it('returns 0 when net force is 0', () => {
    expect(calculateAcceleration(0, 2)).toBeCloseTo(0, 5);
  });

  it('throws for mass = 0', () => {
    expect(() => calculateAcceleration(10, 0)).toThrow();
  });

  it('throws for negative mass', () => {
    expect(() => calculateAcceleration(10, -1)).toThrow();
  });
});

/* ──────────────────────────────────────────────────────────────────────────
   calculateFriction
────────────────────────────────────────────────────────────────────────── */
describe('calculateFriction', () => {
  const g = STANDARD_GRAVITY; // 9.81

  it('static case: F_applied < μs·N → object stays still, friction = -F_applied', () => {
    // mass=2, muS=0.5, muK=0.3 → maxStatic = 0.5 * 2 * 9.81 = 9.81 N
    // Applied = 5 N < 9.81 → static
    const result = calculateFriction(2, 0.5, 0.3, 5, g, 0);
    expect(result.isMoving).toBe(false);
    expect(result.frictionForce).toBeCloseTo(-5, 2);
    expect(result.netForce).toBeCloseTo(0, 2);
    expect(result.acceleration).toBeCloseTo(0, 3);
  });

  it('kinetic case: F_applied > μs·N → object moves, uses μk', () => {
    // mass=2, muS=0.5, muK=0.3 → maxStatic=9.81, kinetic=0.3*2*9.81=5.886
    // Applied = 20 N > 9.81 → kinetic
    const result = calculateFriction(2, 0.5, 0.3, 20, g, 0);
    expect(result.isMoving).toBe(true);
    expect(result.kineticFriction).toBeCloseTo(0.3 * 2 * g, 2);
    // friction force opposes motion (negative direction for positive applied)
    expect(result.frictionForce).toBeCloseTo(-(0.3 * 2 * g), 2);
    expect(result.netForce).toBeCloseTo(20 - 0.3 * 2 * g, 2);
  });

  it('edge case: muK > muS → muK is clamped to muS', () => {
    // muS=0.2, muK=0.5 (invalid: kinetic > static) — function clamps muK to muS
    const result = calculateFriction(1, 0.2, 0.5, 5, g, 0);
    expect(result.muK).toBeLessThanOrEqual(result.muS);
  });

  it('already moving: uses kinetic friction regardless of static threshold', () => {
    // currentVelocity > 0 → kinetic branch
    const result = calculateFriction(2, 0.5, 0.3, 5, g, 1.0);
    expect(result.isMoving).toBe(true);
    expect(Math.abs(result.frictionForce)).toBeCloseTo(0.3 * 2 * g, 2);
  });
});

/* ──────────────────────────────────────────────────────────────────────────
   calculateEquilibrium
────────────────────────────────────────────────────────────────────────── */
describe('calculateEquilibrium', () => {
  const makeForce = (magnitude: number, angleDeg: number): ForceVector => ({
    id: `f-${Math.random()}`,
    name: 'Test Force',
    symbol: 'F',
    magnitude,
    angleDeg,
    isActive: true,
    color: '#fff',
  });

  it('balanced set of forces → isEquilibrium = true, net ≈ 0', () => {
    // Two equal opposite forces (0° and 180°)
    const forces = [makeForce(10, 0), makeForce(10, 180)];
    const result = calculateEquilibrium(forces, 0.5);
    expect(result.isEquilibrium).toBe(true);
    expect(result.netMagnitude).toBeCloseTo(0, 1);
  });

  it('unbalanced forces → isEquilibrium = false', () => {
    const forces = [makeForce(10, 0), makeForce(3, 180)];
    const result = calculateEquilibrium(forces, 0.5);
    expect(result.isEquilibrium).toBe(false);
    expect(result.sumFx).toBeCloseTo(7, 1);
  });

  it('3-force equilibrium: 90°, 210°, 330° with equal magnitudes → balanced', () => {
    // Three forces at 120° apart and equal magnitude should sum to ~0
    const mag = 10;
    const forces = [makeForce(mag, 90), makeForce(mag, 210), makeForce(mag, 330)];
    const result = calculateEquilibrium(forces, 1.0); // slightly looser tolerance
    expect(result.isEquilibrium).toBe(true);
  });

  it('inactive forces are excluded from sum', () => {
    const active = makeForce(10, 0);
    const inactive: ForceVector = {
      id: 'f-inactive',
      name: 'Inactive',
      symbol: 'F',
      magnitude: 10,
      angleDeg: 180,
      isActive: false,
      color: '#fff',
    };
    const result = calculateEquilibrium([active, inactive], 0.5);
    expect(result.isEquilibrium).toBe(false); // only active force present
    expect(result.sumFx).toBeCloseTo(10, 1);
  });
});

/* ──────────────────────────────────────────────────────────────────────────
   calculateAtwood
────────────────────────────────────────────────────────────────────────── */
describe('calculateAtwood', () => {
  const g = 9.81;

  it('normal case: matches formula a = |m2-m1|g / (m1+m2)', () => {
    const m1 = 2;
    const m2 = 5;
    const expected = Math.abs(m2 - m1) * g / (m1 + m2);
    const result = calculateAtwood(m1, m2, g);
    expect(result.acceleration).toBeCloseTo(expected, 2);
  });

  it('m2 > m1 → direction is m2_down', () => {
    const result = calculateAtwood(2, 6, g);
    expect(result.direction).toBe('m2_down');
  });

  it('m1 > m2 → direction is m1_down', () => {
    const result = calculateAtwood(6, 2, g);
    expect(result.direction).toBe('m1_down');
  });

  it('equal masses → acceleration is 0, direction is balanced', () => {
    const result = calculateAtwood(4, 4, g);
    expect(result.acceleration).toBeCloseTo(0, 3);
    expect(result.direction).toBe('balanced');
  });

  it('tension is always less than the heavier weight', () => {
    const m1 = 3;
    const m2 = 7;
    const result = calculateAtwood(m1, m2, g);
    const heavierWeight = Math.max(m1, m2) * g;
    expect(result.tension).toBeLessThan(heavierWeight);
  });

  it('tension formula: T = 2*m1*m2*g / (m1+m2)', () => {
    const m1 = 3;
    const m2 = 5;
    const expected = (2 * m1 * m2 * g) / (m1 + m2);
    const result = calculateAtwood(m1, m2, g);
    expect(result.tension).toBeCloseTo(expected, 2);
  });
});

/* ──────────────────────────────────────────────────────────────────────────
   calculateCentripetal
────────────────────────────────────────────────────────────────────────── */
describe('calculateCentripetal', () => {
  it('normal case: centripetal acceleration = v² / r', () => {
    const result = calculateCentripetal(2, 10, 5);
    expect(result.centripetalAcceleration).toBeCloseTo(100 / 5, 2); // 20
  });

  it('centripetal force = m * v² / r', () => {
    const result = calculateCentripetal(2, 10, 5);
    expect(result.centripetalForce).toBeCloseTo(2 * 20, 2); // 40
  });

  it('angular velocity = v / r', () => {
    const result = calculateCentripetal(1, 6, 3);
    expect(result.angularVelocity).toBeCloseTo(2, 3);
  });

  it('period = 2π·r / v', () => {
    const r = 3;
    const v = 6;
    const result = calculateCentripetal(1, v, r);
    // physics.ts rounds period to 2 decimal places via toFixed(2)
    expect(result.period).toBeCloseTo((2 * Math.PI * r) / v, 2);
  });

  it('radius = 0 → clamped to 0.1 (no divide-by-zero, no NaN)', () => {
    const result = calculateCentripetal(1, 5, 0);
    expect(isNaN(result.centripetalAcceleration)).toBe(false);
    expect(isFinite(result.centripetalAcceleration)).toBe(true);
    // Clamped to 0.1, so a = 25 / 0.1 = 250
    expect(result.centripetalAcceleration).toBeCloseTo(250, 1);
  });

  it('velocity = 0 → acceleration and force are both 0', () => {
    const result = calculateCentripetal(2, 0, 5);
    expect(result.centripetalAcceleration).toBeCloseTo(0, 5);
    expect(result.centripetalForce).toBeCloseTo(0, 5);
  });

  it('mass clamped to minimum: mass = 0 → no NaN', () => {
    const result = calculateCentripetal(0, 10, 5);
    expect(isNaN(result.centripetalForce)).toBe(false);
  });
});
