const envAdmins = process.env.NEXT_PUBLIC_ADMIN_EMAILS
  ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  : [];

export const ADMIN_EMAILS: string[] =
  envAdmins.length > 0
    ? envAdmins
    : [
        "admin@easyva.in",
      ];

export const ADMIN_EMAIL = ADMIN_EMAILS[0];

/**
 * Checks whether the given user email is authorized for admin privileges.
 */
export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return ADMIN_EMAILS.some((admin) => admin.toLowerCase() === clean);
}

