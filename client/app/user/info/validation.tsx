import * as z from 'zod';

export const EditProfileSchema = z.object({
  name: z.string().min(1, "Tên đầy đủ không được để trống"),
  email: z.string().min(1, "Email không được để trống").email("Email không đúng định dạng"),
  address: z.string().min(1, "Địa chỉ không được để trống"),
});

export type EditProfileInputs = z.infer<typeof EditProfileSchema>;