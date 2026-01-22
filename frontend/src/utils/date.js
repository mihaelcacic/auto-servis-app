export function formatDatetime(value) {
  if (value === null || value === undefined) return '-'
  try {
    // prihvatiti brojeve ili ISO datume
    const d = (typeof value === 'number' || /^[0-9]+$/.test(String(value)))
      ? new Date(Number(value))
      : new Date(String(value))
    if (Number.isNaN(d.getTime())) return String(value)
    return new Intl.DateTimeFormat('hr-HR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    }).format(d)
  } catch (e) {
    return String(value)
  }
}

export default formatDatetime
