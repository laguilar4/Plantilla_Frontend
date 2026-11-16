const dateTimeFormatter = new Intl.DateTimeFormat('es-CO', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export function formatDateTime(value: string | number | Date): string {
  return dateTimeFormatter.format(new Date(value));
}
