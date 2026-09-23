export type LanguageShare = { name: string; bytes: number; percentage: number };

export function languageShares(
  languages: Record<string, number>,
): LanguageShare[] {
  const total = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
  if (total === 0) return [];
  return Object.entries(languages)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: Math.round((bytes / total) * 100),
    }))
    .sort((a, b) => b.bytes - a.bytes);
}

export function formatShare(share: LanguageShare): string {
  return share.bytes > 0 && share.percentage === 0
    ? "<1%"
    : `${share.percentage}%`;
}
