import { randomBytes } from "crypto";

export function generatePassword(length = 12): string {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
  const bytes = randomBytes(length);

  return Array.from(bytes, (b) => charset[b % charset.length]).join("");
}


