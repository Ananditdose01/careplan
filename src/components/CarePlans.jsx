import { useState, useMemo } from 'react';
import { INITIAL_PLANS, PATIENTS, DEVICES, STATUS_CONFIG } from '../data/constants';
import StatCard from './StatCard';
import CarePlansTable from './CarePlansTable';
import AddCarePlanModal from './AddCarePlanModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import ViewPlanDrawer from './ViewPlanDrawer';
import Toast from './Toast';

function toDateValue(dateString) {
  return dateString ? new Date(`${dateString}T00:00:00`) : null;
}

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function reviewState(plan) {
  const reviewDate = toDateValue(plan.reviewDate || plan.nextAppointment || plan.end);
  if (!reviewDate) return { label: 'No review date', sort: 4, tone: 'gray', note: 'Add a review date' };

  const today = startOfToday();
  const diffDays = Math.round((reviewDate - today) / 86400000);
  if (diffDays < 0) return { label: 'Overdue', sort: 0, tone: 'red', note: `${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'} overdue` };
  if (diffDays === 0) return { label: 'Review today', sort: 1, tone: 'amber', note: 'Needs attention today' };
  if (diffDays <= 3) return { label: 'Soon', sort: 2, tone: 'blue', note: `In ${diffDays} day${diffDays === 1 ? '' : 's'}` };
  return { label: 'Upcoming', sort: 3, tone: 'green', note: `In ${diffDays} days` };
}

function formatShortDate(dateString) {
  return dateString ? new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—';
}

export default function CarePlans({ plans: plansProp, setPlans: setPlansProp }) {
  const [localPlans, setLocalPlans]   = useState(INITIAL_PLANS);
  const plans = plansProp || localPlans;
  const setPlans = setPlansProp || setLocalPlans;
  const [modalOpen, setModalOpen]     = useState(false);
  const [editPlan, setEditPlan]       = useState(null);
  const [viewPlan, setViewPlan]       = useState(null);
  const [deletePlan, setDeletePlan]   = useState(null);
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deviceFilter, setDeviceFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [toast, setToast]             = useState(null);

  const stats = useMemo(() => {
    const s = plans.reduce((a, p) => { a[p.status] = (a[p.status] || 0) + 1; return a; }, {});
    const noConsent = plans.filter(p => p.status === 'active' && !p.consentSigned).length;
    const reviewBuckets = plans.reduce((acc, plan) => {
      const state = reviewState(plan);
      acc[state.label] = (acc[state.label] || 0) + 1;
      return acc;
    }, {});
    return {
      total: plans.length,
      active: s.active || 0,
      completed: s.completed || 0,
      cancelled: (s.cancelled || 0) + (s.paused || 0),
      noConsent,
      overdue: reviewBuckets.Overdue || 0,
      todayReview: reviewBuckets['Review today'] || 0,
      nextDue: reviewBuckets.Soon || 0,
    };
  }, [plans]);

  const reviewedPlans = useMemo(() => {
    return [...plans].sort((a, b) => {
      const aState = reviewState(a);
      const bState = reviewState(b);
      if (aState.sort !== bState.sort) return aState.sort - bState.sort;
      const aDate = toDateValue(a.reviewDate || a.nextAppointment || a.end)?.getTime() || Number.MAX_SAFE_INTEGER;
      const bDate = toDateValue(b.reviewDate || b.nextAppointment || b.end)?.getTime() || Number.MAX_SAFE_INTEGER;
      if (aDate !== bDate) return aDate - bDate;
      const priorityRank = { Urgent: 0, High: 1, Normal: 2 };
      return (priorityRank[a.priority] ?? 3) - (priorityRank[b.priority] ?? 3);
    });
  }, [plans]);

  const reviewQueue = useMemo(() => {
    return reviewedPlans.slice(0, 5).map(plan => ({
      plan,
      state: reviewState(plan),
      patient: PATIENTS.find(x => x.id === plan.pid) || { name: 'Unknown' },
    }));
  }, [reviewedPlans]);

  const nextScheduledReview = useMemo(() => {
    const candidate = reviewedPlans.find(plan => reviewState(plan).sort >= 1) || reviewedPlans[0];
    if (!candidate) return null;
    return {
      plan: candidate,
      patient: PATIENTS.find(x => x.id === candidate.pid) || { name: 'Unknown' },
      state: reviewState(candidate),
    };
  }, [reviewedPlans]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return reviewedPlans.filter(p => {
      const pt = PATIENTS.find(x => x.id === p.pid) || { name: '' };
      return (
        (!q || p.id.toLowerCase().includes(q) || pt.name.toLowerCase().includes(q) || (p.icd10||'').toLowerCase().includes(q) || (p.assignedDoctor||'').toLowerCase().includes(q)) &&
        (!statusFilter || p.status === statusFilter) &&
        (!deviceFilter || (p.devices||[]).includes(deviceFilter)) &&
        (!priorityFilter || p.priority === priorityFilter)
      );
    });
  }, [plans, search, statusFilter, deviceFilter, priorityFilter]);

  function handleSave(plan) {
    setPlans(prev => prev.find(p => p.id === plan.id) ? prev.map(p => p.id === plan.id ? plan : p) : [plan, ...prev]);
    const pt = PATIENTS.find(x => x.id === plan.pid);
    setToast({ msg: editPlan ? `Plan ${plan.id} updated` : `Plan ${plan.id} created for ${pt?.name}`, type: 'success' });
    setEditPlan(null);
  }

  function confirmDelete() {
    setPlans(prev => prev.filter(p => p.id !== deletePlan.id));
    setToast({ msg: `Plan ${deletePlan.id} deleted`, type: 'warning' });
    setDeletePlan(null);
  }

  function handleEdit(plan) { setEditPlan(plan); setViewPlan(null); setModalOpen(true); }

  function clearFilters() { setSearch(''); setStatusFilter(''); setDeviceFilter(''); setPriorityFilter(''); }
  const hasFilters = search || statusFilter || deviceFilter || priorityFilter;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-6 py-8">

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
              <span className="text-3xl">🫀</span> Care Plans
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage and monitor patient remote care plans</p>
          </div>
          <button className="btn-primary text-sm py-2.5 px-5 gap-2" onClick={() => { setEditPlan(null); setModalOpen(true); }}>
            <span className="text-base font-bold">+</span> Add care plan
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <StatCard label="Total plans"  value={stats.total}     sub="All records"           icon="📋" accentClass="border-l-blue-500"   valueClass="text-gray-900"   onClick={() => clearFilters()} />
          <StatCard label="Active"       value={stats.active}    sub="Currently monitored"   icon="✅" accentClass="border-l-green-500"  valueClass="text-green-700"  onClick={() => setStatusFilter('active')} />
          <StatCard label="Review today" value={stats.todayReview} sub="See first today" icon="🕘" accentClass="border-l-amber-500" valueClass="text-amber-700" onClick={() => clearFilters()} />
          <StatCard label="Overdue" value={stats.overdue} sub="Needs immediate review" icon="⏰" accentClass="border-l-red-400" valueClass="text-red-600" onClick={() => clearFilters()} />
          <StatCard label="Next review" value={nextScheduledReview ? formatShortDate(nextScheduledReview.plan.reviewDate || nextScheduledReview.plan.nextAppointment || nextScheduledReview.plan.end) : '—'} sub={nextScheduledReview ? nextScheduledReview.patient.name : 'No review date'} icon="🗓️" accentClass="border-l-indigo-400" valueClass="text-indigo-700" onClick={() => clearFilters()} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr] mb-6">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Doctor review queue</p>
                <h2 className="text-lg font-bold text-gray-900 mt-1">Which patient should be reviewed first</h2>
              </div>
              <p className="text-xs text-gray-500">Sorted by review date, urgency, and priority</p>
            </div>
            <div className="space-y-3">
              {reviewQueue.map(({ plan, state, patient }) => (
                <div key={`queue-${plan.id}`} className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-gray-900 truncate">{patient.name}</p>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${state.tone === 'red' ? 'bg-red-50 text-red-700 border-red-200' : state.tone === 'amber' ? 'bg-amber-50 text-amber-700 border-amber-200' : state.tone === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-green-50 text-green-700 border-green-200'}`}>{state.label}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{plan.planTitle || plan.planType} · {plan.id} · {plan.assignedDoctor || 'No doctor'}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-gray-900">{formatShortDate(plan.reviewDate || plan.nextAppointment || plan.end)}</p>
                    <p className="text-xs text-gray-500">{state.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Quick review guide</p>
            <h2 className="text-lg font-bold text-gray-900 mt-1">How to pick the next patient</h2>
            <div className="mt-4 space-y-3 text-sm text-gray-700">
              <p>1. Review overdue plans first.</p>
              <p>2. Then review patients due today.</p>
              <p>3. Next handle patients due within 3 days.</p>
              <p>4. Use priority and no-consent flags before routine follow-ups.</p>
            </div>
            {nextScheduledReview && (
              <div className="mt-5 rounded-2xl border border-white/70 bg-white/80 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Next scheduled review</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">{nextScheduledReview.patient.name}</p>
                <p className="text-xs text-gray-500">{nextScheduledReview.plan.planTitle || nextScheduledReview.plan.planType} · {formatShortDate(nextScheduledReview.plan.reviewDate || nextScheduledReview.plan.nextAppointment || nextScheduledReview.plan.end)} · {nextScheduledReview.state.label}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-4 items-center">
          <div className="flex-1 min-w-48 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">🔍</span>
            <input className="input-base pl-9" placeholder="Search plan ID, patient, doctor, ICD-10…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input-base w-36" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All status</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select className="input-base w-40" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
            <option value="">All priority</option>
            {['Normal','High','Urgent'].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select className="input-base w-44" value={deviceFilter} onChange={e => setDeviceFilter(e.target.value)}>
            <option value="">All devices</option>
            {DEVICES.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          {hasFilters && <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-colors">✕ Clear</button>}
        </div>

        <CarePlansTable plans={filtered} onEdit={handleEdit} onDelete={plan => setDeletePlan(plan)} onView={plan => setViewPlan(plan)} />
      </div>

      <AddCarePlanModal open={modalOpen} onClose={() => { setModalOpen(false); setEditPlan(null); }} onSave={handleSave} editPlan={editPlan} editPatient={editPlan ? PATIENTS.find(p => p.id === editPlan.pid) : null} />

      <DeleteConfirmModal plan={deletePlan} patientName={deletePlan ? (PATIENTS.find(p => p.id === deletePlan.pid)?.name || 'Unknown') : ''} onConfirm={confirmDelete} onCancel={() => setDeletePlan(null)} />

      <ViewPlanDrawer plan={viewPlan} onClose={() => setViewPlan(null)} onEdit={handleEdit} />

      {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}
