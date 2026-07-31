import { z } from "zod";

export const profileUpdateSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  jobTitle: z.string().trim().max(120).nullable().optional(),
  location: z.string().trim().max(120).nullable().optional(),
  theme: z.enum(["light", "dark", "system"]).optional(),
  notifications: z.boolean().optional(),
  language: z.string().min(2).max(10).optional(),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "At least 8 characters"),
  });

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;
