export function formatCurrency(value: number | null, currency = "₫"): string {
  if (value === null || value === undefined) return "0" + currency;

  const numberValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numberValue)) return "0" + currency;

  return numberValue.toLocaleString("vi-VN") + currency;
}
