import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getPublicStaffCredentials = createServerFn({ method: "GET" })
  .handler(async () => {
    const { getStoredCredentials } = await import("./credentials-store.server");
    const creds = getStoredCredentials();
    return {
      email: creds.email,
      password: creds.password,
    };
  });

export const changeStaffCredentials = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        currentPassword: z.string().min(1, "Current password is required"),
        newEmail: z.string().email("Please enter a valid email address"),
        newPassword: z.string().min(6, "New password must be at least 6 characters"),
      })
      .parse(d)
  )
  .handler(async ({ data }) => {
    const { getStoredCredentials, updateStoredCredentials } = await import(
      "./credentials-store.server"
    );
    const current = getStoredCredentials();

    if (data.currentPassword !== current.password) {
      throw new Error("Incorrect current password.");
    }

    const updated = updateStoredCredentials(data.newEmail, data.newPassword);
    return {
      success: true,
      email: updated.email,
      updated_at: updated.updated_at,
    };
  });
