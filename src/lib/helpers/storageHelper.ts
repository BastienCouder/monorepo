export function getLocalStorage(key: string, defaultValue: any) {
  if (typeof window !== 'undefined') {
    const stickyValue = localStorage.getItem(key);
    return stickyValue !== null && stickyValue !== 'undefined'
      ? JSON.parse(stickyValue)
      : defaultValue;
  }
  return defaultValue;
}

export function setLocalStorage(key: string, value: any) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
