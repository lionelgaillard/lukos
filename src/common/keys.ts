export function serializeKeys(keys: string[]) {
  return keys.join('\n');
}

export function deserializeKeys(content: string) {
  return content
    .split('\n')
    .filter(l => l[0] !== '#')
    .map(k => k.trim())
    .filter(Boolean);
}
