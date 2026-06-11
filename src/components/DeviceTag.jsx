import { DEVICE_MAP } from '../data/constants';
export default function DeviceTag({ id }) {
  const d = DEVICE_MAP[id];
  if (!d) return null;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${d.bg} ${d.text} ${d.border}`}>
      <span>{d.icon}</span>{d.shortName}
    </span>
  );
}
