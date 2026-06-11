import { PATIENTS, PRIORITY_CONFIG } from '../data/constants';
import Avatar from './Avatar';
import StatusBadge from './StatusBadge';
import DeviceTag from './DeviceTag';
import { isExpiringSoon } from '../utils/helpers';

function patientById(pid) { return PATIENTS.find(p => p.id === pid) || { name: 'Unknown', dob: '-', gender: '-' }; }

function reviewState(plan) {
  const dateString = plan.reviewDate || plan.nextAppointment || plan.end;
  if (!dateString) return { label: 'No review date', tone: 'gray' };

  const reviewDate = new Date(`${dateString}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((reviewDate - today) / 86400000);

  if (diffDays < 0) return { label: 'Overdue', tone: 'red' };
  if (diffDays === 0) return { label: 'Today', tone: 'amber' };
  if (diffDays <= 3) return { label: `In ${diffDays}d`, tone: 'blue' };
  return { label: `In ${diffDays}d`, tone: 'green' };
}

export default function CarePlansTable({ plans, onEdit, onDelete, onView }) {
  if (!plans.length) return (
    <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
      <div className="text-5xl mb-4">📋</div>
      <p className="text-gray-600 font-semibold">No care plans found</p>
      <p className="text-gray-400 text-sm mt-1">Adjust your filters or create a new plan</p>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {['Plan ID','Patient','Dates','Devices','Priority','Review','Status','Team','Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {plans.map((plan, i) => {
              const pt = patientById(plan.pid);
              const editable = plan.status !== 'completed';
              const expiring = isExpiringSoon(plan.end);
              const pc = PRIORITY_CONFIG[plan.priority] || PRIORITY_CONFIG.Normal;
              const rs = reviewState(plan);
              return (
                <tr key={plan.id} className={`border-b border-gray-50 hover:bg-blue-50/30 transition-colors ${expiring ? 'bg-amber-50/40' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded font-medium">{plan.id}</span>
                      {expiring && <span className="text-xs text-amber-600 font-medium">⏰ Expiring soon</span>}
                      {!plan.consentSigned && <span className="text-xs text-red-500 font-medium">⚠ No consent</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={pt.name} size="sm" />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm whitespace-nowrap">{pt.name}</p>
                        <p className="text-xs text-gray-400">{pt.dob} · {pt.gender}</p>
                        {plan.icd10 && <p className="text-xs text-blue-500 font-mono">{plan.icd10}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <p className="text-xs text-gray-700 font-medium">{plan.start ? new Date(plan.start).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '—'}</p>
                    <p className="text-xs text-gray-400">to {plan.end ? new Date(plan.end).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '—'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{plan.followUpFrequency && `↻ ${plan.followUpFrequency}`}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1 max-w-[140px]">
                      {plan.devices?.length > 0 ? plan.devices.map(d => <DeviceTag key={d} id={d} />) : <span className="text-xs text-gray-400">—</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${pc.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${pc.dot}`} />{plan.priority || 'Normal'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${rs.tone === 'red' ? 'bg-red-50 text-red-700 border-red-200' : rs.tone === 'amber' ? 'bg-amber-50 text-amber-700 border-amber-200' : rs.tone === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-green-50 text-green-700 border-green-200'}`}>{rs.label}</span>
                      <p className="text-xs text-gray-400">{plan.reviewDate || plan.nextAppointment || plan.end ? new Date(plan.reviewDate || plan.nextAppointment || plan.end).toLocaleDateString('en-US',{month:'short',day:'numeric'}) : 'No date'}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={plan.status} /></td>
                  <td className="px-4 py-3">
                    <div className="text-xs text-gray-500">
                      <p className="font-medium text-gray-700 truncate max-w-[120px]">{plan.assignedDoctor || '—'}</p>
                      {plan.careTeam?.length > 0 && <p className="text-gray-400">+{plan.careTeam.length} members</p>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => onView(plan)} title="View" className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">👁</button>
                      {editable && <>
                        <button onClick={() => onEdit(plan)} title="Edit" className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">✏️</button>
                        <button onClick={() => onDelete(plan.id)} title="Delete" className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">🗑</button>
                      </>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
        <p className="text-xs text-gray-500">Showing <span className="font-semibold text-gray-700">{plans.length}</span> care plan{plans.length !== 1 ? 's' : ''}</p>
        <div className="flex gap-1.5">
          {['‹','1','2','›'].map(p => (
            <button key={p} className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${p==='1' ? 'bg-blue-500 text-white border border-blue-500 font-semibold' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
