import { useMemo, useState } from 'react';
import { PATIENTS } from '../data/constants';
import { formatDate } from '../utils/helpers';
import Avatar from './Avatar';
import StatusBadge from './StatusBadge';
import DeviceTag from './DeviceTag';
import PatientSearch from './PatientSearch';

function planProcedures(plan) {
  return (plan.goals || []).flatMap(goal =>
    (goal.procedures || []).map(procedure => ({
      goalType: goal.goalType || 'Care goal',
      goalDescription: goal.description || '',
      ...procedure,
    }))
  );
}

function StatTile({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-xs text-gray-500">{hint}</p>
    </div>
  );
}

export default function PatientPortal({ plans }) {
  const [selectedPatient, setSelectedPatient] = useState(PATIENTS[0]);

  const patientPlans = useMemo(() => {
    return plans
      .filter(plan => plan.pid === selectedPatient.id)
      .sort((a, b) => {
        const aActive = a.status === 'active' ? 1 : 0;
        const bActive = b.status === 'active' ? 1 : 0;
        return bActive - aActive;
      });
  }, [plans, selectedPatient]);

  const activePlans = patientPlans.filter(plan => plan.status === 'active');
  const procedures = patientPlans.flatMap(plan => planProcedures(plan));
  const allDevices = [...new Set(patientPlans.flatMap(plan => plan.devices || []))];
  const nextReview = patientPlans
    .map(plan => plan.reviewDate)
    .filter(Boolean)
    .sort()[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/60">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div className="rounded-3xl border border-blue-100 bg-white/90 backdrop-blur shadow-sm p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600">Patient view</p>
              <h1 className="text-3xl font-bold text-gray-900">My care plan</h1>
              <p className="text-sm text-gray-600 max-w-2xl">
                View your active monitoring plan, upcoming procedures, and the care team assigned to you.
              </p>
            </div>
            <div className="w-full lg:max-w-md">
              <PatientSearch selected={selectedPatient} onSelect={setSelectedPatient} onClear={() => setSelectedPatient(PATIENTS[0])} />
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <StatTile label="Active plans" value={activePlans.length} hint="Plans currently monitored" />
          <StatTile label="Procedures" value={procedures.length} hint="Interventions and checks" />
          <StatTile label="Devices" value={allDevices.length} hint="Monitoring equipment linked" />
          <StatTile label="Next review" value={nextReview ? formatDate(nextReview) : '—'} hint="Planned review date" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-5 flex items-center gap-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                <Avatar name={selectedPatient.name} size="lg" />
                <div>
                  <p className="text-lg font-bold text-gray-900">{selectedPatient.name}</p>
                  <p className="text-sm text-gray-600">{selectedPatient.id} · {selectedPatient.gender} · {selectedPatient.age} yrs</p>
                  <p className="text-sm font-semibold text-blue-700 mt-0.5">{selectedPatient.condition}</p>
                </div>
              </div>
              <div className="grid gap-4 p-6 md:grid-cols-3">
                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</p>
                  <p className="mt-2 text-sm font-semibold text-gray-900">{selectedPatient.phone || '—'}</p>
                </div>
                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Blood group</p>
                  <p className="mt-2 text-sm font-semibold text-gray-900">{selectedPatient.blood || '—'}</p>
                </div>
                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date of birth</p>
                  <p className="mt-2 text-sm font-semibold text-gray-900">{selectedPatient.dob || '—'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Care plans</h2>
                <p className="text-sm text-gray-500">{patientPlans.length} total</p>
              </div>

              {patientPlans.length === 0 && (
                <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
                  <p className="text-lg font-bold text-gray-800">No care plans yet</p>
                  <p className="mt-2 text-sm text-gray-500">This patient does not have any assigned plans.</p>
                </div>
              )}

              {patientPlans.map(plan => {
                const planTasks = planProcedures(plan);
                return (
                  <div key={plan.id} className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="p-5 md:p-6 border-b border-gray-100 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xl font-bold text-gray-900">{plan.planTitle || plan.planType || 'Care plan'}</h3>
                          <StatusBadge status={plan.status} />
                        </div>
                        <p className="text-sm text-gray-600">{plan.planType} · Priority {plan.priority || 'Normal'}</p>
                        <p className="text-sm text-gray-500">Assigned doctor: <span className="font-semibold text-gray-800">{plan.assignedDoctor || '—'}</span></p>
                      </div>
                      <div className="text-sm text-gray-500 space-y-1 md:text-right">
                        <p>Start: <span className="font-semibold text-gray-800">{formatDate(plan.start)}</span></p>
                        <p>End: <span className="font-semibold text-gray-800">{formatDate(plan.end)}</span></p>
                        <p>Review: <span className="font-semibold text-gray-800">{formatDate(plan.reviewDate)}</span></p>
                        <p>Next appointment: <span className="font-semibold text-gray-800">{formatDate(plan.nextAppointment)}</span></p>
                      </div>
                    </div>

                    <div className="p-5 md:p-6 space-y-5">
                      {plan.devices?.length > 0 && (
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Monitoring devices</p>
                          <div className="flex flex-wrap gap-2">
                            {plan.devices.map(deviceId => <DeviceTag key={deviceId} id={deviceId} />)}
                          </div>
                        </div>
                      )}

                      {planTasks.length > 0 && (
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Today&apos;s procedures</p>
                          <div className="space-y-3">
                            {planTasks.map((task, index) => (
                              <div key={`${plan.id}-${task.id}-${index}`} className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                  <div>
                                    <p className="text-sm font-semibold text-gray-900">{task.description || 'Procedure pending'}</p>
                                    <p className="text-xs text-gray-600">Goal: {task.goalType}</p>
                                  </div>
                                  <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                                    {task.frequency && <span className="rounded-full bg-white px-2.5 py-1 border border-blue-100">{task.frequency}</span>}
                                    {task.timesPerDay && <span className="rounded-full bg-white px-2.5 py-1 border border-blue-100">{task.timesPerDay}/day</span>}
                                    {task.device && <span className="rounded-full bg-white px-2.5 py-1 border border-blue-100">{task.device}</span>}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Care coordinator</p>
                          <p className="mt-2 text-sm font-semibold text-gray-900">{plan.careCoordinator || '—'}</p>
                        </div>
                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Communication</p>
                          <p className="mt-2 text-sm font-semibold text-gray-900">{plan.communicationPreference || 'Phone'}</p>
                        </div>
                      </div>

                      {(plan.primaryGoal || plan.interventions) && (
                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-2">
                          {plan.primaryGoal && (
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Primary goal</p>
                              <p className="mt-1 text-sm text-gray-800 whitespace-pre-wrap">{plan.primaryGoal}</p>
                            </div>
                          )}
                          {plan.interventions && (
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Intervention / procedure notes</p>
                              <p className="mt-1 text-sm text-gray-800 whitespace-pre-wrap">{plan.interventions}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white shadow-sm p-6 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Contacts & alerts</h2>
              {patientPlans.map(plan => (
                <div key={`${plan.id}-contacts`} className="rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{plan.planTitle || plan.planType}</p>
                    <p className="text-xs text-gray-500">{plan.id}</p>
                  </div>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p><span className="font-semibold text-gray-900">Emergency:</span> {plan.emergencyContact?.name || '—'}{plan.emergencyContact?.phone ? ` · ${plan.emergencyContact.phone}` : ''}</p>
                    {plan.escalation && <p><span className="font-semibold text-gray-900">Escalation:</span> {plan.escalation}</p>}
                    {plan.notes && <p><span className="font-semibold text-gray-900">Notes:</span> {plan.notes}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white shadow-sm p-6 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Quick summary</h2>
              <div className="space-y-3 text-sm text-gray-700">
                <p><span className="font-semibold text-gray-900">Active plans:</span> {activePlans.length}</p>
                <p><span className="font-semibold text-gray-900">Assigned doctor:</span> {patientPlans[0]?.assignedDoctor || '—'}</p>
                <p><span className="font-semibold text-gray-900">Next review:</span> {nextReview ? formatDate(nextReview) : '—'}</p>
                <p><span className="font-semibold text-gray-900">Devices:</span> {allDevices.length > 0 ? allDevices.join(', ') : '—'}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
