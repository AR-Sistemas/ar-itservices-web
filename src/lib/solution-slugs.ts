/**
 * Slugs públicos de cada producto. El id interno `sdd` se conserva para datos
 * y assets existentes, pero CriterIA se publica con un nombre entendible.
 */
const PUBLIC_SOLUTION_SLUGS: Record<string, string> = {
  aria: "aria",
  ario: "ario",
  meetingmate: "meetingmate",
  sdd: "criteria",
};

export function getPublicSolutionSlug(id: string) {
  return PUBLIC_SOLUTION_SLUGS[id] ?? id;
}

export function getSolutionIdFromSlug(slug: string) {
  return slug === "criteria" || slug === "sdd" ? "sdd" : slug;
}
