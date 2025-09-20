export interface KeystrokeEvent {
  characterPosition: number;
  typedCharacter: string;
  expectedCharacter: string;
  isCorrect: boolean;
  timestampMs: number;
  timeSinceLastKeystrokeMs: number;
}

export interface PerformanceMetrics {
  totalCharacters: number;
  correctCharacters: number;
  totalErrors: number;
  accuracyPercentage: number;
  charactersPerMinute: number;
  sessionDurationSeconds: number;
  keystrokeEvents: KeystrokeEvent[];
}

export class PerformanceTracker {
  private keystrokeEvents: KeystrokeEvent[] = [];
  private startTime: number;
  private lastKeystrokeTime: number;

  constructor() {
    this.startTime = Date.now();
    this.lastKeystrokeTime = this.startTime;
  }

  recordKeystroke(
    position: number,
    typedChar: string,
    expectedChar: string
  ): KeystrokeEvent {
    const now = Date.now();
    const timeSinceLastKeystroke = now - this.lastKeystrokeTime;

    const event: KeystrokeEvent = {
      characterPosition: position,
      typedCharacter: typedChar,
      expectedCharacter: expectedChar,
      isCorrect: typedChar === expectedChar,
      timestampMs: now,
      timeSinceLastKeystrokeMs: timeSinceLastKeystroke,
    };

    this.keystrokeEvents.push(event);
    this.lastKeystrokeTime = now;

    return event;
  }

  getMetrics(): PerformanceMetrics {
    const totalCharacters = this.keystrokeEvents.length;
    const correctCharacters = this.keystrokeEvents.filter(
      (e) => e.isCorrect
    ).length;
    const totalErrors = totalCharacters - correctCharacters;
    const accuracyPercentage =
      totalCharacters > 0 ? (correctCharacters / totalCharacters) * 100 : 0;

    const sessionDurationMs = Date.now() - this.startTime;
    const sessionDurationSeconds = Math.floor(sessionDurationMs / 1000);
    const charactersPerMinute =
      sessionDurationSeconds > 0
        ? Math.floor((correctCharacters / sessionDurationSeconds) * 60)
        : 0;

    return {
      totalCharacters,
      correctCharacters,
      totalErrors,
      accuracyPercentage: Math.round(accuracyPercentage * 100) / 100,
      charactersPerMinute,
      sessionDurationSeconds,
      keystrokeEvents: [...this.keystrokeEvents],
    };
  }

  getRealTimeMetrics(): Partial<PerformanceMetrics> {
    const totalCharacters = this.keystrokeEvents.length;
    const correctCharacters = this.keystrokeEvents.filter(
      (e) => e.isCorrect
    ).length;
    const accuracyPercentage =
      totalCharacters > 0 ? (correctCharacters / totalCharacters) * 100 : 0;

    const sessionDurationMs = Date.now() - this.startTime;
    const sessionDurationSeconds = Math.floor(sessionDurationMs / 1000);
    const charactersPerMinute =
      sessionDurationSeconds > 0
        ? Math.floor((correctCharacters / sessionDurationSeconds) * 60)
        : 0;

    return {
      totalCharacters,
      correctCharacters,
      totalErrors: totalCharacters - correctCharacters,
      accuracyPercentage: Math.round(accuracyPercentage * 100) / 100,
      charactersPerMinute,
      sessionDurationSeconds,
    };
  }

  reset(): void {
    this.keystrokeEvents = [];
    this.startTime = Date.now();
    this.lastKeystrokeTime = this.startTime;
  }
}

// Utility functions for performance analysis
export function calculateWPM(charactersPerMinute: number): number {
  // Assuming average word length of 5 characters
  return Math.floor(charactersPerMinute / 5);
}

export function calculateConsistencyScore(
  keystrokeEvents: KeystrokeEvent[]
): number {
  if (keystrokeEvents.length < 10) return 100;

  // Calculate variance in typing speed
  const intervals = keystrokeEvents
    .slice(1)
    .map(
      (event, index) =>
        event.timeSinceLastKeystrokeMs -
        keystrokeEvents[index].timeSinceLastKeystrokeMs
    );

  const mean =
    intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
  const variance =
    intervals.reduce((sum, interval) => sum + Math.pow(interval - mean, 2), 0) /
    intervals.length;
  const standardDeviation = Math.sqrt(variance);

  // Convert to consistency score (lower variance = higher consistency)
  const maxExpectedVariance = 1000; // 1 second
  const consistencyScore = Math.max(
    0,
    100 - (standardDeviation / maxExpectedVariance) * 100
  );

  return Math.round(consistencyScore);
}

export function analyzeErrorPatterns(keystrokeEvents: KeystrokeEvent[]): {
  commonErrorPositions: number[];
  errorClusters: number[];
  improvementSuggestions: string[];
} {
  const errorPositions = keystrokeEvents
    .filter((e) => !e.isCorrect)
    .map((e) => e.characterPosition);

  const errorClusters: number[] = [];
  let currentCluster = 1;

  for (let i = 1; i < errorPositions.length; i++) {
    if (errorPositions[i] - errorPositions[i - 1] <= 5) {
      currentCluster++;
    } else {
      if (currentCluster > 1) {
        errorClusters.push(currentCluster);
      }
      currentCluster = 1;
    }
  }

  if (currentCluster > 1) {
    errorClusters.push(currentCluster);
  }

  const commonErrorPositions = errorPositions.reduce((acc, pos) => {
    acc[pos] = (acc[pos] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const topErrorPositions = Object.entries(commonErrorPositions)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([pos]) => parseInt(pos));

  const suggestions: string[] = [];

  if (errorClusters.length > 0) {
    suggestions.push("Focus on slowing down during complex code patterns");
  }

  if (topErrorPositions.length > 0) {
    suggestions.push("Practice the problematic character sequences more");
  }

  if (
    keystrokeEvents.filter((e) => !e.isCorrect).length /
      keystrokeEvents.length >
    0.1
  ) {
    suggestions.push("Consider reducing typing speed to improve accuracy");
  }

  return {
    commonErrorPositions: topErrorPositions,
    errorClusters,
    improvementSuggestions: suggestions,
  };
}
