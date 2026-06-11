import { useState, useEffect, useCallback } from 'react';
import { PATIENTS, PLAN_TYPES, PRIORITIES, DOCTORS, CARE_TEAM_OPTIONS, FOLLOW_UP_FREQS, ICD10_CODES, DEVICES } from '../data/constants';
import { genId, toInputDate } from '../utils/helpers';
import PatientSearch from './PatientSearch';
import DevicePicker from './DevicePicker';
import GoalBuilder, { createGoal } from './GoalBuilder';

const TABS = [
  { id: 'patient',    label: 'Patient',    icon: '👤' },
  { id: 'plan',       label: 'Plan Info',  icon: '📋' },
  { id: 'devices',    label: 'Devices',    icon: '🩺' },
  { id: 'goals',      label: 'Goals',      icon: '🎯' },
  { id: 'clinical',   label: 'Clinical',   icon: '💊' },
  { id: 'alerts',     label: 'Alerts',     icon: '🔔' },
  { id: 'team',       label: 'Care Team',  icon: '👥' },
];

function Section({ title, icon, children }) {
  return (
    <div className="mb-5">
      <p className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
        <span>{icon}</span>{title}
      </p>
      {children}
    </div>
  );
}

function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="label-base">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function createDemoGoals() {
  return [
    {
      ...createGoal(),
      goalType: 'Blood pressure control',
      targetMetric: 'BP < 130/80 mmHg',
      description: 'Improve daily blood pressure control and reduce cardiovascular risk.',
      startDate: '2026-06-11',
      targetDate: '2026-07-11',
      status: 'In progress',
      procedures: [
        {
          id: 1,
          description: 'Check blood pressure every morning before medication.',
          frequency: 'Daily',
          timesPerDay: '1',
          device: 'bp',
        },
        {
          id: 2,
          description: 'Review salt reduction advice and medication adherence weekly.',
          frequency: 'Weekly',
          timesPerDay: '1',
          device: '',
        },
      ],
    },
    {
      ...createGoal(),
      goalType: 'Glucose regulation',
      targetMetric: 'Fasting glucose 80-130 mg/dL',
      description: 'Maintain stable glucose readings and watch for hypoglycemia.',
      startDate: '2026-06-11',
      targetDate: '2026-07-18',
      status: 'Not started',
      procedures: [
        {
          id: 3,
          description: 'Record fasting glucose before breakfast.',
          frequency: 'Daily',
          timesPerDay: '1',
          device: 'glucose',
        },
      ],
    },
  ];
}

const DEMO_DRAFT = {
  patient: PATIENTS[0],
  planTitle: 'Hypertension remote monitoring plan',
  planType: 'Remote monitoring',
  priority: 'High',
  startDate: '2026-06-11',
  endDate: '2026-07-11',
  reviewDate: '2026-06-18',
  nextAppointment: '2026-06-20',
  icd10: 'I10',
  status: 'active',
  doctor: DOCTORS[0],
  careTeam: ['Nurse Priya', 'Dietician Meena'],
  followUp: 'Weekly',
  devices: ['bp', 'spo2'],
  goals: createDemoGoals(),
  primaryGoal: 'Keep systolic BP below 130 and improve adherence to home monitoring.',
  interventions: 'Daily BP logs, weekly tele-check, medication review, and escalation if readings remain elevated for 3 days.',
  allergies: 'Penicillin',
  medications: 'Amlodipine 5 mg daily\nLosartan 50 mg daily',
  diagnoses: 'Hypertension\nObesity',
  consentSigned: true,
  consentDate: '2026-06-11',
  careCoordinator: 'Nurse Priya',
  emergencyContactName: 'Suresh Kumar',
  emergencyContactPhone: '+91 90000 11111',
  communicationPreference: 'WhatsApp',
  alertBP: { systolic: '140', diastolic: '90' },
  alertGlucose: { min: '70', max: '180' },
  alertTemp: { max: '38.5' },
  alertSpo2: { min: '92' },
  alertWeight: { max: '85' },
  escalation: 'Call patient first, notify Dr. Rajesh Sharma if BP remains high, and arrange urgent review if symptoms worsen.',
  notes: 'Patient prefers morning check-ins and simple instructions.',
};

export default function AddCarePlanModal({ open, onClose, onSave, editPlan, editPatient }) {
  const [tab, setTab]           = useState('patient');
  const [patient, setPatient]   = useState(null);
  const [planTitle, setPlanTitle] = useState('');
  const [planType, setPlanType] = useState(PLAN_TYPES[0]);
  const [priority, setPriority] = useState('Normal');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate]   = useState('');
  const [reviewDate, setReviewDate] = useState('');
  const [nextAppointment, setNextAppointment] = useState('');
  const [icd10, setIcd10]       = useState('');
  const [status, setStatus]     = useState('active');
  const [doctor, setDoctor]     = useState(DOCTORS[0]);
  const [careTeam, setCareTeam] = useState([]);
  const [followUp, setFollowUp] = useState('Weekly');
  const [devices, setDevices]   = useState(new Set());
  const [goals, setGoals]       = useState([createGoal()]);
  const [primaryGoal, setPrimaryGoal] = useState('');
  const [interventions, setInterventions] = useState('');
  const [allergies, setAllergies]     = useState('');
  const [medications, setMedications] = useState('');
  const [diagnoses, setDiagnoses]     = useState('');
  const [consentSigned, setConsentSigned] = useState(false);
  const [consentDate, setConsentDate]   = useState('');
  const [careCoordinator, setCareCoordinator] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [communicationPreference, setCommunicationPreference] = useState('Phone');
  const [alertBP, setAlertBP]         = useState({ systolic: '', diastolic: '' });
  const [alertGlucose, setAlertGlucose] = useState({ min: '', max: '' });
  const [alertTemp, setAlertTemp]       = useState({ max: '' });
  const [alertSpo2, setAlertSpo2]       = useState({ min: '' });
  const [alertWeight, setAlertWeight]   = useState({ max: '' });
  const [escalation, setEscalation]     = useState('');
  const [notes, setNotes]               = useState('');
  const [errors, setErrors]             = useState({});

  const reset = useCallback((plan, pat) => {
    const draft = plan ? null : DEMO_DRAFT;
    setTab('patient');
    setPatient(pat || draft?.patient || null);
    setPlanTitle(plan?.planTitle || draft?.planTitle || '');
    setPlanType(plan?.planType || draft?.planType || PLAN_TYPES[0]);
    setPriority(plan?.priority || draft?.priority || 'Normal');
    setStartDate(toInputDate(plan?.start) || draft?.startDate || '');
    setEndDate(toInputDate(plan?.end) || draft?.endDate || '');
    setReviewDate(toInputDate(plan?.reviewDate) || draft?.reviewDate || '');
    setNextAppointment(toInputDate(plan?.nextAppointment) || draft?.nextAppointment || '');
    setIcd10(plan?.icd10 || draft?.icd10 || '');
    setStatus(plan?.status || draft?.status || 'active');
    setDoctor(plan?.assignedDoctor || draft?.doctor || DOCTORS[0]);
    setCareTeam(plan?.careTeam || draft?.careTeam || []);
    setFollowUp(plan?.followUpFrequency || draft?.followUp || 'Weekly');
    setDevices(new Set(plan?.devices || draft?.devices || []));
    setGoals(
      Array.isArray(plan?.goals) && plan.goals.length > 0
        ? plan.goals.map(goal => ({
            id: goal.id || Date.now() + Math.random(),
            goalType: goal.goalType || goal.type || 'Health metric management',
            targetMetric: goal.targetMetric || '',
            description: goal.description || '',
            startDate: goal.startDate || '',
            targetDate: goal.targetDate || '',
            status: goal.status || 'Not started',
            procedures: Array.isArray(goal.procedures) && goal.procedures.length > 0
              ? goal.procedures.map(procedure => ({
                  id: procedure.id || Date.now() + Math.random(),
                  description: procedure.description || '',
                  frequency: procedure.frequency || 'Daily',
                  timesPerDay: procedure.timesPerDay || '',
                  device: procedure.device || '',
                }))
              : [createGoal().procedures[0]],
          }))
        : draft?.goals || [createGoal()]
    );
    setPrimaryGoal(plan?.primaryGoal || draft?.primaryGoal || '');
    setInterventions(plan?.interventions || draft?.interventions || '');
    setAllergies(plan?.allergies || draft?.allergies || '');
    setMedications(plan?.medications || draft?.medications || '');
    setDiagnoses(plan?.diagnoses || draft?.diagnoses || '');
    setConsentSigned(plan?.consentSigned || draft?.consentSigned || false);
    setConsentDate(plan?.consentDate || draft?.consentDate || '');
    setCareCoordinator(plan?.careCoordinator || draft?.careCoordinator || '');
    setEmergencyContactName(plan?.emergencyContact?.name || draft?.emergencyContactName || '');
    setEmergencyContactPhone(plan?.emergencyContact?.phone || draft?.emergencyContactPhone || '');
    setCommunicationPreference(plan?.communicationPreference || draft?.communicationPreference || 'Phone');
    setAlertBP(plan?.alertThresholds?.bp || draft?.alertBP || { systolic: '', diastolic: '' });
    setAlertGlucose(plan?.alertThresholds?.glucose || draft?.alertGlucose || { min: '', max: '' });
    setAlertTemp(plan?.alertThresholds?.temp || draft?.alertTemp || { max: '' });
    setAlertSpo2(plan?.alertThresholds?.spo2 || draft?.alertSpo2 || { min: '' });
    setAlertWeight(plan?.alertThresholds?.weight || draft?.alertWeight || { max: '' });
    setEscalation(plan?.escalation || draft?.escalation || '');
    setNotes(plan?.notes || draft?.notes || '');
    setErrors({});
  }, []);

  useEffect(() => { if (open) reset(editPlan, editPatient); }, [open, editPlan, editPatient, reset]);

  useEffect(() => {
    const fn = e => { if (e.key === 'Escape' && open) onClose(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [open, onClose]);

  function toggleTeam(name) {
    setCareTeam(prev => prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]);
  }

  function updateGoal(goalId, updatedGoal) {
    setGoals(prev => prev.map(goal => (goal.id === goalId ? updatedGoal : goal)));
  }

  function addGoal() {
    setGoals(prev => [...prev, createGoal()]);
  }

  function removeGoal(goalId) {
    setGoals(prev => {
      const remaining = prev.filter(goal => goal.id !== goalId);
      return remaining.length > 0 ? remaining : [createGoal()];
    });
  }

  function validate() {
    const e = {};
    if (!patient)    e.patient   = 'Please select a patient';
    if (!startDate)  e.startDate = 'Required';
    if (!endDate)    e.endDate   = 'Required';
    if (startDate && endDate && endDate < startDate) e.endDate = 'End must be after start';
    setErrors(e);
    if (Object.keys(e).length > 0) setTab('patient');
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    const plan = {
      id: editPlan?.id || genId(),
      pid: patient.id,
      planTitle,
      planType, priority,
      start: startDate, end: endDate,
      reviewDate, nextAppointment,
      status, icd10,
      assignedDoctor: doctor, careTeam, followUpFrequency: followUp,
      devices: [...devices], goals,
      primaryGoal, interventions,
      allergies, medications, diagnoses,
      consentSigned, consentDate,
      careCoordinator,
      emergencyContact: {
        name: emergencyContactName,
        phone: emergencyContactPhone,
      },
      communicationPreference,
      alertThresholds: {
        ...(devices.has('bp')      ? { bp: alertBP }         : {}),
        ...(devices.has('glucose') ? { glucose: alertGlucose }: {}),
        ...(devices.has('temp')    ? { temp: alertTemp }      : {}),
        ...(devices.has('spo2')    ? { spo2: alertSpo2 }      : {}),
        ...(devices.has('weight')  ? { weight: alertWeight }  : {}),
      },
      escalation, notes,
      createdAt: editPlan?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    onSave(plan);
    onClose();
  }

  if (!open) return null;

  const tabContent = {
    patient: (
      <div className="space-y-4">
        <Section title="Find & assign patient" icon="🔍">
          <PatientSearch selected={patient} onSelect={setPatient} onClear={() => setPatient(null)} />
          {errors.patient && <p className="text-xs text-red-500 mt-1">{errors.patient}</p>}
        </Section>
        {patient && (
          <div className="grid grid-cols-2 gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div><p className="text-xs text-gray-500 mb-0.5">Blood group</p><p className="text-sm font-semibold text-gray-900">{patient.blood || '—'}</p></div>
            <div><p className="text-xs text-gray-500 mb-0.5">Phone</p><p className="text-sm font-semibold text-gray-900">{patient.phone || '—'}</p></div>
            <div><p className="text-xs text-gray-500 mb-0.5">Primary condition</p><p className="text-sm font-semibold text-blue-700">{patient.condition || '—'}</p></div>
            <div><p className="text-xs text-gray-500 mb-0.5">Age</p><p className="text-sm font-semibold text-gray-900">{patient.age} yrs</p></div>
          </div>
        )}
      </div>
    ),

    plan: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Care plan title">
            <input className="input-base" placeholder="e.g. Hypertension home monitoring plan" value={planTitle} onChange={e => setPlanTitle(e.target.value)} />
          </Field>
          <Field label="Care coordinator">
            <input className="input-base" placeholder="e.g. Nurse Priya" value={careCoordinator} onChange={e => setCareCoordinator(e.target.value)} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Plan type"><select className="input-base" value={planType} onChange={e => setPlanType(e.target.value)}>{PLAN_TYPES.map(t => <option key={t}>{t}</option>)}</select></Field>
          <Field label="Priority">
            <select className="input-base" value={priority} onChange={e => setPriority(e.target.value)}>{PRIORITIES.map(p => <option key={p}>{p}</option>)}</select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Start date" required error={errors.startDate}><input type="date" className="input-base" value={startDate} onChange={e => setStartDate(e.target.value)} /></Field>
          <Field label="End date" required error={errors.endDate}><input type="date" className="input-base" value={endDate} onChange={e => setEndDate(e.target.value)} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Next review date"><input type="date" className="input-base" value={reviewDate} onChange={e => setReviewDate(e.target.value)} /></Field>
          <Field label="Next appointment"><input type="date" className="input-base" value={nextAppointment} onChange={e => setNextAppointment(e.target.value)} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="ICD-10 diagnosis code">
            <select className="input-base" value={icd10} onChange={e => setIcd10(e.target.value)}>
              <option value="">Select diagnosis</option>
              {ICD10_CODES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
            </select>
          </Field>
          <Field label="Plan status">
            <select className="input-base" value={status} onChange={e => setStatus(e.target.value)}>
              <option value="active">Active</option><option value="draft">Draft</option>
              <option value="paused">Paused</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option>
            </select>
          </Field>
        </div>
        <Field label="Follow-up frequency">
          <select className="input-base" value={followUp} onChange={e => setFollowUp(e.target.value)}>{FOLLOW_UP_FREQS.map(f => <option key={f}>{f}</option>)}</select>
        </Field>
        <Field label="Primary care goal">
          <textarea className="input-base resize-none" rows={3} placeholder="Describe the main clinical goal for this plan…" value={primaryGoal} onChange={e => setPrimaryGoal(e.target.value)} />
        </Field>
      </div>
    ),

    devices: (
      <div className="space-y-4">
        <Section title="Select monitoring devices" icon="🩺">
          <DevicePicker selected={devices} onChange={setDevices} />
          {devices.size === 0 && <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">⚠ Select at least one device for remote monitoring</p>}
        </Section>
        {devices.size > 0 && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-xs font-semibold text-green-700 mb-1">✓ Selected devices</p>
            <p className="text-xs text-green-600">{[...devices].map(id => DEVICES.find(d=>d.id===id)?.name).join(', ')}</p>
          </div>
        )}
      </div>
    ),

    goals: (
      <Section title="Care plan goals" icon="🎯">
        <GoalBuilder goals={goals} onAdd={addGoal} onRemove={removeGoal} onUpdate={updateGoal} />
      </Section>
    ),

    clinical: (
      <div className="space-y-4">
        <Section title="Clinical information" icon="💊">
          <div className="space-y-3">
            <Field label="Known allergies">
              <input className="input-base" placeholder="e.g. Penicillin, NSAIDs, Latex, None" value={allergies} onChange={e => setAllergies(e.target.value)} />
            </Field>
            <Field label="Current medications">
              <textarea className="input-base resize-none" rows={3} placeholder="List all current medications with dosage…e.g. Amlodipine 5mg once daily, Metformin 500mg twice daily" value={medications} onChange={e => setMedications(e.target.value)} />
            </Field>
            <Field label="Secondary diagnoses / comorbidities">
              <textarea className="input-base resize-none" rows={2} placeholder="e.g. Type 2 Diabetes, Obesity, CKD Stage 2" value={diagnoses} onChange={e => setDiagnoses(e.target.value)} />
            </Field>
            <Field label="Intervention plan">
              <textarea className="input-base resize-none" rows={3} placeholder="Describe the monitoring cadence, interventions, education, and follow-up plan…" value={interventions} onChange={e => setInterventions(e.target.value)} />
            </Field>
          </div>
        </Section>
        <Section title="Patient consent" icon="✍️">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <input type="checkbox" id="consent" className="w-4 h-4 rounded border-gray-300 text-blue-600" checked={consentSigned} onChange={e => setConsentSigned(e.target.checked)} />
              <label htmlFor="consent" className="text-sm text-gray-700 font-medium cursor-pointer">Patient has signed the remote monitoring consent form</label>
            </div>
            {consentSigned && (
              <Field label="Consent signed date">
                <input type="date" className="input-base" value={consentDate} onChange={e => setConsentDate(e.target.value)} />
              </Field>
            )}
          </div>
        </Section>
        <Section title="Care communication" icon="📱">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Emergency contact name">
              <input className="input-base" placeholder="Family member or caregiver" value={emergencyContactName} onChange={e => setEmergencyContactName(e.target.value)} />
            </Field>
            <Field label="Emergency contact phone">
              <input className="input-base" placeholder="Phone number" value={emergencyContactPhone} onChange={e => setEmergencyContactPhone(e.target.value)} />
            </Field>
          </div>
          <Field label="Preferred communication">
            <select className="input-base" value={communicationPreference} onChange={e => setCommunicationPreference(e.target.value)}>
              {['Phone', 'SMS', 'WhatsApp', 'Email', 'App notification'].map(option => <option key={option}>{option}</option>)}
            </select>
          </Field>
        </Section>
        <Section title="Care notes" icon="📝">
          <textarea className="input-base resize-none" rows={3} placeholder="Clinical notes, special instructions, follow-up reminders…" value={notes} onChange={e => setNotes(e.target.value)} />
        </Section>
      </div>
    ),

    alerts: (
      <div className="space-y-4">
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
          ⚠ Set threshold values for devices. An alert will be triggered if a reading exceeds these limits.
        </div>
        {devices.has('bp') && (
          <Section title="Blood pressure thresholds" icon="🩺">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Systolic alert (mmHg)"><input type="number" className="input-base" placeholder="e.g. 140" value={alertBP.systolic} onChange={e => setAlertBP(p => ({...p, systolic: e.target.value}))} /></Field>
              <Field label="Diastolic alert (mmHg)"><input type="number" className="input-base" placeholder="e.g. 90" value={alertBP.diastolic} onChange={e => setAlertBP(p => ({...p, diastolic: e.target.value}))} /></Field>
            </div>
          </Section>
        )}
        {devices.has('glucose') && (
          <Section title="Blood glucose thresholds (mg/dL)" icon="💉">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Min (hypoglycemia alert)"><input type="number" className="input-base" placeholder="e.g. 70" value={alertGlucose.min} onChange={e => setAlertGlucose(p => ({...p, min: e.target.value}))} /></Field>
              <Field label="Max (hyperglycemia alert)"><input type="number" className="input-base" placeholder="e.g. 180" value={alertGlucose.max} onChange={e => setAlertGlucose(p => ({...p, max: e.target.value}))} /></Field>
            </div>
          </Section>
        )}
        {devices.has('temp') && (
          <Section title="Temperature threshold (°C)" icon="🌡️">
            <Field label="Max temperature alert"><input type="number" className="input-base" step="0.1" placeholder="e.g. 38.5" value={alertTemp.max} onChange={e => setAlertTemp({ max: e.target.value })} /></Field>
          </Section>
        )}
        {devices.has('spo2') && (
          <Section title="Blood oxygen threshold (%)" icon="🫁">
            <Field label="Min SpO2 alert"><input type="number" className="input-base" placeholder="e.g. 92" value={alertSpo2.min} onChange={e => setAlertSpo2({ min: e.target.value })} /></Field>
          </Section>
        )}
        {devices.has('weight') && (
          <Section title="Weight threshold (kg)" icon="⚖️">
            <Field label="Max weight alert (rapid gain)"><input type="number" className="input-base" placeholder="e.g. 85" value={alertWeight.max} onChange={e => setAlertWeight({ max: e.target.value })} /></Field>
          </Section>
        )}
        {devices.size === 0 && <p className="text-sm text-gray-500 text-center py-8">← Select devices first to configure alert thresholds</p>}
        <Section title="Escalation protocol" icon="📞">
          <textarea className="input-base resize-none" rows={2} placeholder="e.g. Call patient, notify Dr. Sharma, escalate to ER if systolic > 180" value={escalation} onChange={e => setEscalation(e.target.value)} />
        </Section>
      </div>
    ),

    team: (
      <div className="space-y-4">
        <Section title="Assigned physician" icon="👨‍⚕️">
          <select className="input-base" value={doctor} onChange={e => setDoctor(e.target.value)}>{DOCTORS.map(d => <option key={d}>{d}</option>)}</select>
        </Section>
        <Section title="Care team members" icon="👥">
          <div className="grid grid-cols-2 gap-2">
            {CARE_TEAM_OPTIONS.map(m => (
              <button key={m} type="button" onClick={() => toggleTeam(m)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all text-left ${careTeam.includes(m) ? 'bg-blue-50 border-blue-300 text-blue-800' : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                <span className={`w-4 h-4 rounded flex items-center justify-center text-xs font-bold border ${careTeam.includes(m) ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300'}`}>{careTeam.includes(m) ? '✓' : ''}</span>
                {m}
              </button>
            ))}
          </div>
          {careTeam.length > 0 && (
            <p className="text-xs text-blue-600 mt-2 font-medium">✓ {careTeam.length} team member{careTeam.length > 1 ? 's' : ''} assigned</p>
          )}
        </Section>
      </div>
    ),
  };

  const completedTabs = [
    patient ? 'patient' : null,
    (planType && startDate && endDate) ? 'plan' : null,
    devices.size > 0 ? 'devices' : null,
  ].filter(Boolean);

  return (
    <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4 overflow-y-auto" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-4xl shadow-2xl flex flex-col z-50 mt-16" style={{maxHeight:'86vh'}}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-xl">📋</div>
            <div>
              <h2 className="text-base font-bold text-gray-900">{editPlan ? 'Edit care plan' : 'New care plan'}</h2>
              <p className="text-xs text-gray-500">{patient ? `Assigning to ${patient.name}` : 'Complete all sections to create the plan'}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">✕</button>
        </div>

        <div className="flex border-b border-gray-100 bg-gray-50 overflow-x-auto px-2 pt-2 gap-1 flex-shrink-0">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-xs font-semibold whitespace-nowrap transition-all border-b-2 ${tab === t.id ? 'bg-white text-blue-700 border-blue-500 shadow-sm' : 'text-gray-500 hover:text-gray-700 border-transparent hover:bg-white'}`}>
              <span>{t.icon}</span>{t.label}
              {completedTabs.includes(t.id) && <span className="w-1.5 h-1.5 rounded-full bg-green-500" />}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">{tabContent[tab]}</div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex-shrink-0">
          <div className="flex gap-1">
            {TABS.map((t, i) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`w-2 h-2 rounded-full transition-colors ${tab === t.id ? 'bg-blue-500' : 'bg-gray-300'}`} />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-ghost text-sm py-2 px-4" onClick={onClose}>Cancel</button>
            {TABS.findIndex(t => t.id === tab) < TABS.length - 1 && (
              <button className="btn-ghost text-sm py-2 px-4" onClick={() => setTab(TABS[TABS.findIndex(t => t.id === tab) + 1].id)}>Next →</button>
            )}
            <button className="btn-primary text-sm py-2 px-5" onClick={handleSave}>
              <span>✓</span>{editPlan ? 'Update plan' : 'Save plan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
