export const debounce = (callback: (...args: any[]) => any, timeout: number) => {
    let timeoutId: number;

    return (...args: any[]) => new Promise((resolve) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const value = callback(...args);
        resolve(value)
      }, timeout);
    });
  }