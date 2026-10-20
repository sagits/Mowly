// Simulated network latency for every mock resolver.
let minMs = 600;
let maxMs = 1200;

/** Sets the range, in milliseconds, that `delay` waits within. Tests use (0, 0). */
export function setMockDelay(min: number, max: number): void {
  minMs = min;
  maxMs = max;
}

/** Resolves after a random wait in the configured range; at 0 ms it resolves without a timer. */
export function delay(): Promise<void> {
  const ms = minMs + Math.random() * (maxMs - minMs);
  if (ms <= 0) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
}
