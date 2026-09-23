export function safeExternalUrl(raw: string | null | undefined): string | null {
  const value = raw?.trim();
  if (!value || value.startsWith("//")) return null;
  const candidate = /^[a-z][a-z\d+.-]*:/i.test(value)
    ? value
    : `https://${value}`;
  try {
    const url = new URL(candidate);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}
