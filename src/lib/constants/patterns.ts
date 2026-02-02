export interface PatternDefinition {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'reversal' | 'continuation' | 'breakout' | 'institutional';
  winRate: string;
  avgRR: string;
  failureRate: string;
  timeframes: string[];
  bestSessions: string[];
  keyCharacteristics: string[];
  entryRules: string[];
  invalidationConditions: string[];
  commonMistakes: string[];
  contextRequirements: string[];
}

export const PATTERNS: PatternDefinition[] = [
  {
    id: 'engulfing',
    title: 'Engulfing Pattern',
    description: 'A two-candle reversal pattern where the second candle completely engulfs the body of the first, showing a decisive shift in control from buyers to sellers or vice versa.',
    difficulty: 'beginner',
    category: 'reversal',
    winRate: '55-60%',
    avgRR: '1.8:1',
    failureRate: '40-45%',
    timeframes: ['1H', '4H', 'Daily'],
    bestSessions: ['London', 'New York'],
    keyCharacteristics: [
      'Second candle body completely covers the first candle body',
      'Second candle closes beyond the first candle open',
      'Higher volume on the engulfing candle is confirming',
      'Works best at key support/resistance levels',
    ],
    entryRules: [
      'Wait for the engulfing candle to close completely',
      'Entry on the next candle open or on a small pullback',
      'Stop loss below/above the engulfing candle wick',
      'Target minimum 1.5:1 risk-reward ratio',
    ],
    invalidationConditions: [
      'Price closes back inside the engulfing candle range',
      'No clear support/resistance context',
      'Pattern forms in the middle of a range with no directional bias',
      'Very small engulfing candle relative to recent price action',
    ],
    commonMistakes: [
      'Trading engulfing patterns without context (support/resistance)',
      'Entering before the candle closes',
      'Ignoring the higher timeframe trend',
      'Setting stops too tight inside the pattern',
    ],
    contextRequirements: [
      'Must form at a key support or resistance level',
      'Should align with higher timeframe trend or be at a major reversal zone',
      'Avoid during low-liquidity periods',
    ],
  },
  {
    id: 'pin-bar',
    title: 'Pin Bar',
    description: 'A single-candle rejection pattern with a long wick showing a failed attempt to push price in one direction, indicating potential reversal.',
    difficulty: 'beginner',
    category: 'reversal',
    winRate: '50-55%',
    avgRR: '2.0:1',
    failureRate: '45-50%',
    timeframes: ['1H', '4H', 'Daily'],
    bestSessions: ['London', 'New York'],
    keyCharacteristics: [
      'Long wick at least 2/3 of total candle length',
      'Small body at the opposite end of the wick',
      'Wick shows clear rejection of a price level',
      'More reliable at swing highs/lows',
    ],
    entryRules: [
      'Wait for the pin bar candle to close',
      'Entry on break of the pin bar nose (small body end)',
      'Stop loss beyond the pin bar wick tip',
      'Target 2:1 or higher risk-reward',
    ],
    invalidationConditions: [
      'Price trades through the pin bar wick',
      'No clear level being rejected',
      'Pin bar forms in choppy, range-bound conditions without clear levels',
      'Wick is not significantly longer than recent candle wicks',
    ],
    commonMistakes: [
      'Trading every pin bar regardless of location',
      'Not waiting for the candle to close',
      'Setting target too close in a strong trend',
      'Ignoring the direction of the prevailing trend',
    ],
    contextRequirements: [
      'Must reject a key level (support, resistance, moving average)',
      'Trend direction alignment increases probability',
      'Avoid in consolidation zones',
    ],
  },
  {
    id: 'break-retest',
    title: 'Break and Retest',
    description: 'Price breaks through a key level, pulls back to test the broken level as new support/resistance, then continues in the breakout direction.',
    difficulty: 'intermediate',
    category: 'breakout',
    winRate: '50-58%',
    avgRR: '2.5:1',
    failureRate: '42-50%',
    timeframes: ['15M', '1H', '4H'],
    bestSessions: ['London', 'New York'],
    keyCharacteristics: [
      'Clear break of a well-defined support/resistance level',
      'Pullback to the broken level (role reversal)',
      'Rejection candle at the retested level',
      'Volume typically decreases on pullback and increases on continuation',
    ],
    entryRules: [
      'Identify a clean break of a key level with momentum',
      'Wait for price to pull back and retest the broken level',
      'Enter on a rejection candle at the retest level',
      'Stop loss on the other side of the retested level',
      'Target the next significant level or measured move',
    ],
    invalidationConditions: [
      'Price closes back through the broken level (false break)',
      'No clear rejection at the retest level',
      'Retest takes too long (momentum lost)',
      'Multiple retests weaken the level',
    ],
    commonMistakes: [
      'Entering on the initial break instead of waiting for the retest',
      'Not confirming the break with a candle close',
      'Trading retests of weak or untested levels',
      'Chasing when the retest doesn\'t come back far enough',
    ],
    contextRequirements: [
      'Level must have been tested at least twice before breaking',
      'Break should be with momentum (strong candle close)',
      'Higher timeframe trend alignment preferred',
    ],
  },
  {
    id: 'order-block',
    title: 'Order Block Entry',
    description: 'Institutional order blocks represent zones where large players accumulated positions. Price tends to react when revisiting these zones.',
    difficulty: 'advanced',
    category: 'institutional',
    winRate: '52-58%',
    avgRR: '3.0:1',
    failureRate: '42-48%',
    timeframes: ['1H', '4H', 'Daily'],
    bestSessions: ['London', 'New York'],
    keyCharacteristics: [
      'Last opposing candle before a strong impulsive move',
      'Often contains a fair value gap (FVG) nearby',
      'Represents institutional accumulation/distribution zones',
      'Higher timeframe order blocks are more significant',
    ],
    entryRules: [
      'Identify the last bearish candle before a bullish impulse (bullish OB) or vice versa',
      'Mark the order block zone (candle body high to low)',
      'Wait for price to return to the order block zone',
      'Enter with a confirming rejection candle inside the zone',
      'Stop loss below/above the order block zone',
    ],
    invalidationConditions: [
      'Price trades completely through the order block',
      'Order block has already been mitigated (traded through previously)',
      'No impulsive move away from the block originally',
      'Block is too old (structure has shifted)',
    ],
    commonMistakes: [
      'Marking every candle as an order block',
      'Not understanding the difference between mitigated and unmitigated blocks',
      'Trading against the higher timeframe structure',
      'Using order blocks without understanding market structure shifts',
    ],
    contextRequirements: [
      'Must have caused a break of structure',
      'Unmitigated (price has not returned to the zone yet)',
      'Aligned with the current market structure direction',
      'Higher timeframe confirmation preferred',
    ],
  },
];

export function getPatternById(id: string): PatternDefinition | undefined {
  return PATTERNS.find((p) => p.id === id);
}

export function getPatternsByDifficulty(difficulty: PatternDefinition['difficulty']): PatternDefinition[] {
  return PATTERNS.filter((p) => p.difficulty === difficulty);
}

export function getPatternsByCategory(category: PatternDefinition['category']): PatternDefinition[] {
  return PATTERNS.filter((p) => p.category === category);
}
