export function tick() {
  return new Promise<void>(resolve => setImmediate(resolve));
}
