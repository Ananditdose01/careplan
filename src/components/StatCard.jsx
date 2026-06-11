export default function StatCard({ label, value, sub, icon, accentClass = 'border-l-gray-300', valueClass = 'text-gray-900', onClick }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 border-l-4 ${accentClass} p-4 cursor-pointer hover:shadow-md transition-shadow ${onClick ? 'hover:bg-gray-50' : ''}`} onClick={onClick}>
      <div className="flex items-start justify-between mb-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
        {icon && <span className="text-lg">{icon}</span>}
      </div>
      <p className={`text-2xl font-bold ${valueClass}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}
