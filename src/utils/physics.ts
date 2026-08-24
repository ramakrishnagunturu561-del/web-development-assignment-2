import type { ForceVector, FrictionState, EquilibriumState } from '../types/physics';

/**
 * Pure physics utility functions for ForceLab.
 * Implements mechanics according to Tsokos (IB Physics 7th Ed, Chapter 2).
 */

export const STANDARD_GRAVITY = 9.81; // m/s^2

/**
 * Calculates net force in 2D Cartesian components and polar form (magnitude, angle in degrees).
 */
export function calculateNetForce(forces: { fx: number; fy: number }[]): {
  netFx: number;
  netFy: number;
  magnitude: number;
  angleDeg: number;
} {
  let netFx = 0;
  let netFy = 0;

  for (const f of forces) {
    netFx += f.fx;
    netFy += f.fy;
  }

  // Handle tiny floating point errors
  if (Math.abs(netFx) < 1e-9) netFx = 0;
  if (Math.abs(netFy) < 1e-9) netFy = 0;

  const magnitude = Math.sqrt(netFx * netFx + netFy * netFy);
  let angleDeg = (Math.atan2(netFy, netFx) * 180) / Math.PI;
  if (angleDeg < 0) angleDeg += 360;

  return {
    netFx: Number(netFx.toFixed(4)),
    netFy: Number(netFy.toFixed(4)),
    magnitude: Number(magnitude.toFixed(4)),
    angleDeg: Number(angleDeg.toFixed(2)),
  };
}

/**
 * Calculates acceleration using Newton's Second Law: a = ΣF / m.
 * Validates against mass <= 0.
 */
export function calculateAcceleration(netForce: number, mass: number): number {
  if (mass <= 0) {
    throw new Error('Mass must be greater than zero.');
  }
  return netForce / mass;
}

/**
 * Calculates normal force on horizontal or inclined plane with vertical applied forces.
 * N = m * g * cos(theta) - F_vertical
 */
export function calculateNormalForce(
  mass: number,
  g: number = STANDARD_GRAVITY,
  verticalAppliedForce: number = 0,
  inclineAngleDeg: number = 0
): number {
  if (mass < 0) return 0;
  const rad = (inclineAngleDeg * Math.PI) / 180;
  const normalComponent = mass * g * Math.cos(rad) - verticalAppliedForce;
  return Math.max(0, normalComponent);
}

/**
 * Pure calculation of static & dynamic friction states.
 */
export function calculateFriction(
  mass: number,
  muS: number,
  muK: number,
  appliedForce: number,
  g: number = STANDARD_GRAVITY,
  currentVelocity: number = 0
): FrictionState {
  const safeMass = Math.max(0.1, mass);
  const safeMuS = Math.max(0, muS);
  const safeMuK = Math.min(safeMuS, Math.max(0, muK));

  const normalForce = safeMass * g;
  const maxStaticFriction = safeMuS * normalForce;
  const kineticFriction = safeMuK * normalForce;

  let isMoving = Math.abs(currentVelocity) > 0.001;
  let frictionForce = 0;
  let netForce = 0;
  let acceleration = 0;

  if (!isMoving) {
    if (Math.abs(appliedForce) <= maxStaticFriction) {
      frictionForce = -appliedForce;
      netForce = 0;
      acceleration = 0;
      isMoving = false;
    } else {
      isMoving = true;
      const direction = appliedForce >= 0 ? 1 : -1;
      frictionForce = -direction * kineticFriction;
      netForce = appliedForce + frictionForce;
      acceleration = calculateAcceleration(netForce, safeMass);
    }
  } else {
    const direction = currentVelocity > 0 ? 1 : currentVelocity < 0 ? -1 : (appliedForce >= 0 ? 1 : -1);
    frictionForce = -direction * kineticFriction;
    netForce = appliedForce + frictionForce;
    acceleration = calculateAcceleration(netForce, safeMass);
  }

  return {
    mass: safeMass,
    muS: safeMuS,
    muK: safeMuK,
    appliedForce,
    g,
    normalForce: Number(normalForce.toFixed(2)),
    maxStaticFriction: Number(maxStaticFriction.toFixed(2)),
    kineticFriction: Number(kineticFriction.toFixed(2)),
    frictionForce: Number(frictionForce.toFixed(2)),
    netForce: Number(netForce.toFixed(2)),
    acceleration: Number(acceleration.toFixed(3)),
    isMoving,
    velocity: currentVelocity,
    position: 0,
  };
}

/**
 * Calculates translational equilibrium state for a set of 2D force vectors.
 */
export function calculateEquilibrium(
  forces: ForceVector[],
  tolerance: number = 0.5
): EquilibriumState {
  let sumFx = 0;
  let sumFy = 0;

  for (const f of forces) {
    if (f.isActive !== false) {
      const rad = (f.angleDeg * Math.PI) / 180;
      sumFx += f.magnitude * Math.cos(rad);
      sumFy += f.magnitude * Math.sin(rad);
    }
  }

  if (Math.abs(sumFx) < 1e-6) sumFx = 0;
  if (Math.abs(sumFy) < 1e-6) sumFy = 0;

  const netMagnitude = Math.sqrt(sumFx * sumFx + sumFy * sumFy);
  const isEquilibrium = netMagnitude <= tolerance;

  return {
    forces,
    sumFx: Number(sumFx.toFixed(2)),
    sumFy: Number(sumFy.toFixed(2)),
    netMagnitude: Number(netMagnitude.toFixed(2)),
    isEquilibrium,
    tolerance,
  };
}

/**
 * Calculates Atwood machine dynamics.
 */
export function calculateAtwood(
  m1: number,
  m2: number,
  g: number = STANDARD_GRAVITY
): {
  acceleration: number;
  tension: number;
  direction: 'balanced' | 'm1_down' | 'm2_down';
} {
  const safeM1 = Math.max(0.01, m1);
  const safeM2 = Math.max(0.01, m2);
  const totalMass = safeM1 + safeM2;

  const signedAcc = ((safeM2 - safeM1) / totalMass) * g;
  const acceleration = Math.abs(signedAcc);
  const tension = (2 * safeM1 * safeM2 * g) / totalMass;

  let direction: 'balanced' | 'm1_down' | 'm2_down' = 'balanced';
  if (signedAcc > 0.001) {
    direction = 'm2_down';
  } else if (signedAcc < -0.001) {
    direction = 'm1_down';
  }

  return {
    acceleration: Number(acceleration.toFixed(3)),
    tension: Number(tension.toFixed(2)),
    direction,
  };
}

/**
 * Calculates Uniform Circular Motion dynamics.
 */
export function calculateCentripetal(
  mass: number,
  velocity: number,
  radius: number
): {
  centripetalAcceleration: number;
  centripetalForce: number;
  angularVelocity: number;
  period: number;
} {
  const safeMass = Math.max(0.01, mass);
  const safeVelocity = Math.max(0, velocity);
  const safeRadius = Math.max(0.1, radius);

  const centripetalAcceleration = (safeVelocity * safeVelocity) / safeRadius;
  const centripetalForce = safeMass * centripetalAcceleration;
  const angularVelocity = safeVelocity / safeRadius;
  const period = safeVelocity > 0 ? (2 * Math.PI * safeRadius) / safeVelocity : Infinity;

  return {
    centripetalAcceleration: Number(centripetalAcceleration.toFixed(3)),
    centripetalForce: Number(centripetalForce.toFixed(2)),
    angularVelocity: Number(angularVelocity.toFixed(3)),
    period: Number(period.toFixed(2)),
  };
}

/**
 * Helper to format numeric values cleanly for UI.
 */
export function formatNum(val: number, decimals: number = 2): string {
  if (isNaN(val) || !isFinite(val)) return '0';
  return Number(val.toFixed(decimals)).toString();
}
