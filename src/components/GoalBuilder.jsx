import { GOAL_TYPES, FREQUENCIES, DEVICES } from '../data/constants';

export function createProcedure() {
  return {
    id: Date.now() + Math.random(),
    description: '',
    frequency: 'Daily',
    timesPerDay: '',
    device: '',
  };
}

export function createGoal() {
  return {
    id: Date.now() + Math.random(),
    goalType: GOAL_TYPES[0],
    targetMetric: '',
    description: '',
    startDate: '',
    targetDate: '',
    status: 'Not started',
    procedures: [createProcedure()],
  };
}

function GoalCard({ goal, index, onUpdate, onRemove }) {
  const update = (field, value) => onUpdate({ ...goal, [field]: value });
  const updateProcedure = (procedureId, field, value) => {
    onUpdate({
      ...goal,
      procedures: (goal.procedures || []).map(procedure => (
        procedure.id === procedureId ? { ...procedure, [field]: value } : procedure
      )),
    });
  };

  const addProcedure = () => {
    onUpdate({
      ...goal,
      procedures: [...(goal.procedures || []), createProcedure()],
    });
  };

  const removeProcedure = procedureId => {
    const remaining = (goal.procedures || []).filter(procedure => procedure.id !== procedureId);
    onUpdate({
      ...goal,
      procedures: remaining.length > 0 ? remaining : [createProcedure()],
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-3 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
        <span className="inline-flex items-center gap-2 text-blue-700 text-xs font-bold">
          <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">{index}</span>
          Goal {index}
        </span>
        <button type="button" onClick={onRemove} className="text-gray-400 hover:text-red-500 w-6 h-6 flex items-center justify-center rounded hover:bg-red-50 transition-colors text-xs">✕</button>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-base">Goal type <span className="text-red-400">*</span></label>
            <select className="input-base" value={goal.goalType} onChange={e => update('goalType', e.target.value)}>
              {GOAL_TYPES.map(type => <option key={type}>{type}</option>)}
            </select>
          </div>
          <div>
            <label className="label-base">Target metric</label>
            <input className="input-base" placeholder="e.g. Systolic BP < 130 mmHg" value={goal.targetMetric} onChange={e => update('targetMetric', e.target.value)} />
          </div>
        </div>

        <div>
          <label className="label-base">Description <span className="text-red-400">*</span></label>
          <textarea className="input-base resize-none" rows={2} placeholder="Describe the clinical goal…" value={goal.description} onChange={e => update('description', e.target.value)} />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="label-base">Start date</label>
            <input type="date" className="input-base" value={goal.startDate} onChange={e => update('startDate', e.target.value)} />
          </div>
          <div>
            <label className="label-base">Target date</label>
            <input type="date" className="input-base" value={goal.targetDate} onChange={e => update('targetDate', e.target.value)} />
          </div>
          <div>
            <label className="label-base">Goal status</label>
            <select className="input-base" value={goal.status} onChange={e => update('status', e.target.value)}>
              <option>Not started</option>
              <option>In progress</option>
              <option>Achieved</option>
              <option>Not achieved</option>
            </select>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold text-gray-600 flex items-center gap-1.5">📋 Intervention / Procedure</p>
            <button type="button" onClick={addProcedure} className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors">
              + Add procedure
            </button>
          </div>

          {(goal.procedures || []).map((procedure, procedureIndex) => (
            <div key={procedure.id} className="bg-white rounded-xl border border-gray-200 p-3 space-y-3 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-gray-600">Procedure {procedureIndex + 1}</p>
                <button type="button" onClick={() => removeProcedure(procedure.id)} className="text-xs text-gray-400 hover:text-red-500">
                  Remove
                </button>
              </div>
              <div>
                <label className="label-base">Procedure description <span className="text-red-400">*</span></label>
                <textarea className="input-base resize-none" rows={2} placeholder="Describe the monitoring or treatment procedure…" value={procedure.description} onChange={e => updateProcedure(procedure.id, 'description', e.target.value)} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="label-base">Frequency <span className="text-red-400">*</span></label>
                  <select className="input-base" value={procedure.frequency} onChange={e => updateProcedure(procedure.id, 'frequency', e.target.value)}>
                    {FREQUENCIES.map(freq => <option key={freq}>{freq}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-base">Times per day</label>
                  <input type="number" min={1} max={12} placeholder="1–12" className="input-base" value={procedure.timesPerDay} onChange={e => updateProcedure(procedure.id, 'timesPerDay', e.target.value)} />
                </div>
                <div>
                  <label className="label-base">Assigned device</label>
                  <select className="input-base" value={procedure.device} onChange={e => updateProcedure(procedure.id, 'device', e.target.value)}>
                    <option value="">None</option>
                    {DEVICES.map(device => <option key={device.id} value={device.id}>{device.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GoalBuilder({ goals, onAdd, onRemove, onUpdate }) {
  return (
    <div>
      {goals.map((goal, index) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          index={index + 1}
          onUpdate={updatedGoal => onUpdate(goal.id, updatedGoal)}
          onRemove={() => onRemove(goal.id)}
        />
      ))}
      <button type="button" onClick={onAdd} className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 border-2 border-dashed border-gray-200 hover:border-blue-300 rounded-xl py-3 transition-all">
        + Add another goal
      </button>
    </div>
  );
}
