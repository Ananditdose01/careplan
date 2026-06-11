import { PATIENTS, PRIORITY_CONFIG } from '../data/constants';
import Avatar from './Avatar';
import StatusBadge from './StatusBadge';
import DeviceTag from './DeviceTag';
import { formatDate } from '../utils/helpers';

export default function ViewPlanDrawer({ plan, onClose, onEdit }) {
  if (!plan) return null;
  const pt = PATIENTS.find(p => p.id === plan.pid) || { name: 'Unknown', dob: '-', gender: '-' };
  const pc = PRIORITY_CONFIG[plan.priority] || PRIORITY_CONFIG.Normal;
  const editable = plan.status !== 'completed';

  return (
    <div className="fixed inset-0 z-40 bg-black/30 flex justify-end" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white h-full w-full max-w-lg shadow-2xl overflow-y-auto flex flex-col">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-lg">📋</div>
            <div>
              <p className="text-sm font-bold text-gray-900">Care plan details</p>
              <p className="text-xs font-mono text-gray-500">{plan.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {editable && <button onClick={() => { onClose(); onEdit(plan); }} className="btn-primary text-xs py-1.5 px-3 gap-1.5">✏️ Edit</button>}
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">✕</button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5 flex-1">
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <Avatar name={pt.name} size="lg" />
            <div>
              <p className="font-bold text-gray-900 text-base">{pt.name}</p>
              <p className="text-xs text-gray-500">{pt.dob} · {pt.gender} · {pt.age} yrs</p>
              <p className="text-xs text-blue-600 font-semibold mt-0.5">{pt.condition}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Plan overview</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { l: 'Care title', v: plan.planTitle || '—' },
                { l: 'Plan type', v: plan.planType },
                { l: 'ICD-10', v: plan.icd10 || '—' },
                { l: 'Start', v: formatDate(plan.start) },
                { l: 'End', v: formatDate(plan.end) },
                { l: 'Review', v: formatDate(plan.reviewDate) },
                { l: 'Next appointment', v: formatDate(plan.nextAppointment) },
                { l: 'Follow-up', v: plan.followUpFrequency || '—' },
                { l: 'Goals', v: plan.goals?.length || 0 },
                { l: 'Created', v: formatDate(plan.createdAt) },
              ].map(item => (
                <div key={item.l} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <p className="text-xs text-gray-500 mb-0.5">{item.l}</p>
                  <p className="text-sm font-semibold text-gray-900">{item.v}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <StatusBadge status={plan.status} />
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${pc.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${pc.dot}`} />{plan.priority}
              </span>
              {plan.consentSigned
                ? <span className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-200">✓ Consent signed</span>
                : <span className="text-xs text-red-700 bg-red-50 px-2 py-1 rounded-full border border-red-200">⚠ No consent</span>}
            </div>
          </div>

          {plan.devices?.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Monitoring devices</p>
              <div className="flex flex-wrap gap-2">{plan.devices.map(d => <DeviceTag key={d} id={d} />)}</div>
            </div>
          )}

          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Care team</p>
            <p className="text-sm text-gray-800 font-semibold">{plan.assignedDoctor || '—'}</p>
            {plan.careTeam?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {plan.careTeam.map(m => <span key={m} className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-full">{m}</span>)}
              </div>
            )}
          </div>

          {(plan.allergies || plan.medications || plan.diagnoses) && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Clinical info</p>
              <div className="space-y-2">
                {plan.allergies && <div className="bg-red-50 border border-red-100 rounded-lg p-3"><p className="text-xs text-red-600 font-bold mb-0.5">⚠ Allergies</p><p className="text-sm text-gray-800">{plan.allergies}</p></div>}
                {plan.medications && <div className="bg-gray-50 border border-gray-100 rounded-lg p-3"><p className="text-xs text-gray-500 font-bold mb-0.5">💊 Medications</p><p className="text-sm text-gray-800 whitespace-pre-wrap">{plan.medications}</p></div>}
                {plan.diagnoses && <div className="bg-gray-50 border border-gray-100 rounded-lg p-3"><p className="text-xs text-gray-500 font-bold mb-0.5">🏥 Comorbidities</p><p className="text-sm text-gray-800">{plan.diagnoses}</p></div>}
                {plan.primaryGoal && <div className="bg-blue-50 border border-blue-100 rounded-lg p-3"><p className="text-xs text-blue-700 font-bold mb-0.5">🎯 Primary goal</p><p className="text-sm text-gray-800 whitespace-pre-wrap">{plan.primaryGoal}</p></div>}
                {plan.interventions && <div className="bg-gray-50 border border-gray-100 rounded-lg p-3"><p className="text-xs text-gray-500 font-bold mb-0.5">🛠 Intervention plan</p><p className="text-sm text-gray-800 whitespace-pre-wrap">{plan.interventions}</p></div>}
              </div>
            </div>
          )}

          {plan.goals?.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">🎯 Goals and procedures</p>
              <div className="space-y-3">
                {plan.goals.map((goal, goalIndex) => (
                  <div key={goal.id || goalIndex} className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
                    <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Goal {goalIndex + 1}: {goal.goalType || 'Goal'}</p>
                        <p className="text-xs text-gray-600">{goal.description || 'No description added.'}</p>
                      </div>
                      <span className="inline-flex self-start items-center rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700">
                        {goal.status || 'Not started'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div className="rounded-lg border border-gray-200 bg-white p-2">Target: {goal.targetMetric || '—'}</div>
                      <div className="rounded-lg border border-gray-200 bg-white p-2">Target date: {formatDate(goal.targetDate)}</div>
                    </div>
                    {goal.procedures?.length > 0 && (
                      <div className="space-y-2">
                        {goal.procedures.map((procedure, procedureIndex) => (
                          <div key={procedure.id || procedureIndex} className="rounded-lg border border-blue-100 bg-blue-50/70 p-3">
                            <p className="text-xs font-semibold text-blue-700">Procedure {procedureIndex + 1}</p>
                            <p className="text-sm text-gray-800 whitespace-pre-wrap">{procedure.description || 'No procedure description provided.'}</p>
                            <p className="mt-1 text-xs text-gray-600">
                              {procedure.frequency || 'Daily'}
                              {procedure.timesPerDay ? ` · ${procedure.timesPerDay}/day` : ''}
                              {procedure.device ? ` · ${procedure.device}` : ''}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {(plan.careCoordinator || plan.emergencyContact?.name || plan.emergencyContact?.phone || plan.communicationPreference) && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">📱 Communication</p>
              <div className="space-y-2">
                {plan.careCoordinator && <div className="bg-gray-50 border border-gray-100 rounded-lg p-3"><p className="text-xs text-gray-500 font-bold mb-0.5">Care coordinator</p><p className="text-sm text-gray-800">{plan.careCoordinator}</p></div>}
                {(plan.emergencyContact?.name || plan.emergencyContact?.phone) && <div className="bg-gray-50 border border-gray-100 rounded-lg p-3"><p className="text-xs text-gray-500 font-bold mb-0.5">Emergency contact</p><p className="text-sm text-gray-800">{plan.emergencyContact?.name || '—'}{plan.emergencyContact?.phone ? ` · ${plan.emergencyContact.phone}` : ''}</p></div>}
                {plan.communicationPreference && <div className="bg-gray-50 border border-gray-100 rounded-lg p-3"><p className="text-xs text-gray-500 font-bold mb-0.5">Preferred communication</p><p className="text-sm text-gray-800">{plan.communicationPreference}</p></div>}
              </div>
            </div>
          )}

          {plan.alertThresholds && Object.keys(plan.alertThresholds).length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">🔔 Alert thresholds</p>
              <div className="space-y-2">
                {plan.alertThresholds.bp && (plan.alertThresholds.bp.systolic || plan.alertThresholds.bp.diastolic) && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-700">🩺 Blood pressure</span>
                    <span className="text-xs text-blue-800">{plan.alertThresholds.bp.systolic && `SYS >${plan.alertThresholds.bp.systolic}`} {plan.alertThresholds.bp.diastolic && `DIA >${plan.alertThresholds.bp.diastolic}`}</span>
                  </div>
                )}
                {plan.alertThresholds.glucose && (plan.alertThresholds.glucose.min || plan.alertThresholds.glucose.max) && (
                  <div className="bg-teal-50 border border-teal-100 rounded-lg px-3 py-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-teal-700">💉 Blood glucose</span>
                    <span className="text-xs text-teal-800">{plan.alertThresholds.glucose.min && `Min ${plan.alertThresholds.glucose.min}`} {plan.alertThresholds.glucose.max && `Max ${plan.alertThresholds.glucose.max}`} mg/dL</span>
                  </div>
                )}
                {plan.alertThresholds.temp?.max && (
                  <div className="bg-orange-50 border border-orange-100 rounded-lg px-3 py-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-orange-700">🌡️ Temperature</span>
                    <span className="text-xs text-orange-800">Max {plan.alertThresholds.temp.max}°C</span>
                  </div>
                )}
                {plan.alertThresholds.spo2?.min && (
                  <div className="bg-green-50 border border-green-100 rounded-lg px-3 py-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-green-700">🫁 SpO2</span>
                    <span className="text-xs text-green-800">Min {plan.alertThresholds.spo2.min}%</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {plan.escalation && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">📞 Escalation protocol</p>
              <p className="text-sm text-gray-700 bg-amber-50 border border-amber-100 rounded-lg p-3">{plan.escalation}</p>
            </div>
          )}

          {plan.notes && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">📝 Care notes</p>
              <p className="text-sm text-gray-700 bg-gray-50 border border-gray-100 rounded-lg p-3 whitespace-pre-wrap">{plan.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
