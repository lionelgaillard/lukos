export function serializeKeys(keys: string[]) {
  return keys.join('\n');
}

export function deserializeKeys(content: string) {
  return content
    .split('\n')
    .filter(l => l.startsWith('#'))
    .map(k => k.trim())
    .filter(Boolean);
}
