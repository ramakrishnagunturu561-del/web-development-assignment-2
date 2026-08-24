export interface Vector2D {
  x: number;
  y: number;
}

export interface ForceVector {
  id: string;
  name: string;
  symbol: string;
  magnitude: number; // in Newtons (N)
  angleDeg: number; // 0 = right (+x), 90 = up (+y), 180 = left (-x), 270 = down (-y)
  color: string;
  isActive?: boolean;
  isUserAdded?: boolean;
}

export interface FrictionState {
  mass: number; // kg
  muS: number; // coefficient of static friction
  muK: number; // coefficient of kinetic friction
  appliedForce: number; // N (+ for right, - for left)
  g: number; // m/s^2 (default 9.81)
  normalForce: number; // N
  maxStaticFriction: number; // N
  kineticFriction: number; // N
  frictionForce: number; // N
  netForce: number; // N
  acceleration: number; // m/s^2
  isMoving: boolean;
  velocity: number; // m/s
  position: number; // m
}

export interface AtwoodState {
  m1: number; // kg (left mass)
  m2: number; // kg (right mass)
  g: number; // m/s^2
  acceleration: number; // m/s^2 (positive = m2 accelerating down, m1 accelerating up)
  tension: number; // N
  direction: 'balanced' | 'm1_down' | 'm2_down';
  pos1: number; // vertical position in pixels/meters
  pos2: number;
  velocity: number;
}

export interface CircularMotionState {
  mass: number; // kg
  radius: number; // m
  velocity: number; // m/s
  centripetalAcceleration: number; // m/s^2 (a_c = v^2/r)
  centripetalForce: number; // N (F_c = m*v^2/r)
  angularVelocity: number; // rad/s (omega = v/r)
  period: number; // s (T = 2*pi*r / v)
  angle: number; // current angle in radians
}

export interface EquilibriumState {
  forces: ForceVector[];
  sumFx: number;
  sumFy: number;
  netMagnitude: number;
  isEquilibrium: boolean;
  tolerance: number;
}

export interface FBDScenario {
  id: string;
  title: string;
  description: string;
  context: string;
  correctForces: string[]; // list of force IDs that must be active
  availableForces: {
    id: string;
    label: string;
    symbol: string;
    description: string;
    direction: 'up' | 'down' | 'left' | 'right' | 'diagonal_up_right';
    isCorrect: boolean;
  }[];
  explanation: string;
}
