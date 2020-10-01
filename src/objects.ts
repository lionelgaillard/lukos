export function getKeys(data: any, prefix: string = '') {
  return Object.keys(data).reduce((keys, key) => {
    if (!data[key] || typeof data[key] === 'string') {
      keys.push(prefix + key);
    } else {
      keys = [...keys, ...getKeys(data[key], prefix + key + '.')];
    }
    return keys;
  }, []);
}
