import { DEVICES } from '../data/constants';
export default function DevicePicker({ selected, onChange }) {
  function toggle(id) {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    onChange(next);
  }
  return (
    <div className="grid grid-cols-5 gap-2">
      {DEVICES.map(d => {
        const on = selected.has(d.id);
        return (
          <button key={d.id} type="button" onClick={() => toggle(d.id)}
            className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${on ? `${d.bg} ${d.border} shadow-sm` : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-gray-100'}`}>
            {on && <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white" style={{fontSize:'9px'}}>✓</span>}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl ${on ? '' : 'grayscale opacity-50'}`}>{d.icon}</div>
            <p className={`text-xs font-semibold text-center leading-tight ${on ? d.text : 'text-gray-600'}`}>{d.name}</p>
            <p className="text-xs text-gray-400 text-center leading-tight">{d.desc}</p>
          </button>
        );
      })}
    </div>
  );
}
