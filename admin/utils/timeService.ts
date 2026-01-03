export function formatDate(date?: Date | string): string {
  if (!date) return "--";
  const d = date instanceof Date ? date : new Date(date);

  if (isNaN(d.getTime())) return "--";

  const pad = (n: number) => n.toString().padStart(2, "0");

  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1);
  const year = d.getFullYear();
  const hour = pad(d.getHours());
  const minute = pad(d.getMinutes());
  const second = pad(d.getSeconds());

  return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
}
export const formatDateISO = (
  dateValue: Date | string | undefined | null
): string => {
  if (!dateValue) return "";

  const date = new Date(dateValue);

  // Kiểm tra nếu giá trị truyền vào không phải là ngày hợp lệ
  if (isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  // getMonth() trả về 0-11 nên phải +1, padStart để đảm bảo có 2 chữ số (ví dụ: 05)
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
