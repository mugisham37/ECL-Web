export function formatRole(role: string): string {
  const map: Record<string, string> = {
    administrator: "Admin",
    analyst: "Analyst",
    reviewer: "Reviewer",
  };
  return map[role.toLowerCase()] ?? role;
}
