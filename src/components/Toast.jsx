import { useEffect, useState } from 'react';
export default function Toast({ message, type = 'success', onDone }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); setTimeout(onDone, 300); }, 3200);
    return () => clearTimeout(t);
  }, [onDone]);
  const styles = {
    success: 'bg-green-800 text-green-50',
    error: 'bg-red-800 text-red-50',
    info: 'bg-gray-900 text-white',
    warning: 'bg-amber-700 text-amber-50',
  };
  const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 text-sm font-medium px-5 py-3 rounded-xl shadow-xl transition-all duration-300 ${styles[type]} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">{icons[type]}</span>
      {message}
    </div>
  );
}
