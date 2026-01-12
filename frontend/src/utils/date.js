export function formatDatetime(value) {
  if (value === null || value === undefined) return '-'
  try {
    // Accept either numeric timestamps or ISO date strings
    const d = (typeof value === 'number' || /^[0-9]+$/.test(String(value)))
      ? new Date(Number(value))
      : new Date(String(value))
    if (Number.isNaN(d.getTime())) return String(value)
    // Use locale formatting for readability
    return new Intl.DateTimeFormat('hr-HR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    }).format(d)
  } catch (e) {
    return String(value)
  }
}

export default formatDatetime
