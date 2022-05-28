export const debounce = (func: Function, timer: number) => {
  let flag: number;
  return function (...args: any[]) {
    clearTimeout(flag);
    flag = window.setTimeout(() => {
      func(...args);
    }, timer || 50);
  };
}

export default { debounce };
