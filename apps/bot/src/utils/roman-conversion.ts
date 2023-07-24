const roman = {
  M: 1000,
  CM: 900,
  D: 500,
  CD: 400,
  C: 100,
  L: 50,
  XV: 40,
  X: 10,
  IX: 9,
  V: 5,
  IV: 4,
  I: 1,
} as const;

export const convertNumberToRoman = (num: number) => {
  let str = '';
  for (let i = 0; i < Object.values(roman).length; i++) {
    const current = Object.values(roman)[i];
    const currentKey = Object.keys(roman)[i];
    const next = Object.values(roman)[i + 1];
    const nextKey = Object.keys(roman)[i + 1];
    if (num === 0) {
      return str;
    } else if (num >= current) {
      str += currentKey;
      num -= current;
      i--;
    } else if (num < current && num >= next) {
      str += nextKey;
      num -= next;
      i--;
    }
  }
  return str;
};

export const convertRomanToNumber = (str: string) => {
  let num = 0;
  for (let i = 0; i < str.length; i++) {
    const current = roman[str[i] as keyof typeof roman];
    const next = roman[str[i + 1] as keyof typeof roman];
    if (current < next) {
      num += next - current;
      i++;
    } else {
      num += current;
    }
  }
  return num;
};
