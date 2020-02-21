export function serializeKeys(keys: string[]) {
  return keys.join('\n') + '\n';
}

export function deserializeKeys(content: string) {
  return content
    .split('\n')
    .map(k => k.trim())
    .filter(Boolean);
}
