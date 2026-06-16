'use client';

import { useState } from 'react';

export default function AutoDeleteButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAutoDelete = async () => {
    if (!confirm('Delete quiz results older than 30 days? This action cannot be undone.')) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/admin/auto-delete-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days: 30 })
      });
      const data = await res.json();
      setResult(data);
      alert(`✅ Deleted ${data.deletedCount} old results. ${data.remainingResults} results remaining.`);
    } catch (error) {
      alert('Error deleting data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAutoDelete}
      disabled={loading}
      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
    >
      {loading ? 'Deleting...' : '🗑️ Auto-Delete Old Results (30 Days)'}
    </button>
  );
}
