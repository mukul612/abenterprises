/**
 * The three instrument scales — 01-DESIGN-SYSTEM.md §1.
 *
 * "Same instrument, three physics." Heat for induction, current for rectifiers,
 * power for laser. Everything that positions anything on a scale goes through
 * here, so the tick marks, the band markers and the gradient can never disagree.
 *
 * Why value->position is not a straight line:
 *
 *   heat     The design system's gradient stops (0 16 33 50 67 84 100 %) are
 *            evenly spaced per stop, not linear in temperature. Interpolating
 *            linearly would drift up to 5.4 % — a 1100 °C marker would land at
 *            78.6 %, over gradient showing roughly 1030 °C. So we interpolate
 *            through the declared stops themselves. Gradient untouched, marker
 *            honest.
 *
 *   current  300 A -> 10,000 A with products at 300/500/1000/1500/2000/3000/
 *            5000/8000/10000. Linear would bury the first four ratings inside
 *            the leftmost 12 % of the bar. Logarithmic spaces the actual
 *            product ladder evenly, which is what makes it readable.
 *
 *   power    1000 W -> 3000 W is a 3x span with products at 1000/1500/2000/
 *            3000. Linear and log are within a few percent; linear is used
 *            because the axis is small enough to read directly.
 */

export type ScaleKind = 'heat' | 'current' | 'power';

export type Band = readonly [number, number];

type Mapping =
  | { readonly type: 'stops'; readonly stops: ReadonlyArray<readonly [number, number]> }
  | { readonly type: 'log' }
  | { readonly type: 'linear' };

export interface ScaleDef {
  readonly kind: ScaleKind;
  readonly min: number;
  readonly max: number;
  readonly unit: string;
  /** CSS custom property holding the gradient, from tokens.css */
  readonly gradient: string;
  /** Tick values rendered beneath the bar, §6 */
  readonly ticks: readonly number[];
  readonly mapping: Mapping;
  /** Accessible name for the instrument as a whole */
  readonly label: string;
}

export const SCALES: Record<ScaleKind, ScaleDef> = {
  heat: {
    kind: 'heat',
    min: 550,
    max: 1250,
    unit: '°C',
    gradient: '--heat-scale',
    // §6: "mono tick labels at 550/700/850/1000/1250 °C beneath"
    ticks: [550, 700, 850, 1000, 1250],
    mapping: {
      type: 'stops',
      stops: [
        [550, 0],
        [700, 16],
        [800, 33],
        [900, 50],
        [1000, 67],
        [1100, 84],
        [1250, 100],
      ],
    },
    label: 'Steel incandescence temperature scale, 550 to 1250 °C',
  },

  current: {
    kind: 'current',
    min: 300,
    max: 10_000,
    unit: 'A',
    gradient: '--current-scale',
    ticks: [300, 500, 1000, 2000, 5000, 10_000],
    mapping: { type: 'log' },
    label: 'Rectifier output current scale, 300 to 10,000 A',
  },

  power: {
    kind: 'power',
    min: 1000,
    max: 3000,
    unit: 'W',
    gradient: '--power-scale',
    ticks: [1000, 1500, 2000, 2500, 3000],
    mapping: { type: 'linear' },
    label: 'Fibre laser output power scale, 1000 to 3000 W',
  },
};

/**
 * Map a value to its position on the bar, 0-100.
 *
 * Returns the clamped position plus whether the value fell outside the scale,
 * so callers can render an honest out-of-range indicator instead of silently
 * pinning a marker to an edge and implying a reading the scale cannot make.
 */
export function valueToPercent(
  kind: ScaleKind,
  value: number,
): { percent: number; outOfRange: 'below' | 'above' | null } {
  const s = SCALES[kind];
  const outOfRange = value < s.min ? 'below' : value > s.max ? 'above' : null;
  const v = Math.min(Math.max(value, s.min), s.max);

  let percent: number;
  switch (s.mapping.type) {
    case 'stops': {
      const stops = s.mapping.stops;
      percent = stops[stops.length - 1][1];
      for (let i = 0; i < stops.length - 1; i++) {
        const [v0, p0] = stops[i];
        const [v1, p1] = stops[i + 1];
        if (v <= v1) {
          percent = p0 + ((v - v0) / (v1 - v0)) * (p1 - p0);
          break;
        }
      }
      break;
    }
    case 'log': {
      const lo = Math.log(s.min);
      percent = ((Math.log(v) - lo) / (Math.log(s.max) - lo)) * 100;
      break;
    }
    case 'linear': {
      percent = ((v - s.min) / (s.max - s.min)) * 100;
      break;
    }
  }

  return { percent: Math.min(Math.max(percent, 0), 100), outOfRange };
}

/** Format a value with its unit, using the thin groupings mono type expects. */
export function formatValue(kind: ScaleKind, value: number): string {
  const s = SCALES[kind];
  const n = value >= 10_000 ? value.toLocaleString('en-GB') : String(value);
  return `${n} ${s.unit}`;
}

/** Format a band as an operating window, e.g. "850-950 °C". */
export function formatBand(kind: ScaleKind, band: Band): string {
  const s = SCALES[kind];
  const [lo, hi] = band;
  const f = (n: number) => (n >= 10_000 ? n.toLocaleString('en-GB') : String(n));
  return `${f(lo)}–${f(hi)} ${s.unit}`;
}

/**
 * Named process bands — §1.
 *
 * NOTE the range problem, flagged in the build notes: the heat scale is defined
 * 550-1250 °C because that is where steel is visibly incandescent, but several
 * processes in the catalogue run below 550 °C — tempering (200-400) is one of
 * the four examples §1 itself gives, and soldering, bonding, shrink fitting and
 * stress relieving are all sub-incandescent too. Those bands are marked
 * `subIncandescent` and the instrument renders them as explicitly out of range
 * rather than pinning them to the left edge and implying a reading it cannot
 * make. Resolving this properly needs a decision — see the build notes.
 */
export const PROCESS_BANDS = {
  'induction-hardening': { band: [850, 950], kind: 'heat' },
  'induction-brazing': { band: [600, 800], kind: 'heat' },
  'induction-forging': { band: [1150, 1250], kind: 'heat' },
  'billet-heating': { band: [1100, 1250], kind: 'heat' },
  'bar-end-heating': { band: [1100, 1250], kind: 'heat' },
  'induction-annealing': { band: [650, 900], kind: 'heat' },
  'induction-preheating': { band: [150, 400], kind: 'heat', subIncandescent: true },
  'induction-tempering': { band: [200, 400], kind: 'heat', subIncandescent: true },
  'induction-soldering': { band: [200, 400], kind: 'heat', subIncandescent: true },
  'induction-bonding': { band: [150, 250], kind: 'heat', subIncandescent: true },
  'shrink-fitting': { band: [150, 350], kind: 'heat', subIncandescent: true },
  'stress-relieving': { band: [450, 650], kind: 'heat', subIncandescent: true },
  'post-weld-heat-treatment': { band: [550, 750], kind: 'heat' },
  'induction-straightening': { band: [600, 800], kind: 'heat' },
} as const satisfies Record<
  string,
  { band: Band; kind: ScaleKind; subIncandescent?: boolean }
>;

export type ProcessKey = keyof typeof PROCESS_BANDS;
