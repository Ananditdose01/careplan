export function initials(name = '') {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}
export function genId() {
  return 'CP' + Math.floor(1000000 + Math.random() * 9000000);
}
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
export function toInputDate(displayDate) {
  if (!displayDate) return '';
  const d = new Date(displayDate);
  if (isNaN(d)) return '';
  return d.toISOString().split('T')[0];
}
export function avatarColor(name = '') {
  const colors = [
    'bg-blue-100 text-blue-700','bg-purple-100 text-purple-700',
    'bg-teal-100 text-teal-700','bg-rose-100 text-rose-700',
    'bg-amber-100 text-amber-700','bg-green-100 text-green-700',
    'bg-indigo-100 text-indigo-700','bg-pink-100 text-pink-700',
  ];
  return colors[(name.charCodeAt(0) || 0) % colors.length];
}
export function daysBetween(start, end) {
  if (!start || !end) return 0;
  const ms = new Date(end) - new Date(start);
  return Math.max(0, Math.round(ms / 86400000));
}
export function isExpiringSoon(end) {
  if (!end) return false;
  const diff = new Date(end) - new Date();
  return diff > 0 && diff < 3 * 86400000;
}
