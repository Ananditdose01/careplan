export const PATIENTS = [
  { id: 'PT001', name: 'Ram Kumar Singh',      dob: '04 Sep 2007', gender: 'Male',   age: 18, blood: 'O+',  phone: '+91 98765 43210', condition: 'Hypertension' },
  { id: 'PT002', name: 'Jonas Muller',          dob: '11 Jan 1990', gender: 'Male',   age: 36, blood: 'A+',  phone: '+91 87654 32109', condition: 'Type 2 Diabetes' },
  { id: 'PT003', name: 'Ram Krishna',           dob: '11 Jan 1990', gender: 'Male',   age: 36, blood: 'B+',  phone: '+91 76543 21098', condition: 'COPD' },
  { id: 'PT004', name: 'Jatin Dev Patient',     dob: '25 Feb 2008', gender: 'Male',   age: 18, blood: 'AB+', phone: '+91 65432 10987', condition: 'Asthma' },
  { id: 'PT005', name: 'Ram Ram Ram',           dob: '14 Apr 2008', gender: 'Male',   age: 17, blood: 'O-',  phone: '+91 54321 09876', condition: 'Obesity' },
  { id: 'PT006', name: 'Shabam Kesari',         dob: '27 Apr 2008', gender: 'Male',   age: 17, blood: 'A-',  phone: '+91 43210 98765', condition: 'Cardiac Monitoring' },
  { id: 'PT007', name: 'Anand Kumar Chaurasia', dob: '04 Dec 2007', gender: 'Male',   age: 18, blood: 'B-',  phone: '+91 32109 87654', condition: 'Post Surgery' },
  { id: 'PT008', name: 'Rama K Patient',        dob: '06 Apr 2008', gender: 'Male',   age: 17, blood: 'O+',  phone: '+91 21098 76543', condition: 'Diabetes Type 1' },
  { id: 'PT009', name: 'Priya Sharma',          dob: '12 Mar 1985', gender: 'Female', age: 41, blood: 'AB-', phone: '+91 11987 65432', condition: 'Hypertension' },
  { id: 'PT010', name: 'Anil Mehta',            dob: '30 Jul 1972', gender: 'Male',   age: 53, blood: 'A+',  phone: '+91 99876 54321', condition: 'Heart Failure' },
];

export const INITIAL_PLANS = [
  {
    id: 'CP8178795', pid: 'PT001', planType: 'Remote monitoring', priority: 'High',
    start: '2026-06-08', end: '2026-06-19', status: 'active',
    devices: ['bp', 'spo2'], goals: [], icd10: 'I10', assignedDoctor: 'Dr. Rajesh Sharma',
    careTeam: ['Nurse Priya', 'Dietician Meena'], allergies: 'Penicillin',
    medications: 'Amlodipine 5mg, Losartan 50mg', consentSigned: true,
    followUpFrequency: 'Weekly', alertThresholds: { bp: { systolic: 140, diastolic: 90 } },
    notes: 'Patient requires daily BP monitoring. Alert if systolic > 140.',
    createdAt: '2026-06-08', updatedAt: '2026-06-09',
  },
  {
    id: 'CP9308669', pid: 'PT002', planType: 'Chronic disease management', priority: 'Normal',
    start: '2026-06-11', end: '2026-06-25', status: 'cancelled',
    devices: ['bp'], goals: [], icd10: 'E11', assignedDoctor: 'Dr. Anita Patel',
    careTeam: ['Nurse Suresh'], allergies: 'None', medications: 'Metformin 500mg',
    consentSigned: true, followUpFrequency: 'Bi-weekly', alertThresholds: {},
    notes: '', createdAt: '2026-06-08', updatedAt: '2026-06-10',
  },
  {
    id: 'CP2653633', pid: 'PT003', planType: 'Remote monitoring', priority: 'Normal',
    start: '2026-06-08', end: '2026-06-19', status: 'active',
    devices: ['weight', 'glucose'], goals: [], icd10: 'J44', assignedDoctor: 'Dr. Rajesh Sharma',
    careTeam: [], allergies: 'Sulfa drugs', medications: 'Salbutamol inhaler',
    consentSigned: false, followUpFrequency: 'Weekly', alertThresholds: {},
    notes: '', createdAt: '2026-06-08', updatedAt: '2026-06-08',
  },
  {
    id: 'CP9167192', pid: 'PT004', planType: 'Preventive care', priority: 'Normal',
    start: '2026-06-08', end: '2026-06-09', status: 'active',
    devices: ['temp'], goals: [], icd10: 'J45', assignedDoctor: 'Dr. Kavita Singh',
    careTeam: ['Nurse Priya'], allergies: 'None', medications: 'Budesonide',
    consentSigned: true, followUpFrequency: 'Daily', alertThresholds: { temp: { max: 38.5 } },
    notes: '', createdAt: '2026-06-08', updatedAt: '2026-06-08',
  },
  {
    id: 'CP3188523', pid: 'PT005', planType: 'Post-discharge follow-up', priority: 'High',
    start: '2026-06-08', end: '2026-06-21', status: 'completed',
    devices: ['bp', 'spo2', 'weight'], goals: [], icd10: 'E66', assignedDoctor: 'Dr. Anita Patel',
    careTeam: ['Dietician Meena', 'Physiotherapist Raj'], allergies: 'Latex',
    medications: 'Orlistat 120mg', consentSigned: true,
    followUpFrequency: 'Bi-weekly', alertThresholds: {},
    notes: 'Post bariatric surgery monitoring.', createdAt: '2026-06-08', updatedAt: '2026-06-08',
  },
  {
    id: 'CP1425646', pid: 'PT006', planType: 'Remote monitoring', priority: 'Urgent',
    start: '2026-06-08', end: '2026-06-17', status: 'active',
    devices: ['glucose', 'bp'], goals: [], icd10: 'I51', assignedDoctor: 'Dr. Rajesh Sharma',
    careTeam: ['Nurse Suresh', 'Cardiologist Dr. Roy'], allergies: 'Aspirin',
    medications: 'Digoxin 0.25mg, Furosemide 40mg', consentSigned: true,
    followUpFrequency: 'Daily', alertThresholds: { bp: { systolic: 130, diastolic: 85 } },
    notes: 'Critical cardiac patient. Immediate alert on threshold breach.',
    createdAt: '2026-06-08', updatedAt: '2026-06-08',
  },
  {
    id: 'CP7460662', pid: 'PT003', planType: 'Chronic disease management', priority: 'Normal',
    start: '2026-06-09', end: '2026-06-20', status: 'cancelled',
    devices: ['spo2'], goals: [], icd10: 'J44', assignedDoctor: 'Dr. Kavita Singh',
    careTeam: [], allergies: 'Sulfa drugs', medications: '',
    consentSigned: false, followUpFrequency: 'Weekly', alertThresholds: {},
    notes: '', createdAt: '2026-06-09', updatedAt: '2026-06-09',
  },
  {
    id: 'CP9014733', pid: 'PT007', planType: 'Post-discharge follow-up', priority: 'High',
    start: '2026-06-05', end: '2026-06-19', status: 'active',
    devices: ['bp', 'temp', 'glucose'], goals: [], icd10: 'Z48', assignedDoctor: 'Dr. Anita Patel',
    careTeam: ['Nurse Priya', 'Physiotherapist Raj'], allergies: 'NSAIDs',
    medications: 'Cefazolin, Enoxaparin', consentSigned: true,
    followUpFrequency: 'Daily', alertThresholds: { temp: { max: 38 } },
    notes: 'Post knee replacement. Monitor for infection signs.',
    createdAt: '2026-06-05', updatedAt: '2026-06-05',
  },
  {
    id: 'CP9949116', pid: 'PT008', planType: 'Remote monitoring', priority: 'High',
    start: '2026-06-05', end: '2026-06-20', status: 'completed',
    devices: ['weight'], goals: [], icd10: 'E10', assignedDoctor: 'Dr. Rajesh Sharma',
    careTeam: ['Dietician Meena'], allergies: 'None',
    medications: 'Insulin Glargine, Metformin', consentSigned: true,
    followUpFrequency: 'Weekly', alertThresholds: { glucose: { min: 70, max: 180 } },
    notes: '', createdAt: '2026-06-05', updatedAt: '2026-06-05',
  },
  {
    id: 'CP9305895', pid: 'PT004', planType: 'Preventive care', priority: 'Normal',
    start: '2026-06-05', end: '2026-06-13', status: 'completed',
    devices: ['bp', 'spo2'], goals: [], icd10: 'J45', assignedDoctor: 'Dr. Kavita Singh',
    careTeam: [], allergies: 'None', medications: 'Montelukast 10mg',
    consentSigned: true, followUpFrequency: 'Weekly', alertThresholds: {},
    notes: '', createdAt: '2026-06-05', updatedAt: '2026-06-05',
  },
];

export const DEVICES = [
  { id: 'bp',      name: 'Blood Pressure',  shortName: 'BP',      desc: 'Systolic, diastolic, pulse', icon: '🩺', bg: 'bg-blue-50',   text: 'text-blue-800',   border: 'border-blue-200'   },
  { id: 'spo2',    name: 'Blood Oxygen',    shortName: 'SpO2',    desc: 'SpO2%, PI, pulse',           icon: '🫁', bg: 'bg-green-50',  text: 'text-green-800',  border: 'border-green-200'  },
  { id: 'weight',  name: 'Weight',          shortName: 'Weight',  desc: 'Body weight (kg/lbs)',       icon: '⚖️', bg: 'bg-amber-50',  text: 'text-amber-800',  border: 'border-amber-200'  },
  { id: 'temp',    name: 'Temperature',     shortName: 'Temp',    desc: 'Body temperature °C',        icon: '🌡️', bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-200' },
  { id: 'glucose', name: 'Blood Glucose',   shortName: 'Glucose', desc: 'Glucose readings mg/dL',     icon: '💉', bg: 'bg-teal-50',   text: 'text-teal-800',   border: 'border-teal-200'   },
];
export const DEVICE_MAP = Object.fromEntries(DEVICES.map(d => [d.id, d]));

export const GOAL_TYPES = [
  'Health metric management', 'Medication adherence', 'Activity & exercise',
  'Nutrition & diet', 'Symptom monitoring', 'Weight management',
  'Blood pressure control', 'Glucose regulation', 'Oxygen saturation',
  'Pain management', 'Sleep improvement', 'Wound care',
];
export const FREQUENCIES   = ['Daily', 'Weekly', 'Twice daily', 'Every 4 hours', 'Every 8 hours', 'As needed', 'Monthly'];
export const PLAN_TYPES    = ['Remote monitoring', 'Chronic disease management', 'Post-discharge follow-up', 'Preventive care', 'Palliative care', 'Rehabilitation', 'Mental health support'];
export const PRIORITIES    = ['Normal', 'High', 'Urgent'];
export const DOCTORS       = ['Dr. Rajesh Sharma', 'Dr. Anita Patel', 'Dr. Kavita Singh', 'Dr. Sunil Roy', 'Dr. Meera Joshi'];
export const CARE_TEAM_OPTIONS = ['Nurse Priya', 'Nurse Suresh', 'Dietician Meena', 'Physiotherapist Raj', 'Cardiologist Dr. Roy', 'Pharmacist Vivek'];
export const FOLLOW_UP_FREQS  = ['Daily', 'Every 2 days', 'Weekly', 'Bi-weekly', 'Monthly'];
export const ICD10_CODES = [
  { code: 'I10',  label: 'I10 — Essential hypertension' },
  { code: 'E11',  label: 'E11 — Type 2 diabetes mellitus' },
  { code: 'E10',  label: 'E10 — Type 1 diabetes mellitus' },
  { code: 'J44',  label: 'J44 — COPD' },
  { code: 'J45',  label: 'J45 — Asthma' },
  { code: 'I51',  label: 'I51 — Cardiac complications' },
  { code: 'E66',  label: 'E66 — Obesity' },
  { code: 'Z48',  label: 'Z48 — Post-surgical aftercare' },
  { code: 'N18',  label: 'N18 — Chronic kidney disease' },
  { code: 'I50',  label: 'I50 — Heart failure' },
  { code: 'G20',  label: 'G20 — Parkinson disease' },
  { code: 'F32',  label: 'F32 — Depressive episode' },
];

export const STATUS_CONFIG = {
  active:    { label: 'Active',    dot: 'bg-green-500',  badge: 'bg-green-50 text-green-800 border-green-200'  },
  completed: { label: 'Completed', dot: 'bg-blue-500',   badge: 'bg-blue-50 text-blue-800 border-blue-200'    },
  cancelled: { label: 'Cancelled', dot: 'bg-red-500',    badge: 'bg-red-50 text-red-800 border-red-200'       },
  draft:     { label: 'Draft',     dot: 'bg-amber-500',  badge: 'bg-amber-50 text-amber-800 border-amber-200' },
  paused:    { label: 'Paused',    dot: 'bg-purple-500', badge: 'bg-purple-50 text-purple-800 border-purple-200' },
};

export const PRIORITY_CONFIG = {
  Normal: { badge: 'bg-gray-100 text-gray-600 border-gray-200',   dot: 'bg-gray-400' },
  High:   { badge: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-400' },
  Urgent: { badge: 'bg-red-50 text-red-700 border-red-200',       dot: 'bg-red-500' },
};
