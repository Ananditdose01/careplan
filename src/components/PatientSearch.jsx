import { useState, useRef, useEffect } from 'react';
import { PATIENTS } from '../data/constants';
import Avatar from './Avatar';

export default function PatientSearch({ selected, onSelect, onClear }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleInput(val) {
    setQuery(val);
    if (val.length < 2) { setResults([]); setOpen(false); return; }
    const found = PATIENTS.filter(p =>
      p.name.toLowerCase().includes(val.toLowerCase()) ||
      p.id.toLowerCase().includes(val.toLowerCase()) ||
      p.dob.toLowerCase().includes(val.toLowerCase()) ||
      (p.condition || '').toLowerCase().includes(val.toLowerCase())
    );
    setResults(found); setOpen(true);
  }

  function pick(p) { onSelect(p); setQuery(''); setResults([]); setOpen(false); }

  if (selected) {
    return (
      <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar name={selected.name} size="md" />
          <div>
            <p className="text-sm font-semibold text-gray-900">{selected.name}</p>
            <p className="text-xs text-gray-500">{selected.id} · {selected.dob} · {selected.gender} · <span className="text-blue-600 font-medium">{selected.condition}</span></p>
          </div>
        </div>
        <button onClick={onClear} className="text-gray-400 hover:text-red-500 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors" aria-label="Remove patient">✕</button>
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        <input className="input-base pl-9" placeholder="Search by name, patient ID, condition or DOB…" value={query} onChange={e => handleInput(e.target.value)} onFocus={() => results.length > 0 && setOpen(true)} />
      </div>
      {open && results.length > 0 && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden max-h-64 overflow-y-auto">
          {results.map(p => (
            <button key={p.id} onClick={() => pick(p)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0 text-left">
              <Avatar name={p.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                <p className="text-xs text-gray-500">{p.id} · {p.dob} · {p.gender}</p>
              </div>
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100 whitespace-nowrap">{p.condition}</span>
            </button>
          ))}
        </div>
      )}
      {open && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-50 px-4 py-4 text-sm text-gray-500 text-center">
          <p className="text-lg mb-1">🔍</p>No patients found for "<strong>{query}</strong>"
        </div>
      )}
    </div>
  );
}
