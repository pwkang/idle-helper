export const parseNumber = (str: string = '') => {
  if (!isNaN(Number(str))) return Number(str);

  const num = str.match(/([\d.]+)([kKmMbBtT])/);
  if (!num) return null;

  const [, n, m] = num;
  const multiplier = {
    k: 1e3,
    K: 1e3,
    m: 1e6,
    M: 1e6,
    b: 1e9,
    B: 1e9,
    t: 1e12,
    T: 1e12
  }[m];

  if (isNaN(Number(n)) || !multiplier) return null;
  return Number(n) * multiplier;
};
