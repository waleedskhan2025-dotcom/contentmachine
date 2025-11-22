export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}

export function parseTime(timeString: string): number {
  const parts = timeString.split(':');
  if (parts.length !== 2) return 0;

  const mins = parseInt(parts[0], 10) || 0;
  const secParts = parts[1].split('.');
  const secs = parseInt(secParts[0], 10) || 0;
  const ms = secParts.length > 1 ? parseInt(secParts[1], 10) || 0 : 0;

  return mins * 60 + secs + ms / 100;
}
