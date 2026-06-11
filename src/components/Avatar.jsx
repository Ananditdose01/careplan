import { initials, avatarColor } from '../utils/helpers';
export default function Avatar({ name = '', size = 'md' }) {
  const sz = size === 'sm' ? 'w-7 h-7 text-xs' : size === 'lg' ? 'w-12 h-12 text-base' : 'w-9 h-9 text-sm';
  return (
    <div className={`${sz} rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${avatarColor(name)}`}>
      {initials(name)}
    </div>
  );
}
