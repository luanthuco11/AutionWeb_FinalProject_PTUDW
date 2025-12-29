export const formatPrice = (num: number | undefined): string => {
  if (num === undefined || isNaN(num)) return "";
  return num.toLocaleString("de-DE");
};
