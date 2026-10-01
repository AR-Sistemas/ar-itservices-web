export type PublicEditorialItem = {
  slug: string;
  title: string;
  period: string;
  summary: string;
  highlights: [string, string, string];
  magazineUrl: string;
  podcast: { episodeId: string } | null;
  updatedAt: string;
};

export type PublicEditorialPayload = {
  current: PublicEditorialItem | null;
  archive: PublicEditorialItem[];
};
