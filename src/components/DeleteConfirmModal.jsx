export default function DeleteConfirmModal({ plan, patientName, onConfirm, onCancel }) {
  if (!plan) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-sm p-6">
        <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-2xl mx-auto mb-4">🗑</div>
        <h3 className="text-base font-bold text-gray-900 text-center mb-1">Delete care plan?</h3>
        <p className="text-sm text-gray-500 text-center mb-1">Plan <span className="font-mono font-semibold text-gray-700">{plan.id}</span></p>
        <p className="text-sm text-gray-500 text-center mb-6">for <span className="font-semibold text-gray-700">{patientName}</span> will be permanently removed.</p>
        <div className="flex gap-3">
          <button className="flex-1 btn-ghost py-2.5 justify-center" onClick={onCancel}>Cancel</button>
          <button className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors" onClick={onConfirm}>Delete plan</button>
        </div>
      </div>
    </div>
  );
}
