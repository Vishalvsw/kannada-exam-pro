'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPanel() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [questions, setQuestions] = useState([]);
  const [qaQuestions, setQaQuestions] = useState([]);
  const [notes, setNotes] = useState([]);
  const [currentAffairs, setCurrentAffairs] = useState([]);
  const [users, setUsers] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  
  // Form states
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // Explanation Editor states
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const [explanationQuestion, setExplanationQuestion] = useState(null);
  const [explanationText, setExplanationText] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('admin');
    if (!token || !adminData) {
      router.push('/admin-login');
      return;
    }
    setAdmin(JSON.parse(adminData));
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const [qRes, qaRes, nRes, caRes, uRes, rRes] = await Promise.all([
          fetch('/api/questions').catch(() => ({ json: () => [] })),
          fetch('/api/admin/qa-questions').catch(() => ({ json: () => [] })),
          fetch('/api/admin/notes').catch(() => ({ json: () => [] })),
          fetch('/api/admin/current-affairs').catch(() => ({ json: () => [] })),
          fetch('/api/admin/users').catch(() => ({ json: () => [] })),
          fetch('/api/quiz-results').catch(() => ({ json: () => [] }))
        ]);
        setQuestions(await qRes.json());
        setQaQuestions(await qaRes.json());
        setNotes(await nRes.json());
        setCurrentAffairs(await caRes.json());
        setUsers(await uRes.json());
        setQuizResults(await rRes.json());
      } else if (activeTab === 'questions') {
        const res = await fetch('/api/questions');
        setQuestions(await res.json());
      } else if (activeTab === 'qa-questions') {
        const res = await fetch('/api/admin/qa-questions');
        setQaQuestions(await res.json());
      } else if (activeTab === 'notes') {
        const res = await fetch('/api/admin/notes');
        setNotes(await res.json());
      } else if (activeTab === 'current-affairs') {
        const res = await fetch('/api/admin/current-affairs');
        setCurrentAffairs(await res.json());
      } else if (activeTab === 'users') {
        const res = await fetch('/api/admin/users');
        setUsers(await res.json());
      } else if (activeTab === 'results') {
        const res = await fetch('/api/quiz-results');
        setQuizResults(await res.json());
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingItem ? 'PUT' : 'POST';
    let url = '';
    
    if (activeTab === 'questions') url = editingItem ? `/api/questions?id=${editingItem._id}` : '/api/questions';
    else if (activeTab === 'qa-questions') url = editingItem ? `/api/admin/qa-questions?id=${editingItem._id}` : '/api/admin/qa-questions';
    else if (activeTab === 'notes') url = editingItem ? `/api/admin/notes?id=${editingItem._id}` : '/api/admin/notes';
    else if (activeTab === 'current-affairs') url = editingItem ? `/api/admin/current-affairs?id=${editingItem._id}` : '/api/admin/current-affairs';
    
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setShowModal(false);
        setEditingItem(null);
        setFormData({});
        fetchData();
        setMessage({ text: 'Saved successfully!', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      } else {
        setMessage({ text: 'Error saving', type: 'error' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      }
    } catch (error) {
      setMessage({ text: 'Error saving', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this item? This cannot be undone.')) {
      let url = '';
      if (activeTab === 'questions') url = `/api/questions?id=${id}`;
      else if (activeTab === 'qa-questions') url = `/api/admin/qa-questions?id=${id}`;
      else if (activeTab === 'notes') url = `/api/admin/notes?id=${id}`;
      else if (activeTab === 'current-affairs') url = `/api/admin/current-affairs?id=${id}`;
      
      try {
        const response = await fetch(url, { method: 'DELETE' });
        if (response.ok) {
          fetchData();
          setMessage({ text: 'Deleted successfully!', type: 'success' });
          setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } else {
          setMessage({ text: 'Error deleting', type: 'error' });
          setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        }
      } catch (error) {
        setMessage({ text: 'Error deleting', type: 'error' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      }
    }
  };

  const handleUpdateExplanation = async () => {
    if (!explanationQuestion) return;
    
    try {
      const response = await fetch('/api/admin/update-explanation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: explanationQuestion._id,
          explanation: explanationText
        })
      });
      
      if (response.ok) {
        setMessage({ text: 'Explanation updated successfully!', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        setShowExplanationModal(false);
        fetchData();
      } else {
        setMessage({ text: 'Error updating explanation', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error updating explanation', type: 'error' });
    }
  };

  const getFormFields = () => {
    if (activeTab === 'questions') {
      return (
        <>
          <div><label className="block text-sm font-medium mb-2">Question *</label><textarea required className="w-full p-2 border rounded-lg" rows="3" value={formData.question || ''} onChange={(e) => setFormData({ ...formData, question: e.target.value })} placeholder="Enter question" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium mb-2">Option A *</label><input required className="w-full p-2 border rounded-lg" value={formData.options?.[0] || ''} onChange={(e) => setFormData({ ...formData, options: [e.target.value, formData.options?.[1] || '', formData.options?.[2] || '', formData.options?.[3] || ''] })} placeholder="Option A" /></div>
            <div><label className="block text-sm font-medium mb-2">Option B *</label><input required className="w-full p-2 border rounded-lg" value={formData.options?.[1] || ''} onChange={(e) => setFormData({ ...formData, options: [formData.options?.[0] || '', e.target.value, formData.options?.[2] || '', formData.options?.[3] || ''] })} placeholder="Option B" /></div>
            <div><label className="block text-sm font-medium mb-2">Option C *</label><input required className="w-full p-2 border rounded-lg" value={formData.options?.[2] || ''} onChange={(e) => setFormData({ ...formData, options: [formData.options?.[0] || '', formData.options?.[1] || '', e.target.value, formData.options?.[3] || ''] })} placeholder="Option C" /></div>
            <div><label className="block text-sm font-medium mb-2">Option D *</label><input required className="w-full p-2 border rounded-lg" value={formData.options?.[3] || ''} onChange={(e) => setFormData({ ...formData, options: [formData.options?.[0] || '', formData.options?.[1] || '', formData.options?.[2] || '', e.target.value] })} placeholder="Option D" /></div>
          </div>
          <div><label className="block text-sm font-medium mb-2">Correct Answer *</label><input required className="w-full p-2 border rounded-lg" value={formData.answer || ''} onChange={(e) => setFormData({ ...formData, answer: e.target.value })} placeholder="Correct answer" /></div>
          
          <div className="mt-3">
            <label className="block text-sm font-medium mb-2">📖 Explanation (What users see after answering)</label>
            <textarea 
              className="w-full p-2 border rounded-lg bg-blue-50" 
              rows="4" 
              value={formData.explanation || ''} 
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              placeholder="Explain why this answer is correct. This helps students learn from their mistakes."
            />
            <p className="text-xs text-gray-400 mt-1">💡 Tip: Add detailed explanation with key points for better learning</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium mb-2">Category</label><select className="w-full p-2 border rounded-lg" value={formData.category || 'General'} onChange={(e) => setFormData({ ...formData, category: e.target.value })}><option>General</option><option>Karnataka GK</option><option>Karnataka History</option><option>Karnataka Geography</option><option>Current Affairs</option></select></div>
            <div><label className="block text-sm font-medium mb-2">Difficulty</label><select className="w-full p-2 border rounded-lg" value={formData.difficulty || 'medium'} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}><option>easy</option><option>medium</option><option>hard</option></select></div>
          </div>
        </>
      );
    } else if (activeTab === 'qa-questions') {
      return (
        <>
          <div><label className="block text-sm font-medium mb-2">Question (Kannada) *</label><textarea required className="w-full p-2 border rounded-lg" rows="3" value={formData.question || ''} onChange={(e) => setFormData({ ...formData, question: e.target.value })} placeholder="Enter question in Kannada" /></div>
          <div><label className="block text-sm font-medium mb-2">Question (English)</label><textarea className="w-full p-2 border rounded-lg" rows="2" value={formData.question_en || ''} onChange={(e) => setFormData({ ...formData, question_en: e.target.value })} placeholder="Enter question in English" /></div>
          <div><label className="block text-sm font-medium mb-2">Answer (Kannada) *</label><textarea required className="w-full p-2 border rounded-lg" rows="3" value={formData.answer || ''} onChange={(e) => setFormData({ ...formData, answer: e.target.value })} placeholder="Enter answer in Kannada" /></div>
          <div><label className="block text-sm font-medium mb-2">Answer (English)</label><textarea className="w-full p-2 border rounded-lg" rows="2" value={formData.answer_en || ''} onChange={(e) => setFormData({ ...formData, answer_en: e.target.value })} placeholder="Enter answer in English" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium mb-2">Category</label><select className="w-full p-2 border rounded-lg" value={formData.category || 'General'} onChange={(e) => setFormData({ ...formData, category: e.target.value })}><option>General</option><option>History</option><option>Geography</option><option>Polity</option><option>Economy</option><option>Science</option><option>Current Affairs</option></select></div>
            <div><label className="block text-sm font-medium mb-2">Important</label><select className="w-full p-2 border rounded-lg" value={formData.important || false} onChange={(e) => setFormData({ ...formData, important: e.target.value === 'true' })}><option value="false">No</option><option value="true">Yes (Mark as Important)</option></select></div>
          </div>
        </>
      );
    } else if (activeTab === 'notes') {
      return (
        <>
          <div><label className="block text-sm font-medium mb-2">Title (Kannada) *</label><input required className="w-full p-2 border rounded-lg" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></div>
          <div><label className="block text-sm font-medium mb-2">Title (English)</label><input className="w-full p-2 border rounded-lg" value={formData.title_en || ''} onChange={(e) => setFormData({ ...formData, title_en: e.target.value })} /></div>
          <div><label className="block text-sm font-medium mb-2">Content (Kannada) *</label><textarea required className="w-full p-2 border rounded-lg" rows="5" value={formData.content || ''} onChange={(e) => setFormData({ ...formData, content: e.target.value })} /></div>
          <div><label className="block text-sm font-medium mb-2">Content (English)</label><textarea className="w-full p-2 border rounded-lg" rows="5" value={formData.content_en || ''} onChange={(e) => setFormData({ ...formData, content_en: e.target.value })} /></div>
          <div><label className="block text-sm font-medium mb-2">Category</label><input className="w-full p-2 border rounded-lg" value={formData.category || 'General'} onChange={(e) => setFormData({ ...formData, category: e.target.value })} /></div>
        </>
      );
    } else if (activeTab === 'current-affairs') {
      return (
        <>
          <div><label className="block text-sm font-medium mb-2">Title (Kannada) *</label><input required className="w-full p-2 border rounded-lg" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></div>
          <div><label className="block text-sm font-medium mb-2">Title (English)</label><input className="w-full p-2 border rounded-lg" value={formData.title_en || ''} onChange={(e) => setFormData({ ...formData, title_en: e.target.value })} /></div>
          <div><label className="block text-sm font-medium mb-2">Content (Kannada) *</label><textarea required className="w-full p-2 border rounded-lg" rows="4" value={formData.content || ''} onChange={(e) => setFormData({ ...formData, content: e.target.value })} /></div>
          <div><label className="block text-sm font-medium mb-2">Content (English)</label><textarea className="w-full p-2 border rounded-lg" rows="4" value={formData.content_en || ''} onChange={(e) => setFormData({ ...formData, content_en: e.target.value })} /></div>
          <div><label className="block text-sm font-medium mb-2">Date *</label><input type="date" required className="w-full p-2 border rounded-lg" value={formData.date || new Date().toISOString().split('T')[0]} onChange={(e) => setFormData({ ...formData, date: e.target.value })} /></div>
          <div><label className="block text-sm font-medium mb-2">Category</label><input className="w-full p-2 border rounded-lg" value={formData.category || 'General'} onChange={(e) => setFormData({ ...formData, category: e.target.value })} /></div>
          <div><label className="block text-sm font-medium mb-2">Important</label><select className="w-full p-2 border rounded-lg" value={formData.important || false} onChange={(e) => setFormData({ ...formData, important: e.target.value === 'true' })}><option value="false">No</option><option value="true">Yes (Mark as Important)</option></select></div>
        </>
      );
    }
    return null;
  };

  if (loading && activeTab === 'dashboard') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-indigo-800 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">🎯 Kannada Exam Pro Admin</h1>
              <p className="text-blue-200 text-sm">Complete Content Management System</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold">{admin?.name}</p>
                <p className="text-xs text-blue-200">{admin?.role}</p>
              </div>
              <button onClick={() => { localStorage.removeItem('adminToken'); localStorage.removeItem('admin'); router.push('/'); }} className="bg-red-500/20 hover:bg-red-500/30 px-4 py-2 rounded-lg transition">Logout</button>
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {message.text}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-1 py-2 overflow-x-auto">
            <button onClick={() => { setActiveTab('dashboard'); setShowModal(false); }} className={`px-5 py-2 rounded-lg font-medium capitalize transition-all whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>📊 Dashboard</button>
            <button onClick={() => { setActiveTab('questions'); setShowModal(false); }} className={`px-5 py-2 rounded-lg font-medium capitalize transition-all whitespace-nowrap ${activeTab === 'questions' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>❓ Quiz Questions ({questions.length})</button>
            <button onClick={() => { setActiveTab('qa-questions'); setShowModal(false); }} className={`px-5 py-2 rounded-lg font-medium capitalize transition-all whitespace-nowrap ${activeTab === 'qa-questions' ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>📝 Q&A Bank ({qaQuestions.length})</button>
            <button onClick={() => { setActiveTab('notes'); setShowModal(false); }} className={`px-5 py-2 rounded-lg font-medium capitalize transition-all whitespace-nowrap ${activeTab === 'notes' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>📚 Study Notes ({notes.length})</button>
            <button onClick={() => { setActiveTab('current-affairs'); setShowModal(false); }} className={`px-5 py-2 rounded-lg font-medium capitalize transition-all whitespace-nowrap ${activeTab === 'current-affairs' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>📰 Current Affairs ({currentAffairs.length})</button>
            <button onClick={() => { setActiveTab('users'); setShowModal(false); }} className={`px-5 py-2 rounded-lg font-medium capitalize transition-all whitespace-nowrap ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>👥 Users ({users.length})</button>
            <button onClick={() => { setActiveTab('results'); setShowModal(false); }} className={`px-5 py-2 rounded-lg font-medium capitalize transition-all whitespace-nowrap ${activeTab === 'results' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>📋 Results ({quizResults.length})</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white"><div className="flex justify-between"><div><p className="text-blue-100">Quiz Questions</p><p className="text-4xl font-bold">{questions.length}</p></div><div className="text-5xl">❓</div></div></div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white"><div className="flex justify-between"><div><p className="text-green-100">Q&A Bank</p><p className="text-4xl font-bold">{qaQuestions.length}</p></div><div className="text-5xl">📝</div></div></div>
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white"><div className="flex justify-between"><div><p className="text-emerald-100">Study Notes</p><p className="text-4xl font-bold">{notes.length}</p></div><div className="text-5xl">📚</div></div></div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white"><div className="flex justify-between"><div><p className="text-orange-100">Current Affairs</p><p className="text-4xl font-bold">{currentAffairs.length}</p></div><div className="text-5xl">📰</div></div></div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white"><div className="flex justify-between"><div><p className="text-purple-100">Total Users</p><p className="text-4xl font-bold">{users.length}</p></div><div className="text-5xl">👥</div></div></div>
              <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl shadow-lg p-6 text-white"><div className="flex justify-between"><div><p className="text-pink-100">Quiz Attempts</p><p className="text-4xl font-bold">{quizResults.length}</p></div><div className="text-5xl">📊</div></div></div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6"><h3 className="text-lg font-bold mb-4">⚡ Quick Actions</h3>
                <div className="space-y-3">
                  <button onClick={() => { setActiveTab('questions'); setShowModal(true); setEditingItem(null); setFormData({}); }} className="w-full bg-blue-50 text-blue-600 p-3 rounded-lg text-left hover:bg-blue-100">➕ Add Quiz Question</button>
                  <button onClick={() => { setActiveTab('qa-questions'); setShowModal(true); setEditingItem(null); setFormData({}); }} className="w-full bg-green-50 text-green-600 p-3 rounded-lg text-left hover:bg-green-100">📝 Add Q&A Question</button>
                  <button onClick={() => { setActiveTab('notes'); setShowModal(true); setEditingItem(null); setFormData({}); }} className="w-full bg-emerald-50 text-emerald-600 p-3 rounded-lg text-left hover:bg-emerald-100">📚 Add Study Note</button>
                  <button onClick={() => { setActiveTab('current-affairs'); setShowModal(true); setEditingItem(null); setFormData({}); }} className="w-full bg-orange-50 text-orange-600 p-3 rounded-lg text-left hover:bg-orange-100">📰 Add Current Affairs</button>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6"><h3 className="text-lg font-bold mb-4">📊 Content Stats</h3>
                <div className="space-y-3"><div className="flex justify-between"><span>Total Content Items</span><span className="font-bold">{questions.length + qaQuestions.length + notes.length + currentAffairs.length}</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min((questions.length + qaQuestions.length + notes.length + currentAffairs.length) / 2, 100)}%` }}></div></div>
                <div className="flex justify-between"><span>Q&A Completion</span><span className="font-bold">{qaQuestions.length} / 50+</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-green-600 h-2 rounded-full" style={{ width: `${Math.min(qaQuestions.length, 100)}%` }}></div></div></div>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Questions Management */}
        {activeTab === 'questions' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <button onClick={() => { setShowModal(true); setEditingItem(null); setFormData({}); }} className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">➕ Add Question</button>
              <p className="text-sm text-gray-500">Total: {questions.length} questions</p>
            </div>
            {questions.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-12 text-center"><div className="text-6xl mb-4">❓</div><p className="text-gray-500">No questions yet.</p></div>
            ) : (
              <div className="space-y-4">
                {questions.map((q, idx) => (
                  <div key={q._id} className="bg-white rounded-lg shadow p-5 hover:shadow-md transition">
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <div className="flex gap-2 mb-2">
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">#{idx + 1}</span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{q.category}</span>
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">{q.difficulty}</span>
                        </div>
                        <h3 className="font-semibold mb-2">{q.question}</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="p-1 bg-gray-50 rounded">A) {q.options?.[0]}</div>
                          <div className="p-1 bg-gray-50 rounded">B) {q.options?.[1]}</div>
                          <div className="p-1 bg-gray-50 rounded">C) {q.options?.[2]}</div>
                          <div className="p-1 bg-gray-50 rounded">D) {q.options?.[3]}</div>
                        </div>
                        <p className="text-green-600 text-sm mt-2">✓ Correct Answer: {q.answer}</p>
                        
                        {q.explanation && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-xs font-semibold text-blue-800 mb-1">📖 Current Explanation:</p>
                            <p className="text-sm text-blue-700">{q.explanation}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <button onClick={() => { setEditingItem(q); setFormData(q); setShowModal(true); }} className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600">✏️ Edit</button>
                        <button onClick={() => { setExplanationQuestion(q); setExplanationText(q.explanation || ''); setShowExplanationModal(true); }} className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600">📖 Edit Explanation</button>
                        <button onClick={() => handleDelete(q._id)} className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">🗑️ Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Q&A Bank Management */}
        {activeTab === 'qa-questions' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <button onClick={() => { setShowModal(true); setEditingItem(null); setFormData({}); }} className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">➕ Add Q&A Question</button>
              <p className="text-sm text-gray-500">Total: {qaQuestions.length} Q&A pairs</p>
            </div>
            {qaQuestions.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-12 text-center">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-500">No Q&A questions yet. Click "Add Q&A Question" to create one.</p>
                <p className="text-xs text-gray-400 mt-2">You can add up to 50+ questions for exam preparation</p>
              </div>
            ) : (
              <div className="space-y-4">
                {qaQuestions.map((qa, idx) => (
                  <div key={qa._id} className="bg-white rounded-lg shadow p-5 border-l-4 border-green-500">
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-bold text-green-600">#{idx + 1}</span>
                          {qa.important && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">⭐ Important</span>}
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{qa.category}</span>
                        </div>
                        <p className="font-semibold text-gray-800">❓ {qa.question || qa.question_en}</p>
                        <details className="mt-2">
                          <summary className="cursor-pointer text-green-600 text-sm font-medium">📖 Show Answer</summary>
                          <div className="bg-green-50 rounded-lg p-3 mt-2">
                            <p className="text-sm text-green-700">✓ {qa.answer || qa.answer_en}</p>
                          </div>
                        </details>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingItem(qa); setFormData(qa); setShowModal(true); }} className="px-3 py-1 bg-yellow-500 text-white rounded text-sm">Edit</button>
                        <button onClick={() => handleDelete(qa._id)} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notes Management */}
        {activeTab === 'notes' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <button onClick={() => { setShowModal(true); setEditingItem(null); setFormData({}); }} className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">➕ Add Note</button>
              <p className="text-sm text-gray-500">Total: {notes.length} notes</p>
            </div>
            {notes.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-12 text-center"><div className="text-6xl mb-4">📚</div><p className="text-gray-500">No notes yet.</p></div>
            ) : (
              <div className="space-y-4">
                {notes.map(note => (
                  <div key={note._id} className="bg-white rounded-lg shadow p-5">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold">{note.title}</h3>
                        <p className="text-sm text-gray-500">{note.category}</p>
                        <p className="text-gray-600 mt-2 line-clamp-2">{note.content?.substring(0, 150)}...</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingItem(note); setFormData(note); setShowModal(true); }} className="px-3 py-1 bg-yellow-500 text-white rounded text-sm">Edit</button>
                        <button onClick={() => handleDelete(note._id)} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Current Affairs Management */}
        {activeTab === 'current-affairs' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <button onClick={() => { setShowModal(true); setEditingItem(null); setFormData({}); }} className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">➕ Add Current Affairs</button>
              <p className="text-sm text-gray-500">Total: {currentAffairs.length} items</p>
            </div>
            {currentAffairs.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-12 text-center"><div className="text-6xl mb-4">📰</div><p className="text-gray-500">No current affairs yet.</p></div>
            ) : (
              <div className="space-y-4">
                {currentAffairs.map(ca => (
                  <div key={ca._id} className="bg-white rounded-lg shadow p-5">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold">{ca.title}</h3>
                        <p className="text-sm text-gray-500">{ca.date} | {ca.category}</p>
                        <p className="text-gray-600 mt-2 line-clamp-2">{ca.content?.substring(0, 150)}...</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingItem(ca); setFormData(ca); setShowModal(true); }} className="px-3 py-1 bg-yellow-500 text-white rounded text-sm">Edit</button>
                        <button onClick={() => handleDelete(ca._id)} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users Management */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Instagram</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Quizzes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={user.profileImage} className="w-10 h-10 rounded-full" alt={user.name} />
                          <div><p className="font-medium">{user.name}</p></div>
                        </div>
                       </td>
                      <td className="px-6 py-4">@{user.instagramId}</td>
                      <td className="px-6 py-4 font-semibold text-blue-600">{user.score || 0}</td>
                      <td className="px-6 py-4">{user.totalQuizzesTaken || 0}</td>
                      <td className="px-6 py-4 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <div className="p-8 text-center"><p className="text-gray-500">No users yet</p></div>}
            </div>
          </div>
        )}

        {/* Quiz Results */}
        {activeTab === 'results' && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Instagram</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Score</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Percentage</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {quizResults.map(result => (
                    <tr key={result._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{result.userName}</td>
                      <td className="px-4 py-3">@{result.instagramId}</td>
                      <td className="px-4 py-3 font-bold text-blue-600">{result.score}/{result.totalQuestions}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs ${result.percentage >= 70 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{result.percentage}%</span></td>
                      <td className="px-4 py-3 text-sm">{new Date(result.date || result.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {quizResults.length === 0 && <div className="p-8 text-center"><p className="text-gray-500">No quiz results yet</p></div>}
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{editingItem ? 'Edit' : 'Add'} {activeTab === 'qa-questions' ? 'Q&A Question' : activeTab}</h2>
                <button onClick={() => { setShowModal(false); setEditingItem(null); }} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {getFormFields()}
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button>
                  <button type="button" onClick={() => { setShowModal(false); setEditingItem(null); }} className="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Explanation Editor Modal */}
      {showExplanationModal && explanationQuestion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">📖 Edit Explanation</h2>
                <button onClick={() => { setShowExplanationModal(false); setExplanationQuestion(null); }} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
              </div>
              
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-semibold text-gray-700">Question:</p>
                <p className="text-gray-800 mt-1">{explanationQuestion.question}</p>
                <p className="text-sm text-green-600 mt-2">✓ Correct Answer: {explanationQuestion.answer}</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Explanation (What users see after answering)</label>
                <textarea 
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                  rows="6"
                  value={explanationText}
                  onChange={(e) => setExplanationText(e.target.value)}
                  placeholder="Explain why this answer is correct. Include key points for learning..."
                />
                <p className="text-xs text-gray-400 mt-2">
                  💡 Tip: A good explanation helps students understand the concept, not just the answer.
                </p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button onClick={handleUpdateExplanation} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  💾 Save Explanation
                </button>
                <button onClick={() => { setShowExplanationModal(false); setExplanationQuestion(null); }} className="flex-1 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    if (email === 'admin@kannadaexampro.com' && password === 'Admin@123') {
      return NextResponse.json({
        success: true,
        token: 'demo-token-' + Date.now(),
        admin: {
          id: '1',
          name: 'Admin User',
          email: email,
          role: 'super_admin'
        }
      });
    }
    
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Fetch all current affairs
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const affairs = await db.collection("currentaffairs")
      .find({})
      .sort({ date: -1, createdAt: -1 })
      .toArray();
    
    // Convert dates to simple format
    const formattedAffairs = affairs.map(affair => ({
      ...affair,
      date: affair.date ? affair.date.split('T')[0] : affair.date
    }));
    
    return NextResponse.json(formattedAffairs);
  } catch (error) {
    console.error('Admin GET Error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST - Add new current affair
export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    // Ensure date is in YYYY-MM-DD format
    let dateString = body.date;
    if (!dateString || dateString.includes('T')) {
      dateString = dateString ? dateString.split('T')[0] : new Date().toISOString().split('T')[0];
    }
    
    const newAffair = {
      title: body.title,
      title_en: body.title_en || '',
      content: body.content,
      content_en: body.content_en || '',
      date: dateString,
      category: body.category || 'General',
      important: body.important || false,
      source: body.source || 'Admin',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection("currentaffairs").insertOne(newAffair);
    
    return NextResponse.json({ 
      success: true, 
      _id: result.insertedId,
      ...newAffair 
    }, { status: 201 });
  } catch (error) {
    console.error('Admin POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update existing current affair
export async function PUT(request) {
  try {
    const body = await request.json();
    const { _id, id, ...updateData } = body;
    const objectId = _id || id;
    
    if (!objectId) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    // Fix date format if needed
    if (updateData.date && updateData.date.includes('T')) {
      updateData.date = updateData.date.split('T')[0];
    }
    
    const result = await db.collection("currentaffairs").updateOne(
      { _id: new ObjectId(objectId) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
    
    return NextResponse.json({ success: true, modified: result.modifiedCount });
  } catch (error) {
    console.error('Admin PUT Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Remove current affair
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const result = await db.collection("currentaffairs").deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ success: true, deleted: result.deletedCount });
  } catch (error) {
    console.error('Admin DELETE Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const notes = await db.collection("notes")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(notes);
  } catch (error) {
    console.error('Admin Notes GET Error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const newNote = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection("notes").insertOne(newNote);
    
    return NextResponse.json({ 
      success: true, 
      _id: result.insertedId,
      id: result.insertedId,
      ...newNote 
    }, { status: 201 });
  } catch (error) {
    console.error('Admin Notes POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const result = await db.collection("notes").deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ success: true, deleted: result.deletedCount });
  } catch (error) {
    console.error('Admin Notes DELETE Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { _id, id, ...updateData } = body;
    const objectId = _id || id;
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const result = await db.collection("notes").updateOne(
      { _id: new ObjectId(objectId) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
    
    return NextResponse.json({ success: true, modified: result.modifiedCount });
  } catch (error) {
    console.error('Admin Notes PUT Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const qaQuestions = await db.collection("qaquestions")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    const formattedQA = qaQuestions.map(qa => ({
      _id: qa._id.toString(),
      question: qa.question,
      question_en: qa.question_en || '',
      answer: qa.answer,
      answer_en: qa.answer_en || '',
      category: qa.category || 'General',
      important: qa.important || false,
      createdAt: qa.createdAt
    }));
    
    return NextResponse.json(formattedQA);
  } catch (error) {
    console.error('Admin QA GET Error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const newQA = {
      question: body.question,
      question_en: body.question_en || '',
      answer: body.answer,
      answer_en: body.answer_en || '',
      category: body.category || 'General',
      important: body.important === 'true' || body.important === true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection("qaquestions").insertOne(newQA);
    
    return NextResponse.json({ success: true, _id: result.insertedId.toString(), ...newQA });
  } catch (error) {
    console.error('Admin QA POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    await db.collection("qaquestions").deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin QA DELETE Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET all questions
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const questions = await db.collection("questions")
      .find({})
      .toArray();
    
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Admin Questions GET Error:', error);
    return NextResponse.json([], { status: 500 });
  }
}

// POST new question
export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const newQuestion = {
      ...body,
      createdAt: new Date()
    };
    
    const result = await db.collection("questions").insertOne(newQuestion);
    
    return NextResponse.json({ success: true, _id: result.insertedId });
  } catch (error) {
    console.error('Admin Questions POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE question
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const result = await db.collection("questions").deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ success: true, deleted: result.deletedCount });
  } catch (error) {
    console.error('Admin Questions DELETE Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    const { questionId, explanation } = await request.json();
    
    if (!questionId) {
      return NextResponse.json({ error: 'Question ID required' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const result = await db.collection("questions").updateOne(
      { _id: new ObjectId(questionId) },
      { 
        $set: { 
          explanation: explanation || 'No explanation provided.',
          updatedAt: new Date(),
          updatedBy: "admin"
        } 
      }
    );
    
    return NextResponse.json({ 
      success: true, 
      message: "Explanation updated successfully",
      modified: result.modifiedCount 
    });
  } catch (error) {
    console.error('Error updating explanation:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const users = await db.collection("users")
      .find({})
      .sort({ score: -1, createdAt: -1 })
      .toArray();
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Admin Users GET Error:', error);
    return NextResponse.json([], { status: 200 });
  }
}
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const users = await db.collection("users")
      .find({})
      .sort({ score: -1, createdAt: -1 })
      .toArray();
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Admin Users GET Error:', error);
    return NextResponse.json([], { status: 200 });
  }
}
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    // Get ALL current affairs (no date filtering)
    const affairs = await db.collection("currentaffairs")
      .find({})
      .sort({ date: -1, createdAt: -1 })
      .toArray();
    
    console.log(`📰 Returning ${affairs.length} current affairs to user`);
    return NextResponse.json(affairs);
  } catch (error) {
    console.error('Current Affairs API Error:', error);
    return NextResponse.json([]);
  }
}
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Fetch all current affairs (for admin panel)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const affairs = await db.collection("currentaffairs")
      .find({})
      .sort({ date: -1, createdAt: -1 })
      .toArray();
    
    // Convert dates to simple format
    const formattedAffairs = affairs.map(affair => ({
      ...affair,
      date: affair.date ? affair.date.split('T')[0] : affair.date
    }));
    
    return NextResponse.json(formattedAffairs);
  } catch (error) {
    console.error('Admin GET Error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST - Add new current affair
export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    // Ensure date is in YYYY-MM-DD format
    let dateString = body.date;
    if (!dateString || dateString.includes('T')) {
      dateString = dateString ? dateString.split('T')[0] : new Date().toISOString().split('T')[0];
    }
    
    const newAffair = {
      title: body.title,
      title_en: body.title_en || '',
      content: body.content,
      content_en: body.content_en || '',
      date: dateString,
      category: body.category || 'General',
      important: body.important || false,
      source: body.source || 'Admin',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection("currentaffairs").insertOne(newAffair);
    
    return NextResponse.json({ 
      success: true, 
      _id: result.insertedId,
      ...newAffair 
    }, { status: 201 });
  } catch (error) {
    console.error('Admin POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update existing current affair
export async function PUT(request) {
  try {
    const body = await request.json();
    const { _id, id, ...updateData } = body;
    const objectId = _id || id;
    
    if (!objectId) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    // Fix date format if needed
    if (updateData.date && updateData.date.includes('T')) {
      updateData.date = updateData.date.split('T')[0];
    }
    
    const result = await db.collection("currentaffairs").updateOne(
      { _id: new ObjectId(objectId) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
    
    return NextResponse.json({ success: true, modified: result.modifiedCount });
  } catch (error) {
    console.error('Admin PUT Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Remove current affair
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const result = await db.collection("currentaffairs").deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ success: true, deleted: result.deletedCount });
  } catch (error) {
    console.error('Admin DELETE Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import { getQuestions, getUsers, getCurrentAffairs } from '@/lib/storage';

export async function GET() {
  try {
    const conn = await connectDB();
    
    if (conn && mongoose.connection.readyState === 1) {
      const db = mongoose.connection.db;
      return NextResponse.json({
        success: true,
        database: 'MongoDB Atlas',
        status: 'connected',
        collections: {
          questions: await db.collection('questions').countDocuments(),
          users: await db.collection('users').countDocuments(),
          currentAffairs: await db.collection('currentaffairs').countDocuments(),
          quizResults: await db.collection('quizresults').countDocuments()
        },
        message: '✅ Using MongoDB Atlas (permanent storage)'
      });
    }
    
    return NextResponse.json({
      success: true,
      database: 'In-Memory Storage (storage.js)',
      status: 'connected (fallback)',
      collections: {
        questions: getQuestions()?.length || 0,
        users: getUsers()?.length || 0,
        currentAffairs: getCurrentAffairs()?.length || 0
      },
      message: '⚠️ Using fallback storage. Add MONGODB_URI for permanent storage.'
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    // Get filter from query params
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all-time';
    
    let dateFilter = {};
    const now = new Date();
    
    switch(filter) {
      case 'today':
        dateFilter = {
          lastQuizDate: {
            $gte: new Date(now.setHours(0, 0, 0, 0))
          }
        };
        break;
      case 'week':
        dateFilter = {
          lastQuizDate: {
            $gte: new Date(now.setDate(now.getDate() - 7))
          }
        };
        break;
      case 'month':
        dateFilter = {
          lastQuizDate: {
            $gte: new Date(now.setMonth(now.getMonth() - 1))
          }
        };
        break;
      default:
        dateFilter = {};
    }
    
    // First, aggregate scores from quiz-results to ensure accuracy
    const quizResultsAgg = await db.collection("quizresults")
      .aggregate([
        {
          $group: {
            _id: "$instagramId",
            totalScore: { $sum: "$score" },
            quizzesTaken: { $sum: 1 },
            lastQuizDate: { $max: "$completedAt" },
            avgPercentage: { $avg: "$percentage" }
          }
        }
      ])
      .toArray();
    
    // Create a map of aggregated scores
    const scoreMap = new Map();
    quizResultsAgg.forEach(result => {
      scoreMap.set(result._id, {
        totalScore: result.totalScore,
        quizzesTaken: result.quizzesTaken,
        lastQuizDate: result.lastQuizDate,
        avgPercentage: result.avgPercentage
      });
    });
    
    // Get users from users collection
    const users = await db.collection("users")
      .find(dateFilter)
      .toArray();
    
    // Merge data: use quiz-results for scores, users for profile info
    const mergedUsers = users.map(user => {
      const quizData = scoreMap.get(user.instagramId) || {};
      return {
        _id: user._id,
        name: user.name || 'Anonymous',
        instagramId: user.instagramId || 'user',
        email: user.email,
        score: quizData.totalScore || user.score || 0,
        totalQuizzesTaken: quizData.quizzesTaken || user.totalQuizzesTaken || 0,
        lastQuizDate: quizData.lastQuizDate || user.lastQuizDate,
        avgPercentage: quizData.avgPercentage || 0
      };
    });
    
    // Also include users who have quiz results but aren't in users collection
    for (const [instagramId, data] of scoreMap) {
      if (!mergedUsers.find(u => u.instagramId === instagramId)) {
        mergedUsers.push({
          instagramId: instagramId,
          name: instagramId,
          score: data.totalScore,
          totalQuizzesTaken: data.quizzesTaken,
          lastQuizDate: data.lastQuizDate,
          avgPercentage: data.avgPercentage
        });
      }
    }
    
    // Sort by score descending and limit to 100
    const sortedUsers = mergedUsers
      .sort((a, b) => b.score - a.score)
      .slice(0, 100);
    
    return NextResponse.json(sortedUsers);
  } catch (error) {
    console.error('Leaderboard Error:', error);
    return NextResponse.json([], { status: 500 });
  }
}import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    // Get ALL notes (remove any filters)
    const notes = await db.collection("notes")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    console.log(`📝 Returning ${notes.length} notes to user`);
    return NextResponse.json(notes);
  } catch (error) {
    console.error('Notes API Error:', error);
    return NextResponse.json([]);
  }
}
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const note = await db.collection("notes").findOne({ _id: new ObjectId(id) });
    
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    
    return NextResponse.json(note);
  } catch (error) {
    console.error('Note detail API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}




import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    // Get ALL Q&A questions
    const qaQuestions = await db.collection("qaquestions")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    console.log(`❓ Returning ${qaQuestions.length} Q&A to user`);
    return NextResponse.json(qaQuestions);
  } catch (error) {
    console.error('QA Questions API Error:', error);
    return NextResponse.json([]);
  }
}
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const questions = await db.collection("questions")
      .find({})
      .toArray();
    
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Questions API Error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const newQuestion = {
      question: body.question,
      options: body.options,
      answer: body.answer,
      explanation: body.explanation || 'No explanation provided.',
      category: body.category || 'General',
      difficulty: body.difficulty || 'medium',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection("questions").insertOne(newQuestion);
    
    return NextResponse.json({ success: true, _id: result.insertedId });
  } catch (error) {
    console.error('Questions POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const result = await db.collection("questions").deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ success: true, deleted: result.deletedCount });
  } catch (error) {
    console.error('Questions DELETE Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { _id, ...updateData } = body;
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const result = await db.collection("questions").updateOne(
      { _id: new ObjectId(_id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
    
    return NextResponse.json({ success: true, modified: result.modifiedCount });
  } catch (error) {
    console.error('Questions PUT Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const results = await db.collection("quizresults")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Quiz Results API Error:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const client = await clientPromise;
    const db = client.db("kannada_exam_pro");
    
    const result = await db.collection("quizresults").insertOne({
      ...data,
      createdAt: new Date(),
      date: new Date().toISOString()
    });
    
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Save Quiz Result Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



-------------------- pages now -------------------------



'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdSpace from '@/components/AdSpace';

export default function CurrentAffairsPage() {
  const [affairs, setAffairs] = useState([]);
  const [allAffairs, setAllAffairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchCurrentAffairs();
    }
  }, [selectedDate, selectedCategory]);

  const fetchCurrentAffairs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/current-affairs');
      const data = await res.json();
      setAllAffairs(Array.isArray(data) ? data : []);
      let filtered = Array.isArray(data) ? data.filter(a => a.date === selectedDate) : [];
      
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(a => a.category === selectedCategory);
      }
      
      setAffairs(filtered);
    } catch (error) {
      console.error('Error fetching affairs:', error);
      setAffairs([]);
      setAllAffairs([]);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const handleDateSelect = (day) => {
    const newDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(newDate);
    setCalendarOpen(false);
  };

  const changeMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const categories = ['all', ...new Set(allAffairs.map(a => a.category).filter(Boolean))];

  const filteredAffairs = affairs.filter(affair => {
    const matchesSearch = searchTerm === '' || 
                          affair.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          affair.content?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Select a date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AdSpace type="banner" className="mx-4 mt-2" />

      {/* Header - Green */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 pt-6 pb-8">
        <div className="max-w-md mx-auto text-center">
          <div className="text-5xl mb-2 animate-bounce">📰</div>
          <h1 className="text-2xl font-bold">Current Affairs</h1>
          <p className="text-green-100 text-sm mt-1">Daily updates for competitive exams</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto px-4 -mt-4">
        <div className="bg-white rounded-xl shadow-lg p-3">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xl">🔍</span>
            <input
              type="text"
              placeholder="Search current affairs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none text-sm"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Date Picker - Green */}
      <div className="max-w-md mx-auto px-4 mt-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs opacity-90">Selected Date</p>
                <p className="text-lg font-semibold">{formatDate(selectedDate)}</p>
              </div>
              <button 
                onClick={() => setCalendarOpen(!calendarOpen)}
                className="bg-white/20 px-3 py-1 rounded-lg text-sm"
              >
                {calendarOpen ? 'Close 📅' : 'Change Date 📅'}
              </button>
            </div>
          </div>

          {calendarOpen && (
            <div className="p-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth('prev')} className="w-8 h-8 rounded-full hover:bg-gray-100">◀</button>
                <h3 className="font-semibold text-gray-800">
                  {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}
                </h3>
                <button onClick={() => changeMonth('next')} className="w-8 h-8 rounded-full hover:bg-gray-100">▶</button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="text-gray-500 font-semibold text-xs py-2">{day}</div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {Array(getFirstDayOfMonth(currentYear, currentMonth)).fill().map((_, i) => (
                  <div key={`empty-${i}`} className="p-2"></div>
                ))}
                {Array(getDaysInMonth(currentYear, currentMonth)).fill().map((_, i) => {
                  const day = i + 1;
                  const isToday = day === new Date().getDate() && 
                                  currentMonth === new Date().getMonth() && 
                                  currentYear === new Date().getFullYear();
                  return (
                    <button
                      key={day}
                      onClick={() => handleDateSelect(day)}
                      className={`p-2 rounded-lg hover:bg-green-100 transition ${
                        isToday ? 'bg-green-100 text-green-600 font-bold' : 'text-gray-700'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => {
                  const today = new Date();
                  setCurrentMonth(today.getMonth());
                  setCurrentYear(today.getFullYear());
                  setSelectedDate(today.toISOString().split('T')[0]);
                  setCalendarOpen(false);
                }}
                className="w-full mt-4 text-center text-xs text-green-600 py-2 border-t hover:bg-green-50 transition"
              >
                📅 Go to Today
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Category Filters - Green */}
      {categories.length > 1 && (
        <div className="max-w-md mx-auto px-4 mt-4 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {cat === 'all' ? '📰 All' : cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="max-w-md mx-auto px-4 mt-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-gray-800">📅 {formatDate(selectedDate)}</h2>
          <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {filteredAffairs.length} {filteredAffairs.length === 1 ? 'update' : 'updates'}
          </p>
        </div>

        {/* Content - List View Only with Green Border */}
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredAffairs.length > 0 ? (
          <div className="space-y-3">
            {filteredAffairs.map((affair, idx) => (
              <div key={affair._id || idx} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="border-l-4 border-green-500 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-sm leading-relaxed">
                        {affair.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                          📅 {affair.date}
                        </span>
                        {affair.category && (
                          <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                            📂 {affair.category}
                          </span>
                        )}
                      </div>
                      <details className="mt-2">
                        <summary className="cursor-pointer text-green-600 text-xs font-medium hover:text-green-700 transition inline-flex items-center gap-1">
                          <span>📖</span> Read More
                        </summary>
                        <p className="text-xs text-gray-600 mt-2 p-3 bg-gray-50 rounded-lg leading-relaxed">
                          {affair.content}
                        </p>
                      </details>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <div className="text-6xl mb-3">📰</div>
            <p className="text-gray-600 font-medium">No current affairs for this date</p>
            <button 
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])} 
              className="mt-4 text-sm text-green-600 underline hover:text-green-700"
            >
              📅 Go to Today
            </button>
          </div>
        )}
      </div>

      {/* Daily Quiz Link - Green */}
      <div className="max-w-md mx-auto px-4 mt-6">
        <Link href="/quiz">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-4 text-white text-center hover:shadow-lg transition transform hover:scale-105">
            <p className="font-semibold">📝 Take Daily Quiz</p>
          </div>
        </Link>
      </div>

      <AdSpace type="banner" className="mx-4 mt-6 mb-4" />

      {/* Bottom Navigation - Green active */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 shadow-lg">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">🏠</span><span className="text-xs">Home</span>
          </Link>
          <Link href="/quiz" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">🎯</span><span className="text-xs">Quiz</span>
          </Link>
          <Link href="/notes" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">📝</span><span className="text-xs">Notes</span>
          </Link>
          <Link href="/current-affairs" className="flex flex-col items-center text-green-600">
            <span className="text-xl">📰</span><span className="text-xs">Current</span>
          </Link>
          <Link href="/leaderboard" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">🏆</span><span className="text-xs">Rank</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">👤</span><span className="text-xs">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}







'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AdSpace from '@/components/AdSpace';

export default function LeaderboardPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get current user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setCurrentUser(userData);
      } catch(e) {
        console.error('Error parsing user:', e);
      }
    }
    
    // Initial fetch
    fetchLeaderboard();
    
    // Refresh every 3 seconds for real-time updates
    const interval = setInterval(() => {
      fetchLeaderboard();
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      // Handle response data
      let allUsers = [];
      if (Array.isArray(data)) {
        allUsers = data;
      } else if (data.users && Array.isArray(data.users)) {
        allUsers = data.users;
      } else {
        allUsers = [];
      }
      
      // Sort by score (highest first)
      const sortedUsers = allUsers.sort((a, b) => (b.score || 0) - (a.score || 0));
      
      setUsers(sortedUsers);
      setTotalParticipants(sortedUsers.length);
      setLastUpdated(new Date());
      setError(null);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError(error.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filterUsersByTime = (users, period) => {
    const now = new Date();
    return users.filter(user => {
      if (period === 'all') return true;
      const userDate = new Date(user.lastQuizDate || user.createdAt);
      if (isNaN(userDate.getTime())) return period === 'all';
      const diffDays = Math.floor((now - userDate) / (1000 * 60 * 60 * 24));
      if (period === 'today') return diffDays === 0;
      if (period === 'week') return diffDays <= 7;
      if (period === 'month') return diffDays <= 30;
      return true;
    });
  };

  const tabs = [
    { id: 'all', label: '🏆 All-Time', icon: '🏆' },
    { id: 'today', label: '📅 Today', icon: '📅' },
    { id: 'week', label: '📆 This Week', icon: '📆' },
    { id: 'month', label: '📊 This Month', icon: '📊' }
  ];

  const filteredUsers = filterUsersByTime(users, activeTab);
  const sortedFilteredUsers = [...filteredUsers].sort((a, b) => (b.score || 0) - (a.score || 0));
  const topThree = sortedFilteredUsers.slice(0, 3);
  const topTen = sortedFilteredUsers.slice(0, 10);
  const remainingUsers = sortedFilteredUsers.slice(10);
  
  const currentUserRank = sortedFilteredUsers.findIndex(u => {
    const userId = (u.instagramId || '').toString().toLowerCase();
    const currentId = (currentUser?.instagramId || '').toString().toLowerCase();
    return userId === currentId;
  }) + 1;

  // Manual refresh
  const handleManualRefresh = () => {
    setLoading(true);
    fetchLeaderboard();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      <AdSpace type="banner" className="mx-4 mt-2" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-5 pt-8 pb-6">
        <div className="text-center">
          <div className="text-5xl mb-2 animate-bounce">🏆</div>
          <h1 className="text-2xl font-bold">Leaderboard</h1>
          <p className="text-purple-100 text-xs mt-1">
            {totalParticipants} Active Participants
            {lastUpdated && <span> · Updated {lastUpdated.toLocaleTimeString()}</span>}
          </p>
          <button 
            onClick={handleManualRefresh}
            className="mt-2 text-xs bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition"
          >
            🔄 Refresh Now
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-md mx-auto px-4 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
            <p className="text-xs text-red-600">⚠️ {error}</p>
            <button onClick={fetchLeaderboard} className="text-xs text-red-600 underline mt-1">Try Again</button>
          </div>
        </div>
      )}

      {/* Your Rank Card */}
      {currentUser && currentUserRank > 0 && currentUserRank <= sortedFilteredUsers.length && (
        <div className="max-w-md mx-auto px-4 mt-4">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border-2 border-purple-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  #{currentUserRank}
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Your Rank</p>
                  <p className="font-bold text-gray-800">@{currentUser.instagramId || currentUser.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 font-semibold">Your Score</p>
                <p className="text-2xl font-bold text-purple-600">{currentUser.score || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="max-w-md mx-auto px-4 mt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-gray-100 rounded-lg p-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 text-xs font-medium rounded-lg transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md transform scale-105'
                  : 'text-gray-500 hover:bg-gray-200'
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      {!loading && topThree.length >= 3 && (
        <div className="max-w-md mx-auto px-4 mt-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-center text-sm font-bold text-gray-600 mb-6">🏆 Top Performers 🏆</h3>
            <div className="flex justify-center items-end gap-2">
              {/* 2nd Place */}
              <div className="text-center w-24">
                <div className="relative">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-3xl ring-2 ring-gray-400 shadow-md">
                    🥈
                  </div>
                </div>
                <p className="font-bold text-gray-800 text-sm mt-2 truncate">{topThree[1]?.name?.split(' ')[0] || 'User'}</p>
                <p className="text-xs text-gray-500 truncate">@{topThree[1]?.instagramId}</p>
                <p className="text-xl font-bold text-gray-700 mt-1">{topThree[1]?.score || 0}</p>
                <div className="mt-2 h-16 bg-gradient-to-t from-gray-200 to-gray-100 rounded-t-lg w-full"></div>
                <p className="text-xs text-gray-400 mt-1 font-semibold">2nd Place</p>
              </div>

              {/* 1st Place */}
              <div className="text-center w-28 -mt-6">
                <div className="relative">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-4xl ring-4 ring-yellow-400 shadow-lg animate-pulse">
                    👑
                  </div>
                </div>
                <p className="font-bold text-gray-800 text-base mt-2 truncate">{topThree[0]?.name || 'Champion'}</p>
                <p className="text-xs text-gray-500 truncate">@{topThree[0]?.instagramId}</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">{topThree[0]?.score || 0}</p>
                <div className="mt-2 h-20 bg-gradient-to-t from-yellow-200 to-yellow-100 rounded-t-lg w-full"></div>
                <p className="text-xs text-yellow-600 font-bold mt-1">🏆 CHAMPION 🏆</p>
              </div>

              {/* 3rd Place */}
              <div className="text-center w-24">
                <div className="relative">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-3xl ring-2 ring-orange-500 shadow-md">
                    🥉
                  </div>
                </div>
                <p className="font-bold text-gray-800 text-sm mt-2 truncate">{topThree[2]?.name?.split(' ')[0] || 'User'}</p>
                <p className="text-xs text-gray-500 truncate">@{topThree[2]?.instagramId}</p>
                <p className="text-xl font-bold text-orange-600 mt-1">{topThree[2]?.score || 0}</p>
                <div className="mt-2 h-12 bg-gradient-to-t from-orange-200 to-orange-100 rounded-t-lg w-full"></div>
                <p className="text-xs text-gray-400 mt-1 font-semibold">3rd Place</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top 10 List */}
      {!loading && topTen.length > 0 && (
        <div className="max-w-md mx-auto px-4 mt-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="text-purple-600">⭐</span> Top 10 Rankers
            <span className="text-xs text-gray-400 font-normal">({topTen.length} of {totalParticipants})</span>
          </h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {topTen.map((user, idx) => {
              const rank = idx + 1;
              const isCurrentUser = (user.instagramId || '').toLowerCase() === (currentUser?.instagramId || '').toLowerCase();
              return (
                <div 
                  key={user._id || idx} 
                  className={`px-4 py-3 flex items-center justify-between border-b border-gray-100 last:border-0 transition-all ${
                    isCurrentUser ? 'bg-purple-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md ${
                      rank === 1 ? 'bg-yellow-500' : 
                      rank === 2 ? 'bg-gray-500' : 
                      rank === 3 ? 'bg-orange-500' : 
                      'bg-purple-500'
                    }`}>
                      {rank}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {user.name || 'Anonymous'}
                        {isCurrentUser && <span className="ml-1 text-xs text-purple-600 font-bold">(You)</span>}
                      </p>
                      <p className="text-xs text-gray-400">@{user.instagramId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-purple-600">{user.score || 0}</p>
                    <p className="text-[10px] text-gray-400">{user.totalQuizzesTaken || 0} quizzes</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Remaining Users */}
      {!loading && remainingUsers.length > 0 && (
        <div className="max-w-md mx-auto px-4 mt-6 mb-20">
          <details className="group">
            <summary className="cursor-pointer text-sm font-semibold text-gray-600 bg-gray-100 px-4 py-2 rounded-lg inline-flex items-center gap-2 hover:bg-gray-200 transition">
              <span>📋</span> View All ({remainingUsers.length} more)
              <svg className="w-4 h-4 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="mt-3 bg-white rounded-xl shadow-lg overflow-hidden">
              {remainingUsers.map((user, idx) => {
                const rank = idx + 11;
                const isCurrentUser = (user.instagramId || '').toLowerCase() === (currentUser?.instagramId || '').toLowerCase();
                return (
                  <div 
                    key={user._id || idx} 
                    className={`px-4 py-2 flex items-center justify-between border-b border-gray-100 last:border-0 ${
                      isCurrentUser ? 'bg-purple-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-xs">
                        {rank}
                      </div>
                      <div>
                        <p className="font-medium text-gray-700 text-sm">
                          {user.name || 'Anonymous'}
                          {isCurrentUser && <span className="ml-1 text-xs text-purple-600">(You)</span>}
                        </p>
                        <p className="text-xs text-gray-400">@{user.instagramId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-purple-600">{user.score || 0}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </details>
        </div>
      )}

      {loading && (
        <div className="max-w-md mx-auto px-4 mt-6 text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading leaderboard...</p>
        </div>
      )}

      {!loading && sortedFilteredUsers.length === 0 && !error && (
        <div className="max-w-md mx-auto px-4 mt-12 text-center">
          <div className="text-6xl mb-3">🏆</div>
          <p className="text-gray-600 font-medium">No rankings yet</p>
          <p className="text-xs text-gray-400 mt-1">Be the first to take a quiz!</p>
          <Link href="/quiz">
            <button className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition">
              Take First Quiz →
            </button>
          </Link>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 shadow-lg z-50">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center text-gray-500 hover:text-purple-600 transition">
            <span className="text-xl">🏠</span><span className="text-xs">Home</span>
          </Link>
          <Link href="/current-affairs" className="flex flex-col items-center text-gray-500 hover:text-purple-600 transition">
            <span className="text-xl">📰</span><span className="text-xs">Current</span>
          </Link>
          <Link href="/quiz" className="flex flex-col items-center text-gray-500 hover:text-purple-600 transition">
            <span className="text-xl">🎯</span><span className="text-xs">Test</span>
          </Link>
          <Link href="/leaderboard" className="flex flex-col items-center text-purple-600">
            <span className="text-xl">🏆</span><span className="text-xs">Rank</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-500 hover:text-purple-600 transition">
            <span className="text-xl">👤</span><span className="text-xs">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}




'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AdSpace from '@/components/AdSpace';

export default function NoteDetailPage() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchNote();
    }
  }, [id]);

  const fetchNote = async () => {
    try {
      const response = await fetch(`/api/notes/${id}`);
      const data = await response.json();
      setNote(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="text-6xl mb-4">📖</div>
          <h2 className="text-xl font-bold">Note Not Found</h2>
          <Link href="/notes" className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg mt-4">
            ← Back to Notes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AdSpace type="banner" className="mx-4 mt-2" />
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-5 pt-8 pb-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/notes" className="text-white/80 text-sm hover:text-white inline-flex items-center gap-1 mb-4">
            <span>←</span> Back to Notes
          </Link>
          <h1 className="text-2xl font-bold">{note.title}</h1>
          <div className="flex gap-3 mt-4">
            <span className="bg-white/20 rounded-full px-3 py-1 text-xs">{note.category || 'General'}</span>
            <span className="bg-white/20 rounded-full px-3 py-1 text-xs">📅 {new Date(note.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-5 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{note.content}</div>
        </div>
      </div>
      <AdSpace type="banner" className="mx-4 mt-8" />
    </div>
  );
}




'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdSpace from '@/components/AdSpace';

export default function NotesPage() {
  console.log('1. NotesPage component mounted');
  
  const [notes, setNotes] = useState([]);
  const [qaQuestions, setQaQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('qa'); // Q&A as first tab

  useEffect(() => {
    console.log('2. useEffect triggered');
    fetchNotes();
    fetchQAQuestions();
  }, []);
  
  const fetchNotes = async () => {
    console.log('3. fetchNotes function started');
    try {
      console.log('4. About to call /api/notes');
      const response = await fetch('/api/notes');
      console.log('5. Response status:', response.status);
      const data = await response.json();
      console.log('6. Data received:', data);
      setNotes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('7. Error:', error);
      setNotes([]);
    } finally {
      console.log('8. Setting loading to false');
      setLoading(false);
    }
  };

  const fetchQAQuestions = async () => {
    try {
      const response = await fetch('/api/qa-questions');
      const data = await response.json();
      setQaQuestions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching QA questions:', error);
      setQaQuestions([]);
    }
  };

  const categories = ['all', ...new Set(notes.map(n => n.category))];
  
  const filteredNotes = notes.filter(note => {
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    const matchesSearch = note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          note.title_en?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredQA = qaQuestions.filter(qa => {
    const matchesSearch = searchTerm === '' || 
                          qa.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          qa.question_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          qa.answer?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      <AdSpace type="banner" className="mx-4 mt-2" />

      {/* Header - Animated Icon at Top Center */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-5 pt-8 pb-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center">
            {/* Animated Icon */}
            <div className="mb-4 animate-bounce">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300">
                <span className="text-5xl animate-pulse">📚</span>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Study Material</h1>
              <p className="text-green-100 text-sm mt-1">Learn & Practice for Karnataka Exams</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation - Q&A First */}
      <div className="max-w-6xl mx-auto px-5 mt-4">
        <div className="bg-white rounded-2xl shadow-md p-1 flex gap-1">
          <button
            onClick={() => setActiveTab('qa')}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'qa'
                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            ❓ Q&A with Answers ({qaQuestions.length})
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'notes'
                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            📚 Study Notes ({notes.length})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-6xl mx-auto px-5 mt-4">
        <div className="bg-white rounded-2xl shadow-lg p-3">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xl">🔍</span>
            <input
              type="text"
              placeholder={activeTab === 'notes' ? "Search notes by title..." : "Search questions or answers..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none text-sm"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Filters (Only for Notes Tab) */}
      {activeTab === 'notes' && categories.length > 1 && (
        <div className="max-w-6xl mx-auto px-5 mt-6 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {cat === 'all' ? '📚 All Categories' : cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-5 py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading study material...</p>
          </div>
        ) : activeTab === 'qa' ? (
          // Q&A Tab - First Tab
          filteredQA.length > 0 ? (
            <div className="space-y-4">
              {/* Questions List */}
              <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
                {filteredQA.map((qa, index) => (
                  <div key={qa._id || index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="border-l-4 border-green-500 p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 text-base leading-relaxed mb-3">
                            {qa.question || qa.question_en}
                          </h3>
                          <details className="group">
                            <summary className="cursor-pointer inline-flex items-center gap-2 text-green-600 text-sm font-semibold hover:text-green-700 transition">
                              <span className="text-lg">📖</span>
                              <span>Show Answer</span>
                              <svg className="w-4 h-4 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </summary>
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mt-3 border border-green-100">
                              <div className="flex items-start gap-2">
                                <span className="text-green-600 text-lg">✓</span>
                                <p className="text-sm text-green-800 leading-relaxed font-medium">
                                  {qa.answer || qa.answer_en}
                                </p>
                              </div>
                            </div>
                          </details>
                          {qa.category && (
                            <div className="mt-3">
                              <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                                <span>📂</span> {qa.category}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Study Tip */}
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200 mt-4">
                <p className="text-xs text-yellow-800 text-center">
                  💡 Tip: Practice these Q&As daily for better exam preparation!
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
              <div className="text-6xl mb-4">❓</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Q&A Available</h3>
              <p className="text-gray-500 text-sm">Questions and answers will appear here once added.</p>
              <p className="text-xs text-gray-400 mt-3">Contact admin to add study material</p>
            </div>
          )
        ) : (
          // Notes Tab
          filteredNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <Link key={note._id} href={`/notes/${note._id}`}>
                  <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-1">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
                      <div className="flex items-center justify-between">
                        <div className="text-3xl">📘</div>
                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{note.category || 'General'}</span>
                      </div>
                      <h3 className="font-bold text-lg mt-3 line-clamp-2">{note.title}</h3>
                    </div>
                    <div className="p-5">
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {note.content?.substring(0, 120)}...
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xs text-gray-400">📅 {new Date(note.createdAt).toLocaleDateString()}</span>
                        <button className="text-green-600 font-semibold text-sm group-hover:translate-x-1 transition">
                          Read More →
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Notes Available</h3>
              <p className="text-gray-500 text-sm">Study notes will appear here once added.</p>
              <p className="text-xs text-gray-400 mt-3">Check back later for new content</p>
            </div>
          )
        )}
      </div>

      <AdSpace type="banner" className="mx-4 mt-8 mb-4" />

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 shadow-lg">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">🏠</span>
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/quiz" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">🎯</span>
            <span className="text-xs">Quiz</span>
          </Link>
          <Link href="/notes" className="flex flex-col items-center text-green-600">
            <span className="text-xl">📚</span>
            <span className="text-xs">Study</span>
          </Link>
          <Link href="/current-affairs" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">📰</span>
            <span className="text-xs">Current</span>
          </Link>
          <Link href="/leaderboard" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">🏆</span>
            <span className="text-xs">Rank</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">👤</span>
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}



'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdSpace from '@/components/AdSpace';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalScore: 0,
    totalQuizzes: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    accuracy: 0,
    bestScore: 0,
    averagePercentage: 0,
    rank: 0
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [newInstagramId, setNewInstagramId] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const currentUser = JSON.parse(storedUser);
    setUser(currentUser);
    setNewInstagramId(currentUser.instagramId || '');
    fetchUserResults(currentUser);
    fetchUserRank(currentUser);
  }, [router]);

  const fetchUserResults = async (currentUser) => {
    try {
      const response = await fetch('/api/quiz-results');
      if (!response.ok) throw new Error('Failed to fetch quiz results');
      const allResults = await response.json();

      if (!Array.isArray(allResults)) {
        console.error('Invalid API response');
        return;
      }

      const userResults = allResults.filter((r) => r.userEmail === currentUser.email);

      if (userResults.length > 0) {
        setQuizResults(userResults);
      }

      let totalScore = 0;
      let totalQuestions = 0;
      let totalCorrect = 0;
      let bestScore = 0;
      let totalPercentage = 0;

      userResults.forEach((result) => {
        totalScore += result.score || 0;
        totalQuestions += result.totalQuestions || 0;
        totalCorrect += result.correctCount || result.score || 0;
        bestScore = Math.max(bestScore, result.score || 0);
        totalPercentage += result.percentage || 0;
      });

      const totalWrong = totalQuestions - totalCorrect;
      const accuracy = totalQuestions > 0 ? ((totalCorrect / totalQuestions) * 100).toFixed(1) : 0;
      const avgPercentage = userResults.length > 0 ? (totalPercentage / userResults.length).toFixed(1) : 0;

      setStats((prev) => ({
        ...prev,
        totalScore,
        totalQuizzes: userResults.length,
        correctAnswers: totalCorrect,
        wrongAnswers: totalWrong,
        accuracy: Math.min(accuracy, 100),
        bestScore,
        averagePercentage: Math.min(avgPercentage, 100),
      }));
    } catch (error) {
      console.error('Error fetching user results:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRank = async (currentUser) => {
    try {
      const response = await fetch('/api/leaderboard');
      const leaderboard = await response.json();
      const rank = leaderboard.findIndex((u) => u.instagramId === currentUser.instagramId) + 1;
      setStats(prev => ({ ...prev, rank: rank || 0 }));
    } catch (error) {
      console.error('Error fetching rank:', error);
    }
  };

  const handleUpdateInstagram = async () => {
    if (newInstagramId && newInstagramId !== user.instagramId) {
      try {
        // Update in database
        await fetch('/api/users/update-instagram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            oldInstagramId: user.instagramId,
            newInstagramId: newInstagramId.replace('@', '')
          })
        });
        
        // Update local storage
        const updatedUser = { ...user, instagramId: newInstagramId.replace('@', '') };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        fetchUserRank(updatedUser);
      } catch (error) {
        console.error('Error updating Instagram ID:', error);
      }
    }
    setShowEditModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AdSpace type="banner" className="mx-4 mt-2" />

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white pt-8 pb-12">
        <div className="px-5">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <img
                src={user.profileImage || user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3B82F6&color=fff&size=120`}
                className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
                alt={user.name}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3B82F6&color=fff&size=120`;
                }}
              />
              <div className="absolute bottom-1 right-1 bg-green-500 rounded-full w-4 h-4 border-2 border-white"></div>
            </div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg">@{user.instagramId}</span>
              <button onClick={() => setShowEditModal(true)} className="text-sm bg-white/20 px-2 py-1 rounded-lg hover:bg-white/30 transition">
                ✏️ Edit
              </button>
            </div>
            <p className="text-blue-100 text-sm mt-1">{user.email}</p>
            <div className="flex gap-3 mt-3">
              <div className="bg-white/20 rounded-lg px-3 py-1 text-center">
                <p className="text-xs">Member since</p>
                <p className="text-sm font-semibold">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
              </div>
              <div className="bg-white/20 rounded-lg px-3 py-1 text-center">
                <p className="text-xs">Global Rank</p>
                <p className="text-lg font-bold">#{stats.rank || '—'}</p>
              </div>
            </div>
            <Link href="/quiz">
              <button className="mt-4 bg-white text-blue-600 px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition transform hover:scale-105">
                🎯 Take Quiz
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-5 -mt-6">
        <div className="bg-white rounded-2xl shadow-xl p-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <p className="text-gray-500 text-xs">Total Score</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalScore}</p>
              <p className="text-xs text-gray-400 mt-1">points</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <p className="text-gray-500 text-xs">Quizzes Taken</p>
              <p className="text-2xl font-bold text-green-600">{stats.totalQuizzes}</p>
              <p className="text-xs text-gray-400 mt-1">attempts</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <p className="text-gray-500 text-xs">Correct Answers</p>
              <p className="text-2xl font-bold text-purple-600">{stats.correctAnswers}</p>
              <p className="text-xs text-gray-400 mt-1">out of {stats.correctAnswers + stats.wrongAnswers}</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <p className="text-gray-500 text-xs">Accuracy</p>
              <p className="text-2xl font-bold text-orange-600">{stats.accuracy}%</p>
              <p className="text-xs text-gray-400 mt-1">correct rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="px-5 mt-4">
        <div className="bg-white rounded-2xl shadow-md p-4">
          <div className="flex justify-around">
            <div className="text-center">
              <p className="text-gray-500 text-xs">Best Score</p>
              <p className="text-xl font-bold text-yellow-600">{stats.bestScore}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs">Avg Score</p>
              <p className="text-xl font-bold text-indigo-600">{stats.averagePercentage}%</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs">Wrong Answers</p>
              <p className="text-xl font-bold text-red-600">{stats.wrongAnswers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="px-5 mt-6">
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h3 className="text-lg font-bold mb-4">📊 Your Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Overall Score</span>
                <span className="font-semibold text-blue-600">{stats.totalScore} pts</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(stats.totalScore / 10, 100)}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Quiz Completion</span>
                <span className="font-semibold text-green-600">{stats.totalQuizzes} quizzes</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${Math.min(stats.totalQuizzes * 5, 100)}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Accuracy Rate</span>
                <span className="font-semibold text-orange-600">{stats.accuracy}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${stats.accuracy}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz History */}
      <div className="px-5 mt-6">
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h3 className="text-lg font-bold mb-4">📋 Quiz History</h3>
          {quizResults.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">📝</div>
              <p className="text-gray-500">No quiz attempts yet</p>
              <Link href="/quiz" className="inline-block mt-3 text-blue-600 text-sm font-semibold hover:underline">
                Take your first quiz →
              </Link>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {quizResults.map((quiz, idx) => (
                <div key={quiz._id || idx} className="border-b pb-3 last:border-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">Quiz #{quizResults.length - idx}</p>
                      <p className="text-xs text-gray-500">{new Date(quiz.createdAt || quiz.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-600">{quiz.score}/{quiz.totalQuestions}</p>
                      <p className="text-xs text-gray-500">{quiz.percentage}%</p>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-2 text-xs">
                    <span className="text-green-600">✓ {quiz.correctCount || quiz.score} correct</span>
                    <span className="text-red-600">✗ {quiz.wrongCount || quiz.totalQuestions - quiz.score} wrong</span>
                    <span className="text-gray-500">⏱️ {quiz.timeFormatted}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-5 mt-6 flex gap-3 pb-8">
        <Link href="/quiz" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold text-center hover:bg-blue-700 transition">
          🎯 Take New Quiz
        </Link>
        <Link href="/leaderboard" className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold text-center hover:bg-gray-300 transition">
          🏆 View Leaderboard
        </Link>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 shadow-lg">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition">
            <span className="text-xl">🏠</span>
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/quiz" className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition">
            <span className="text-xl">🎯</span>
            <span className="text-xs">Quiz</span>
          </Link>
          <Link href="/notes" className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition">
            <span className="text-xl">📚</span>
            <span className="text-xs">Study</span>
          </Link>
          <Link href="/current-affairs" className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition">
            <span className="text-xl">📰</span>
            <span className="text-xs">Current</span>
          </Link>
          <Link href="/leaderboard" className="flex flex-col items-center text-gray-500 hover:text-blue-600 transition">
            <span className="text-xl">🏆</span>
            <span className="text-xs">Rank</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-blue-600">
            <span className="text-xl">👤</span>
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </div>

      {/* Edit Instagram Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Edit Instagram ID</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Instagram ID</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">@</span>
                <input
                  type="text"
                  value={newInstagramId}
                  onChange={(e) => setNewInstagramId(e.target.value.replace('@', ''))}
                  className="w-full pl-8 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="username"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">This will be visible on leaderboard</p>
            </div>
            <div className="flex gap-3">
              <button onClick={handleUpdateInstagram} className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700">Save</button>
              <button onClick={() => setShowEditModal(false)} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import AdSpace from '@/components/AdSpace';

// export default function QuizPage() {
//   const router = useRouter();
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [score, setScore] = useState(0);
//   const [showResults, setShowResults] = useState(false);
//   const [showReview, setShowReview] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [answers, setAnswers] = useState([]);
//   const [userAnswers, setUserAnswers] = useState([]);
//   const [user, setUser] = useState(null);
//   const [timeLeft, setTimeLeft] = useState(120);
//   const [timerActive, setTimerActive] = useState(true);
//   const [startTime, setStartTime] = useState(null);
//   const [showExplanation, setShowExplanation] = useState(false);
//   const [reviewFilter, setReviewFilter] = useState('all');
//   const [quizLocked, setQuizLocked] = useState(false);
//   const [currentQuizVersion, setCurrentQuizVersion] = useState('');
//   const [isLockedPage, setIsLockedPage] = useState(false);

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     if (!storedUser) {
//       router.push('/login');
//       return;
//     }
//     const userData = JSON.parse(storedUser);
//     if (!userData.instagramId) {
//       router.push('/setup-instagram');
//       return;
//     }
//     setUser(userData);
//     setStartTime(Date.now());
//     checkQuizLockStatus(userData);
//   }, [router]);

//   const checkQuizLockStatus = async (userData) => {
//     try {
//       setLoading(true);
      
//       // Use user-specific keys
//       const savedResults = localStorage.getItem(`quizResults_${userData?.instagramId}`);
//       const savedVersion = localStorage.getItem(`quizVersion_${userData?.instagramId}`);
      
//       if (savedResults && savedVersion) {
//         // User has already taken a quiz - show locked page immediately
//         const parsed = JSON.parse(savedResults);
//         setUserAnswers(parsed.userAnswers || []);
//         setScore(parsed.score || 0);
//         setQuestions(parsed.questions || []);
//         setShowResults(true);
//         setQuizLocked(true);
//         setIsLockedPage(true);
//         setLoading(false);
//         return;
//       }
      
//       // No saved results - fetch questions for new quiz
//       const res = await fetch('/api/questions');
//       const data = await res.json();
      
//       if (data && data.length > 0) {
//         setQuestions(data);
//         setAnswers(new Array(data.length).fill(null));
//         setUserAnswers(new Array(data.length).fill(null));
//         setQuizLocked(false);
//         setIsLockedPage(false);
//         setShowResults(false);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     let timer;
//     if (timerActive && !showResults && !showReview && timeLeft > 0 && !quizLocked && !isLockedPage) {
//       timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
//     } else if (timeLeft === 0 && !showResults && !showReview && !showExplanation && !quizLocked && !isLockedPage) {
//       handleSubmitAnswer();
//     }
//     return () => clearTimeout(timer);
//   }, [timeLeft, timerActive, showResults, showReview, showExplanation, quizLocked, isLockedPage]);

//   const handleAnswerSelect = (answer) => {
//     if (quizLocked || isLockedPage) return;
//     setSelectedAnswer(answer);
//   };

//   const handleSubmitAnswer = () => {
//     if (quizLocked || isLockedPage) return;
//     if (!selectedAnswer && !showExplanation) return;

//     if (!showExplanation && selectedAnswer) {
//       const isCorrect = selectedAnswer === questions[currentQuestion]?.answer;
//       if (isCorrect) {
//         setScore(prev => prev + 1);
//       }
      
//       const newAnswers = [...answers];
//       newAnswers[currentQuestion] = selectedAnswer;
//       setAnswers(newAnswers);
      
//       const newUserAnswers = [...userAnswers];
//       newUserAnswers[currentQuestion] = {
//         selected: selectedAnswer,
//         isCorrect: isCorrect,
//         correctAnswer: questions[currentQuestion]?.answer,
//         question: questions[currentQuestion]?.question,
//         options: questions[currentQuestion]?.options,
//         explanation: questions[currentQuestion]?.explanation
//       };
//       setUserAnswers(newUserAnswers);
      
//       setShowExplanation(true);
//     } else {
//       setShowExplanation(false);
//       setSelectedAnswer(null);
      
//       if (currentQuestion + 1 < questions.length) {
//         setCurrentQuestion(currentQuestion + 1);
//         setTimeLeft(120);
//       } else {
//         calculateScore();
//       }
//     }
//   };

//   const handlePreviousQuestion = () => {
//     if (currentQuestion > 0 && !quizLocked && !isLockedPage) {
//       setShowExplanation(false);
//       setCurrentQuestion(currentQuestion - 1);
//       setSelectedAnswer(answers[currentQuestion - 1] || null);
//       setTimeLeft(120);
//     }
//   };

//   const calculateScore = () => {
//     let finalScore = 0;
//     answers.forEach((answer, idx) => {
//       if (answer && questions[idx] && answer === questions[idx].answer) {
//         finalScore++;
//       }
//     });
    
//     setScore(finalScore);
//     setShowResults(true);
//     setTimerActive(false);
//     setQuizLocked(true);
    
//     // LOCK THE QUIZ - Save results with user-specific keys
//     if (user) {
//       // Create version hash from questions
//       const versionString = questions.map(q => `${q._id || q.id}-${q.answer}`).join(',');
//       const versionHash = btoa(unescape(encodeURIComponent(versionString))).substring(0, 50);
      
//       const finalUserAnswers = [...userAnswers];
//       for (let i = 0; i < answers.length; i++) {
//         if (answers[i] && !finalUserAnswers[i]) {
//           finalUserAnswers[i] = {
//             selected: answers[i],
//             isCorrect: answers[i] === questions[i]?.answer,
//             correctAnswer: questions[i]?.answer,
//             question: questions[i]?.question,
//             options: questions[i]?.options,
//             explanation: questions[i]?.explanation
//           };
//         }
//       }
      
//       // Save with user-specific keys
//       localStorage.setItem(`quizVersion_${user.instagramId}`, versionHash);
//       localStorage.setItem(`quizResults_${user.instagramId}`, JSON.stringify({
//         userAnswers: finalUserAnswers,
//         score: finalScore,
//         questions: questions,
//         completedAt: Date.now()
//       }));
//     }
    
//     saveQuizResult(finalScore);
//   };

//   const saveQuizResult = async (finalScore) => {
//     if (!user) return;
//     const timeTaken = Math.floor((Date.now() - startTime) / 1000);
//     const minutes = Math.floor(timeTaken / 60);
//     const seconds = timeTaken % 60;

//     try {
//       await fetch('/api/quiz-results', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           instagramId: user.instagramId,
//           userName: user.name,
//           userEmail: user.email,
//           score: finalScore,
//           totalQuestions: questions.length,
//           percentage: Math.round((finalScore / questions.length) * 100),
//           timeFormatted: `${minutes}m ${seconds}s`,
//           userAnswers: userAnswers
//         })
//       });
//       const updatedUser = { ...user, score: (user.score || 0) + finalScore, totalQuizzesTaken: (user.totalQuizzesTaken || 0) + 1 };
//       localStorage.setItem('user', JSON.stringify(updatedUser));
//     } catch (error) {
//       console.error('Error saving result:', error);
//     }
//   };

//   const getFilteredQuestions = () => {
//     if (reviewFilter === 'wrong') {
//       return userAnswers.filter((ans) => ans && !ans.isCorrect);
//     } else if (reviewFilter === 'correct') {
//       return userAnswers.filter((ans) => ans && ans.isCorrect);
//     }
//     return userAnswers.filter((ans) => ans !== null);
//   };

//   // LOCKED RESULTS PAGE - User already took quiz (SHOW ONLY THIS)
//   if ((quizLocked || isLockedPage) && showResults && !showReview && !loading) {
//     const percentage = Math.round((score / (questions.length || 1)) * 100);
//     const wrongCount = (questions.length || 0) - score;
    
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 pb-24">
//         <AdSpace type="banner" className="mx-4 mt-2" />
//         <div className="max-w-md mx-auto">
//           <div className="text-center mb-6">
//             <div className="text-7xl mb-4">🔒</div>
//             <h2 className="text-2xl font-bold text-gray-800">Quiz Locked!</h2>
//             <p className="text-gray-500 text-sm mt-1">You have already completed this quiz</p>
//             <p className="text-xs text-orange-600 mt-1 font-semibold">⚠️ New quiz will be available only when admin adds new questions</p>
//           </div>
          
//           <div className="bg-white rounded-2xl shadow-lg p-5 mb-5">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white text-xl font-bold">
//                   {user?.name?.charAt(0) || 'U'}
//                 </div>
//                 <div>
//                   <p className="font-semibold text-gray-800">{user?.name}</p>
//                   <p className="text-xs text-gray-500">@{user?.instagramId}</p>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <p className="text-xs text-gray-500">Quiz Completed</p>
//                 <p className="text-xs text-green-600 font-semibold">✓ Locked</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 mb-5 text-white shadow-lg">
//             <p className="text-center text-green-100 mb-2">Your Score</p>
//             <div className="text-center">
//               <span className="text-6xl font-bold">{score}</span>
//               <span className="text-2xl opacity-80">/{questions.length}</span>
//             </div>
//             <div className="mt-3 text-center">
//               <p className="text-2xl font-semibold">{percentage}%</p>
//             </div>
//           </div>
          
//           <div className="grid grid-cols-2 gap-3 mb-5">
//             <div className="bg-white rounded-xl p-4 text-center shadow-sm">
//               <div className="text-2xl mb-1">✅</div>
//               <p className="text-2xl font-bold text-green-600">{score}</p>
//               <p className="text-xs text-gray-500">Correct</p>
//             </div>
//             <div className="bg-white rounded-xl p-4 text-center shadow-sm">
//               <div className="text-2xl mb-1">❌</div>
//               <p className="text-2xl font-bold text-red-600">{wrongCount}</p>
//               <p className="text-xs text-gray-500">Incorrect</p>
//             </div>
//           </div>
          
//           <div className="bg-yellow-50 rounded-xl p-4 mb-6 border border-yellow-200">
//             <p className="text-sm text-yellow-800 text-center font-medium">
//               🔒 This quiz is locked! You cannot take it again.
//             </p>
//             <p className="text-xs text-yellow-600 text-center mt-1">
//               📢 New quiz will be available when admin adds new questions.
//             </p>
//           </div>
          
//           <div className="flex gap-3 mb-3">
//             <button onClick={() => setShowReview(true)} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
//               📖 Review Your Answers
//             </button>
//             <Link href="/" className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition text-center">
//               🏠 Go Home
//             </Link>
//           </div>
//           <Link href="/notes" className="block w-full bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold text-center hover:bg-gray-300 transition">
//             📚 Study Notes
//           </Link>
//         </div>
//         <AdSpace type="banner" className="mx-4 mt-4" />
//       </div>
//     );
//   }

//   // REVIEW PAGE
//   if (showReview) {
//     const filteredQuestions = getFilteredQuestions();
//     const wrongCount = userAnswers.filter(a => a && !a.isCorrect).length;
//     const correctCount = userAnswers.filter(a => a && a.isCorrect).length;
    
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
//         <AdSpace type="banner" className="mx-4 mt-2" />
//         <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 pt-8 pb-6">
//           <div className="text-center">
//             <div className="text-5xl mb-2">📋</div>
//             <h1 className="text-2xl font-bold">Quiz Review</h1>
//             <p className="text-blue-100 text-sm mt-1">Review your answers - Read only mode</p>
//           </div>
//         </div>
        
//         <div className="max-w-md mx-auto px-4 py-4">
//           <div className="flex gap-2 mb-6 bg-white rounded-xl p-2 shadow-sm">
//             <button onClick={() => setReviewFilter('all')} className={`flex-1 py-2 rounded-lg text-sm font-semibold ${reviewFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>All ({userAnswers.filter(a => a !== null).length})</button>
//             <button onClick={() => setReviewFilter('wrong')} className={`flex-1 py-2 rounded-lg text-sm font-semibold ${reviewFilter === 'wrong' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>❌ Wrong ({wrongCount})</button>
//             <button onClick={() => setReviewFilter('correct')} className={`flex-1 py-2 rounded-lg text-sm font-semibold ${reviewFilter === 'correct' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>✅ Correct ({correctCount})</button>
//           </div>
          
//           <div className="space-y-4 mb-24 select-none">
//             {filteredQuestions.map((item, idx) => {
//               const originalIndex = userAnswers.findIndex(a => a === item);
//               return (
//                 <div key={originalIndex} className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-blue-500" onContextMenu={(e) => e.preventDefault()}>
//                   <div className="p-4">
//                     <div className="flex items-center justify-between mb-3">
//                       <span className="text-xs font-bold text-blue-600">Question {originalIndex + 1}</span>
//                       {item.isCorrect ? <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">✅ Correct</span> : <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">❌ Wrong</span>}
//                     </div>
//                     <h3 className="font-semibold text-gray-800 text-sm mb-3">{item.question}</h3>
//                     <div className="space-y-2 mb-3">
//                       {item.options?.map((opt, optIdx) => {
//                         const letter = String.fromCharCode(65 + optIdx);
//                         const isUserAnswer = item.selected === opt;
//                         const isCorrectAnswer = item.correctAnswer === opt;
//                         let bgClass = 'bg-gray-50';
//                         if (isCorrectAnswer) bgClass = 'bg-green-100';
//                         if (isUserAnswer && !isCorrectAnswer) bgClass = 'bg-red-100';
//                         return (
//                           <div key={optIdx} className={`p-2 rounded-lg ${bgClass} text-sm`}>
//                             <span className="font-medium">{letter}.</span> {opt}
//                             {isCorrectAnswer && <span className="text-green-600 text-xs ml-2">✓ Correct</span>}
//                             {isUserAnswer && !isCorrectAnswer && <span className="text-red-600 text-xs ml-2">✗ Your Answer</span>}
//                           </div>
//                         );
//                       })}
//                     </div>
//                     <div className="bg-blue-50 rounded-lg p-2">
//                       <p className="text-xs font-semibold text-blue-800">📖 Explanation:</p>
//                       <p className="text-xs text-blue-700 mt-1">{item.explanation || `Correct answer is ${item.correctAnswer}`}</p>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
        
//         <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4 shadow-lg">
//           <div className="flex gap-3 max-w-md mx-auto">
//             <button onClick={() => setShowReview(false)} className="flex-1 bg-blue-600 text-white py-2 rounded-xl font-semibold">← Back to Results</button>
//             <Link href="/notes" className="flex-1 bg-green-600 text-white py-2 rounded-xl font-semibold text-center">📚 Study More</Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full"></div>
//       </div>
//     );
//   }

//   if (questions.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-4">
//         <div className="text-center">
//           <div className="text-6xl mb-4">📝</div>
//           <h2 className="text-xl font-bold">No Questions Available</h2>
//           <p className="text-gray-500 text-sm mt-2">Please add questions from admin panel.</p>
//           <Link href="/" className="text-green-600 mt-4 inline-block">Back to Home</Link>
//         </div>
//       </div>
//     );
//   }

//   const currentQ = questions[currentQuestion];
//   const totalQuestions = questions.length;
//   const progress = ((currentQuestion + 1) / totalQuestions) * 100;
//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
//       <AdSpace type="banner" className="mx-4 mt-2" />
      
//       <div className="mx-4 mt-2">
//         <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2 text-center border border-green-100">
//           <p className="text-xs text-green-600 font-medium">📖 Kannada Exam Pro</p>
//           <p className="text-xs text-green-500">Master Karnataka Exams</p>
//         </div>
//       </div>

//       <div className="max-w-md mx-auto px-4 py-4">
//         <div className="mb-4 p-2 bg-yellow-50 text-yellow-600 text-xs text-center rounded-lg">
//           🔒 One attempt per question set • New quiz only when admin adds questions
//         </div>
        
//         <div className="mb-6">
//           <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 text-center">
//             <p className="text-xs text-gray-400 mb-1">Time Remaining</p>
//             <div className={`text-3xl font-bold ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-green-600'}`}>
//               {formatTime(timeLeft)}
//             </div>
//           </div>
//         </div>

//         <div className="mb-6">
//           <div className="flex justify-between text-xs text-gray-500 mb-2">
//             <span className="font-medium">Question {currentQuestion + 1} of {totalQuestions}</span>
//             <span className="font-bold text-green-600">{Math.round(progress)}%</span>
//           </div>
//           <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
//             <div className="h-2 rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-green-400 to-green-600" style={{ width: `${progress}%` }}></div>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
//           <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
//             <h2 className="text-lg font-semibold text-gray-800 leading-relaxed">{currentQ?.question}</h2>
//           </div>
//           <div className="p-4 space-y-3">
//             {currentQ?.options?.map((opt, idx) => {
//               const letter = String.fromCharCode(65 + idx);
//               const isSelected = selectedAnswer === opt;
//               const isCorrect = opt === currentQ?.answer;
//               const showCorrect = showExplanation && isCorrect;
//               const showWrong = showExplanation && isSelected && !isCorrect;
//               let bgColor = 'bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50';
//               let textColor = 'text-gray-700';
//               if (showCorrect) { bgColor = 'bg-green-50 border-green-400'; textColor = 'text-green-700'; }
//               else if (showWrong) { bgColor = 'bg-red-50 border-red-400'; textColor = 'text-red-700'; }
//               else if (isSelected && !showExplanation) { bgColor = 'bg-green-50 border-green-400'; textColor = 'text-green-700'; }
//               return (
//                 <button key={idx} onClick={() => !showExplanation && handleAnswerSelect(opt)} disabled={showExplanation || quizLocked} className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${bgColor}`}>
//                   <div className="flex items-center gap-3">
//                     <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${showCorrect ? 'bg-green-600 text-white' : showWrong ? 'bg-red-600 text-white' : isSelected ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{letter}</div>
//                     <span className={`flex-1 text-sm ${textColor} font-medium`}>{opt}</span>
//                     {showCorrect && <span className="text-green-600 text-xs font-medium flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Correct</span>}
//                     {showWrong && <span className="text-red-600 text-xs font-medium flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>Wrong</span>}
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {showExplanation && (
//           <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100 animate-fadeIn">
//             <div className="flex items-start gap-2">
//               <span className="text-blue-500 text-lg">💡</span>
//               <div className="flex-1">
//                 <p className="text-xs font-semibold text-blue-800 mb-1">Explanation:</p>
//                 <p className="text-sm text-blue-700 leading-relaxed">{currentQ?.explanation || `The correct answer is ${currentQ?.answer}.`}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="flex gap-3">
//           {currentQuestion > 0 && <button onClick={handlePreviousQuestion} className="flex-1 bg-white text-gray-700 py-3 rounded-xl text-sm font-semibold border border-gray-300 hover:bg-gray-50">← Previous</button>}
//           <button onClick={handleSubmitAnswer} className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${showExplanation ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md' : selectedAnswer ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`} disabled={(!showExplanation && !selectedAnswer) || quizLocked}>
//             {showExplanation ? (currentQuestion + 1 === totalQuestions ? '🏆 Finish Quiz' : 'Next →') : '✓ Submit Answer'}
//           </button>
//         </div>

//         <div className="mt-6 pt-4 border-t border-gray-100 text-center">
//           <p className="text-xs text-gray-400">🔒 One attempt per question set • New quiz when admin adds questions</p>
//         </div>
//       </div>

//       <AdSpace type="banner" className="mx-4 mt-2" />

//       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 shadow-lg">
//         <div className="flex justify-around max-w-md mx-auto">
//           <Link href="/" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition"><span className="text-xl">🏠</span><span className="text-xs">Home</span></Link>
//           <Link href="/quiz" className="flex flex-col items-center text-green-600"><span className="text-xl">🎯</span><span className="text-xs">Quiz</span></Link>
//           <Link href="/notes" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition"><span className="text-xl">📝</span><span className="text-xs">Notes</span></Link>
//           <Link href="/current-affairs" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition"><span className="text-xl">📰</span><span className="text-xs">Current</span></Link>
//           <Link href="/leaderboard" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition"><span className="text-xl">🏆</span><span className="text-xs">Rank</span></Link>
//           <Link href="/profile" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition"><span className="text-xl">👤</span><span className="text-xs">Profile</span></Link>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
//         .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
//         .select-none { user-select: none; -webkit-user-select: none; }
//       `}</style>
//     </div>
//   );
// }



'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdSpace from '@/components/AdSpace';

export default function QuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [user, setUser] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120);
  const [timerActive, setTimerActive] = useState(true);
  const [startTime, setStartTime] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [reviewFilter, setReviewFilter] = useState('all');
  const [quizLocked, setQuizLocked] = useState(false);
  const [currentQuizVersion, setCurrentQuizVersion] = useState('');
  const [isLockedPage, setIsLockedPage] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const userData = JSON.parse(storedUser);
    if (!userData.instagramId) {
      router.push('/setup-instagram');
      return;
    }
    setUser(userData);
    setStartTime(Date.now());
    checkQuizLockStatus(userData);
  }, [router]);

  const checkQuizLockStatus = async (userData) => {
    try {
      setLoading(true);
      
      // Use user-specific keys
      const savedResults = localStorage.getItem(`quizResults_${userData?.instagramId}`);
      const savedVersion = localStorage.getItem(`quizVersion_${userData?.instagramId}`);
      
      if (savedResults && savedVersion) {
        // User has already taken a quiz - show locked page immediately
        const parsed = JSON.parse(savedResults);
        setUserAnswers(parsed.userAnswers || []);
        setScore(parsed.score || 0);
        setQuestions(parsed.questions || []);
        setShowResults(true);
        setQuizLocked(true);
        setIsLockedPage(true);
        setLoading(false);
        return;
      }
      
      // No saved results - fetch questions for new quiz
      const res = await fetch('/api/questions');
      const data = await res.json();
      
      if (data && data.length > 0) {
        setQuestions(data);
        setAnswers(new Array(data.length).fill(null));
        setUserAnswers(new Array(data.length).fill(null));
        setQuizLocked(false);
        setIsLockedPage(false);
        setShowResults(false);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer;
    if (timerActive && !showResults && !showReview && timeLeft > 0 && !quizLocked && !isLockedPage) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && !showResults && !showReview && !showExplanation && !quizLocked && !isLockedPage) {
      handleSubmitAnswer();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, timerActive, showResults, showReview, showExplanation, quizLocked, isLockedPage]);

  const handleAnswerSelect = (answer) => {
    if (quizLocked || isLockedPage) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (quizLocked || isLockedPage) return;
    if (!selectedAnswer && !showExplanation) return;

    if (!showExplanation && selectedAnswer) {
      const isCorrect = selectedAnswer === questions[currentQuestion]?.answer;
      if (isCorrect) {
        setScore(prev => prev + 1);
      }
      
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedAnswer;
      setAnswers(newAnswers);
      
      const newUserAnswers = [...userAnswers];
      newUserAnswers[currentQuestion] = {
        selected: selectedAnswer,
        isCorrect: isCorrect,
        correctAnswer: questions[currentQuestion]?.answer,
        question: questions[currentQuestion]?.question,
        options: questions[currentQuestion]?.options,
        explanation: questions[currentQuestion]?.explanation
      };
      setUserAnswers(newUserAnswers);
      
      setShowExplanation(true);
    } else {
      setShowExplanation(false);
      setSelectedAnswer(null);
      
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setTimeLeft(120);
      } else {
        calculateScore();
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0 && !quizLocked && !isLockedPage) {
      setShowExplanation(false);
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1] || null);
      setTimeLeft(120);
    }
  };

  const calculateScore = () => {
    let finalScore = 0;
    answers.forEach((answer, idx) => {
      if (answer && questions[idx] && answer === questions[idx].answer) {
        finalScore++;
      }
    });
    
    setScore(finalScore);
    setShowResults(true);
    setTimerActive(false);
    setQuizLocked(true);
    
    // LOCK THE QUIZ - Save results with user-specific keys
    if (user) {
      // Create version hash from questions
      const versionString = questions.map(q => `${q._id || q.id}-${q.answer}`).join(',');
      const versionHash = btoa(unescape(encodeURIComponent(versionString))).substring(0, 50);
      
      const finalUserAnswers = [...userAnswers];
      for (let i = 0; i < answers.length; i++) {
        if (answers[i] && !finalUserAnswers[i]) {
          finalUserAnswers[i] = {
            selected: answers[i],
            isCorrect: answers[i] === questions[i]?.answer,
            correctAnswer: questions[i]?.answer,
            question: questions[i]?.question,
            options: questions[i]?.options,
            explanation: questions[i]?.explanation
          };
        }
      }
      
      // Save with user-specific keys
      localStorage.setItem(`quizVersion_${user.instagramId}`, versionHash);
      localStorage.setItem(`quizResults_${user.instagramId}`, JSON.stringify({
        userAnswers: finalUserAnswers,
        score: finalScore,
        questions: questions,
        completedAt: Date.now()
      }));
    }
    
    saveQuizResult(finalScore);
  };

  const saveQuizResult = async (finalScore) => {
    if (!user) return;
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;

    try {
      // 1. Save quiz result to quizresults collection
      await fetch('/api/quiz-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instagramId: user.instagramId,
          userName: user.name,
          userEmail: user.email,
          score: finalScore,
          totalQuestions: questions.length,
          percentage: Math.round((finalScore / questions.length) * 100),
          timeFormatted: `${minutes}m ${seconds}s`,
          correctCount: finalScore,
          wrongCount: questions.length - finalScore,
          userAnswers: userAnswers,
          completedAt: new Date()
        })
      });
      
      // Calculate new totals
      const newTotalScore = (user.score || 0) + finalScore;
      const newQuizzesTaken = (user.totalQuizzesTaken || 0) + 1;
      
      // 2. UPDATE USER IN DATABASE - This is the missing piece!
      const updateResponse = await fetch('/api/users/update-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instagramId: user.instagramId,
          name: user.name,
          email: user.email,
          newScore: finalScore,
          totalScore: newTotalScore,
          quizzesTaken: newQuizzesTaken,
          percentage: Math.round((finalScore / questions.length) * 100)
        })
      });
      
      if (!updateResponse.ok) {
        console.error('Failed to update user in database');
      }
      
      // 3. Force sync leaderboard
      await fetch('/api/leaderboard/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      // 4. Update local storage
      const updatedUser = { 
        ...user, 
        score: newTotalScore, 
        totalQuizzesTaken: newQuizzesTaken,
        lastQuizDate: new Date()
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      console.log('✅ Quiz saved, user updated, leaderboard synced!');
      
    } catch (error) {
      console.error('Error saving result:', error);
    }
  };

  const getFilteredQuestions = () => {
    if (reviewFilter === 'wrong') {
      return userAnswers.filter((ans) => ans && !ans.isCorrect);
    } else if (reviewFilter === 'correct') {
      return userAnswers.filter((ans) => ans && ans.isCorrect);
    }
    return userAnswers.filter((ans) => ans !== null);
  };

  // LOCKED RESULTS PAGE - User already took quiz (SHOW ONLY THIS)
  if ((quizLocked || isLockedPage) && showResults && !showReview && !loading) {
    const percentage = Math.round((score / (questions.length || 1)) * 100);
    const wrongCount = (questions.length || 0) - score;
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 pb-24">
        <AdSpace type="banner" className="mx-4 mt-2" />
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <div className="text-7xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-800">Quiz Locked!</h2>
            <p className="text-gray-500 text-sm mt-1">You have already completed this quiz</p>
            <p className="text-xs text-orange-600 mt-1 font-semibold">⚠️ New quiz will be available only when admin adds new questions</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-5 mb-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white text-xl font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500">@{user?.instagramId}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Quiz Completed</p>
                <p className="text-xs text-green-600 font-semibold">✓ Locked</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 mb-5 text-white shadow-lg">
            <p className="text-center text-green-100 mb-2">Your Score</p>
            <div className="text-center">
              <span className="text-6xl font-bold">{score}</span>
              <span className="text-2xl opacity-80">/{questions.length}</span>
            </div>
            <div className="mt-3 text-center">
              <p className="text-2xl font-semibold">{percentage}%</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl mb-1">✅</div>
              <p className="text-2xl font-bold text-green-600">{score}</p>
              <p className="text-xs text-gray-500">Correct</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl mb-1">❌</div>
              <p className="text-2xl font-bold text-red-600">{wrongCount}</p>
              <p className="text-xs text-gray-500">Incorrect</p>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-xl p-4 mb-6 border border-yellow-200">
            <p className="text-sm text-yellow-800 text-center font-medium">
              🔒 This quiz is locked! You cannot take it again.
            </p>
            <p className="text-xs text-yellow-600 text-center mt-1">
              📢 New quiz will be available when admin adds new questions.
            </p>
          </div>
          
          <div className="flex gap-3 mb-3">
            <button onClick={() => setShowReview(true)} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
              📖 Review Your Answers
            </button>
            <Link href="/" className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition text-center">
              🏠 Go Home
            </Link>
          </div>
          <Link href="/notes" className="block w-full bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold text-center hover:bg-gray-300 transition">
            📚 Study Notes
          </Link>
        </div>
        <AdSpace type="banner" className="mx-4 mt-4" />
      </div>
    );
  }

  // REVIEW PAGE
  if (showReview) {
    const filteredQuestions = getFilteredQuestions();
    const wrongCount = userAnswers.filter(a => a && !a.isCorrect).length;
    const correctCount = userAnswers.filter(a => a && a.isCorrect).length;
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
        <AdSpace type="banner" className="mx-4 mt-2" />
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 pt-8 pb-6">
          <div className="text-center">
            <div className="text-5xl mb-2">📋</div>
            <h1 className="text-2xl font-bold">Quiz Review</h1>
            <p className="text-blue-100 text-sm mt-1">Review your answers - Read only mode</p>
          </div>
        </div>
        
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex gap-2 mb-6 bg-white rounded-xl p-2 shadow-sm">
            <button onClick={() => setReviewFilter('all')} className={`flex-1 py-2 rounded-lg text-sm font-semibold ${reviewFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>All ({userAnswers.filter(a => a !== null).length})</button>
            <button onClick={() => setReviewFilter('wrong')} className={`flex-1 py-2 rounded-lg text-sm font-semibold ${reviewFilter === 'wrong' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>❌ Wrong ({wrongCount})</button>
            <button onClick={() => setReviewFilter('correct')} className={`flex-1 py-2 rounded-lg text-sm font-semibold ${reviewFilter === 'correct' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>✅ Correct ({correctCount})</button>
          </div>
          
          <div className="space-y-4 mb-24 select-none">
            {filteredQuestions.map((item, idx) => {
              const originalIndex = userAnswers.findIndex(a => a === item);
              return (
                <div key={originalIndex} className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-blue-500" onContextMenu={(e) => e.preventDefault()}>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-blue-600">Question {originalIndex + 1}</span>
                      {item.isCorrect ? <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">✅ Correct</span> : <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">❌ Wrong</span>}
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm mb-3">{item.question}</h3>
                    <div className="space-y-2 mb-3">
                      {item.options?.map((opt, optIdx) => {
                        const letter = String.fromCharCode(65 + optIdx);
                        const isUserAnswer = item.selected === opt;
                        const isCorrectAnswer = item.correctAnswer === opt;
                        let bgClass = 'bg-gray-50';
                        if (isCorrectAnswer) bgClass = 'bg-green-100';
                        if (isUserAnswer && !isCorrectAnswer) bgClass = 'bg-red-100';
                        return (
                          <div key={optIdx} className={`p-2 rounded-lg ${bgClass} text-sm`}>
                            <span className="font-medium">{letter}.</span> {opt}
                            {isCorrectAnswer && <span className="text-green-600 text-xs ml-2">✓ Correct</span>}
                            {isUserAnswer && !isCorrectAnswer && <span className="text-red-600 text-xs ml-2">✗ Your Answer</span>}
                          </div>
                        );
                      })}
                    </div>
                    <div className="bg-blue-50 rounded-lg p-2">
                      <p className="text-xs font-semibold text-blue-800">📖 Explanation:</p>
                      <p className="text-xs text-blue-700 mt-1">{item.explanation || `Correct answer is ${item.correctAnswer}`}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4 shadow-lg">
          <div className="flex gap-3 max-w-md mx-auto">
            <button onClick={() => setShowReview(false)} className="flex-1 bg-blue-600 text-white py-2 rounded-xl font-semibold">← Back to Results</button>
            <Link href="/notes" className="flex-1 bg-green-600 text-white py-2 rounded-xl font-semibold text-center">📚 Study More</Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-xl font-bold">No Questions Available</h2>
          <p className="text-gray-500 text-sm mt-2">Please add questions from admin panel.</p>
          <Link href="/" className="text-green-600 mt-4 inline-block">Back to Home</Link>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      <AdSpace type="banner" className="mx-4 mt-2" />
      
      <div className="mx-4 mt-2">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2 text-center border border-green-100">
          <p className="text-xs text-green-600 font-medium">📖 Kannada Exam Pro</p>
          <p className="text-xs text-green-500">Master Karnataka Exams</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4">
        <div className="mb-4 p-2 bg-yellow-50 text-yellow-600 text-xs text-center rounded-lg">
          🔒 One attempt per question set • New quiz only when admin adds questions
        </div>
        
        <div className="mb-6">
          <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 text-center">
            <p className="text-xs text-gray-400 mb-1">Time Remaining</p>
            <div className={`text-3xl font-bold ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-green-600'}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span className="font-medium">Question {currentQuestion + 1} of {totalQuestions}</span>
            <span className="font-bold text-green-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div className="h-2 rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-green-400 to-green-600" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
          <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
            <h2 className="text-lg font-semibold text-gray-800 leading-relaxed">{currentQ?.question}</h2>
          </div>
          <div className="p-4 space-y-3">
            {currentQ?.options?.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isSelected = selectedAnswer === opt;
              const isCorrect = opt === currentQ?.answer;
              const showCorrect = showExplanation && isCorrect;
              const showWrong = showExplanation && isSelected && !isCorrect;
              let bgColor = 'bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50';
              let textColor = 'text-gray-700';
              if (showCorrect) { bgColor = 'bg-green-50 border-green-400'; textColor = 'text-green-700'; }
              else if (showWrong) { bgColor = 'bg-red-50 border-red-400'; textColor = 'text-red-700'; }
              else if (isSelected && !showExplanation) { bgColor = 'bg-green-50 border-green-400'; textColor = 'text-green-700'; }
              return (
                <button key={idx} onClick={() => !showExplanation && handleAnswerSelect(opt)} disabled={showExplanation || quizLocked} className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${bgColor}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${showCorrect ? 'bg-green-600 text-white' : showWrong ? 'bg-red-600 text-white' : isSelected ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{letter}</div>
                    <span className={`flex-1 text-sm ${textColor} font-medium`}>{opt}</span>
                    {showCorrect && <span className="text-green-600 text-xs font-medium flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Correct</span>}
                    {showWrong && <span className="text-red-600 text-xs font-medium flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>Wrong</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {showExplanation && (
          <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100 animate-fadeIn">
            <div className="flex items-start gap-2">
              <span className="text-blue-500 text-lg">💡</span>
              <div className="flex-1">
                <p className="text-xs font-semibold text-blue-800 mb-1">Explanation:</p>
                <p className="text-sm text-blue-700 leading-relaxed">{currentQ?.explanation || `The correct answer is ${currentQ?.answer}.`}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          {currentQuestion > 0 && <button onClick={handlePreviousQuestion} className="flex-1 bg-white text-gray-700 py-3 rounded-xl text-sm font-semibold border border-gray-300 hover:bg-gray-50">← Previous</button>}
          <button onClick={handleSubmitAnswer} className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${showExplanation ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md' : selectedAnswer ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`} disabled={(!showExplanation && !selectedAnswer) || quizLocked}>
            {showExplanation ? (currentQuestion + 1 === totalQuestions ? '🏆 Finish Quiz' : 'Next →') : '✓ Submit Answer'}
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">🔒 One attempt per question set • New quiz when admin adds questions</p>
        </div>
      </div>

      <AdSpace type="banner" className="mx-4 mt-2" />

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 shadow-lg">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/"className="flex flex-col items-center text-gray-500 hover:text-green-600 transition"><span className="text-xl">🏠</span><span className="text-xs">Home</span></Link>
          <Link href="/quiz" className="flex flex-col items-center text-green-600"><span className="text-xl">🎯</span><span className="text-xs">Quiz</span></Link>
          <Link href="/notes" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition"><span className="text-xl">📝</span><span className="text-xs">Notes</span></Link>
          <Link href="/current-affairs" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition"><span className="text-xl">📰</span><span className="text-xs">Current</span></Link>
          <Link href="/leaderboard" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition"><span className="text-xl">🏆</span><span className="text-xs">Rank</span></Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition"><span className="text-xl">👤</span><span className="text-xs">Profile</span></Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .select-none { user-select: none; -webkit-user-select: none; }
      `}</style>
    </div>
  );
}



'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdSpace from '@/components/AdSpace';
import Image from 'next/image';

export default function Home() {
  
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [topUsers, setTopUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);

  const slidingLogos = [
    { image: '/logos/police.png', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-100' },
    { image: '/logos/defence.jpg', color: 'from-green-500 to-green-600', bgColor: 'bg-green-100' },
    { image: '/logos/SBI.jpeg', color: 'from-yellow-500 to-yellow-600', bgColor: 'bg-yellow-100' },
    { image: '/logos/ssc.jpeg', color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-100' },
    { image: '/logos/bsf.jpeg', color: 'from-pink-500 to-pink-600', bgColor: 'bg-pink-100' },
    { image: '/logos/all jobs.jpeg', color: 'from-gray-500 to-gray-600', bgColor: 'bg-gray-100' },
    { image: '/logos/railways.jpeg', color: 'from-red-500 to-red-600', bgColor: 'bg-red-100' },
  ];

  useEffect(() => {
    fetchData();
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    
    const interval = setInterval(() => {
      setCurrentLogoIndex((prev) => (prev + 1) % slidingLogos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [questionsRes, usersRes] = await Promise.all([
        fetch('/api/questions'),
        fetch('/api/leaderboard'),
      ]);
      const questions = await questionsRes.json();
      const users = await usersRes.json();
      setTotalQuestions(questions.length);
      setTopUsers(users.slice(0, 5)); // Get top 5 for better display
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const currentLogo = slidingLogos[currentLogoIndex];

  const categories = [
    { title: 'Quiz', icon: '❓', color: 'from-blue-500 to-blue-600', href: '/quiz', desc: '20 MCQ / Win Prizes' },
    { title: 'Notes', icon: '📝', color: 'from-green-500 to-green-600', href: '/notes', desc: '50 imp Questions & Answers' },
    { title: 'Current Affairs', icon: '📰', color: 'from-orange-500 to-orange-600', href: '/current-affairs', desc: 'Check It Now' },
    { title: 'Leaderboard', icon: '🏆', color: 'from-yellow-500 to-yellow-600', href: '/leaderboard', desc: 'Top Winners' },
  ];

  // Calculate max score for bar chart
  const maxScore = topUsers.length > 0 ? Math.max(...topUsers.map(u => u.score || 0)) : 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      <AdSpace type="banner" className="mx-4 mt-2" />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 pt-8 pb-10 text-center">
        <div className="mb-4">
          <h1 className="text-3xl font-bold">Kannada Exam Pro</h1>
          <p className="text-blue-100 text-sm mt-1">KAS | PSI | PDO | FDA | SDA</p>
        </div>
        
        {/* Sliding Logos */}
        <div className="flex justify-center">
          <div className="bg-white/20 backdrop-blur-lg rounded-full px-6 py-3 animate-slide-left inline-block shadow-xl">
            <div className="flex items-center justify-center gap-3">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${currentLogo.color} flex items-center justify-center p-1 shadow-lg ring-4 ring-white/50`}>
                <Image 
                  src={currentLogo.image} 
                  alt={currentLogo.name}
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `<div class="w-full h-full rounded-full flex items-center justify-center"><span class="text-white text-xl font-bold">📚</span></div>`;
                  }}
                />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm">{currentLogo.name}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Logo Indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {slidingLogos.map((_, idx) => (
            <div 
              key={idx}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentLogoIndex ? 'bg-white w-4' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* User Welcome Card */}
      {user && (
        <div className="px-5 -mt-4">
          <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={user.profileImage || user.picture || `https://ui-avatars.com/api/?name=${user.name}&background=3B82F6&color=fff&size=80`} 
                className="w-12 h-12 rounded-full border-2 border-blue-500 object-cover" 
                alt={user.name}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${user.name}&background=3B82F6&color=fff&size=80`;
                }}
              />
              <div>
                <p className="font-semibold text-gray-800 text-sm">Welcome back, {user.name?.split(' ')[0]}! 👋</p>
                <p className="text-xs text-gray-500">@{user.instagramId}</p>
                <p className="text-xs text-green-600 font-medium">⭐ Total Score: {user.score || 0} points</p>
              </div>
            </div>
            <Link href="/quiz">
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition">
                Take Quiz 🎯
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Category Cards */}
      <div className="px-5 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((cat, idx) => (
            <Link key={idx} href={cat.href}>
              <div className="bg-white rounded-2xl shadow-md p-4 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                <div className={`w-14 h-14 mx-auto rounded-full bg-gradient-to-r ${cat.color} flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <h3 className="font-bold text-gray-800 text-sm mt-2">{cat.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <AdSpace type="inArticle" className="mx-4 my-6" />

      {/* Top Performers - HORIZONTAL BAR CHART (Instagram Winner's Style) */}
      {topUsers.length > 0 && (
        <div className="px-5 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              🏆 Karnataka Winner'
              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">Top 5</span>
            </h2>
            <Link href="/leaderboard" className="text-xs text-blue-600 hover:underline">View All →</Link>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl shadow-lg p-5">
            <div className="space-y-4">
              {topUsers.map((user, idx) => {
                const rank = idx + 1;
                const scorePercentage = maxScore > 0 ? (user.score / maxScore) * 100 : 0;
                
                // Rank icons
                const rankIcon = {
                  1: '👑',
                  2: '🥈',
                  3: '🥉',
                };
                
                const rankColor = {
                  1: 'text-yellow-600',
                  2: 'text-gray-600',
                  3: 'text-orange-600',
                };
                
                const barColor = {
                  1: 'bg-gradient-to-r from-yellow-400 to-yellow-500',
                  2: 'bg-gradient-to-r from-gray-400 to-gray-500',
                  3: 'bg-gradient-to-r from-orange-400 to-orange-500',
                };
                
                return (
                  <div key={user._id} className="group">
                    {/* User Row */}
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-bold ${rank <= 3 ? rankColor[rank] : 'text-purple-600'}`}>
                          {rank <= 3 ? rankIcon[rank] : `${rank}th`}
                        </span>
                        <p className="font-semibold text-gray-800 text-sm">
                          {user.name?.split(' ')[0] || 'User'}
                        </p>
                        <span className="text-xs text-gray-400">@{user.instagramId || 'user'}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-purple-600">{user.score || 0}</p>
                      </div>
                    </div>
                    
                    {/* Horizontal Bar Chart */}
                    <div className="relative w-full bg-gray-200 rounded-full h-7 overflow-hidden">
                      <div 
                        className={`h-full rounded-full flex items-center justify-end pr-3 transition-all duration-1000 ease-out ${
                          rank === 1 ? barColor[1] :
                          rank === 2 ? barColor[2] :
                          rank === 3 ? barColor[3] :
                          'bg-gradient-to-r from-purple-400 to-purple-500'
                        }`}
                        style={{ width: `${scorePercentage}%` }}
                      >
                        <span className="text-xs font-bold text-white drop-shadow-md">
                          {Math.round(scorePercentage)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Footer Message */}
            <div className="mt-4 pt-3 border-t border-purple-200 text-center">
              <p className="text-xs text-gray-500">🏆 Keep practicing to reach the top!</p>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp & Instagram */}
      <div className="px-5 mt-8 mb-4 text-center">
        <p className="text-sm text-gray-500">For Daily Quiz and Updates</p>
        <p className="text-xs text-gray-400 mb-3">Join More Channels</p>
        
        <div className="flex justify-center gap-5">
          {/* WhatsApp */}
          <a
            href="https://whatsapp.com/channel/0029VbCnlxq3wtbEGjkxIM2M"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center group"
          >
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow group-hover:scale-110 transition-transform duration-300">
              <img 
                src="/icons/whatsapp.png" 
                alt="WhatsApp" 
                className="w-7 h-7 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<span class="text-2xl text-white">💬</span>';
                }}
              />
            </div>
            <span className="text-xs text-gray-600 mt-1 group-hover:text-green-600 transition">WhatsApp</span>
          </a>
          
          {/* Instagram */}
          <a
            href="https://www.instagram.com/kannada_exam_pro"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center group"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow group-hover:scale-110 transition-transform duration-300">
              <img 
                src="/icons/instagram.png" 
                alt="Instagram"
                className="w-7 h-7 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<span class="text-2xl text-white">📸</span>';
                }}
              />
            </div>
            <span className="text-xs text-gray-600 mt-1 group-hover:text-pink-600 transition">Instagram</span>
          </a>
        </div>
      </div>

      {/* Login Link */}
      {!user && (
        <div className="text-center mt-4">
          <Link href="/login" className="text-xs text-gray-400 hover:text-blue-500 transition">
            🔐 Admin / Login
          </Link>
        </div>
      )}

      <AdSpace type="banner" className="mx-4 mt-4 mb-4" />

      <style jsx>{`
        @keyframes slideLeft {
          0% { transform: translateX(30%); opacity: 0; }
          12% { transform: translateX(0); opacity: 1; }
          88% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(-30%); opacity: 0; }
        }
        .animate-slide-left { 
          animation: slideLeft 5s ease-in-out infinite;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}


----lib----




import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so the value is preserved across module reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
let memoryStore = {
  questions: [],
  users: [],
  results: [],
  notes: [],
  currentAffairs: [],
  qaQuestions: []
};

export const getQuestions = () => memoryStore.questions;
export const saveQuestions = (data) => { memoryStore.questions = data; };
export const getUsers = () => memoryStore.users;
export const saveUsers = (data) => { memoryStore.users = data; };
export const getResults = () => memoryStore.results;
export const saveResults = (data) => { memoryStore.results = data; };
export const getNotes = () => memoryStore.notes;
export const saveNotes = (data) => { memoryStore.notes = data; };
export const getCurrentAffairs = () => memoryStore.currentAffairs;
export const saveCurrentAffairs = (data) => { memoryStore.currentAffairs = data; };
export const getQAQuestions = () => memoryStore.qaQuestions;
export const saveQAQuestions = (data) => { memoryStore.qaQuestions = data; };



modules------------------



import mongoose from 'mongoose';

const CurrentAffairSchema = new mongoose.Schema({
  title: { type: String, required: true },
  title_en: { type: String },
  content: { type: String, required: true },
  content_en: { type: String },
  summary: { type: String },
  category: { type: String, default: 'General' },
  tags: [{ type: String }],
  important: { type: Boolean, default: false },
  image: { type: String },
  source: { type: String },
  date: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.CurrentAffair || mongoose.model('CurrentAffair', CurrentAffairSchema);







import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  title_en: { type: String },
  content: { type: String, required: true },
  content_en: { type: String },
  category: { type: String, default: 'General' },
  important: { type: Boolean, default: false },
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);





import mongoose from 'mongoose';

const QAQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  question_en: { type: String },
  answer: { type: String, required: true },
  answer_en: { type: String },
  explanation: { type: String },
  category: { type: String, default: 'General' },
  important: { type: Boolean, default: false },
  examType: { type: String, default: 'KPSC' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.QAQuestion || mongoose.model('QAQuestion', QAQuestionSchema);






import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  question_en: { type: String },
  options: { type: [String], required: true },
  answer: { type: String, required: true },
  category: { type: String, default: 'General' },
  subcategory: { type: String },
  difficulty: { type: String, default: 'medium', enum: ['easy', 'medium', 'hard'] },
  explanation: { type: String },
  explanation_en: { type: String },
  points: { type: Number, default: 1 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Question || mongoose.model('Question', QuestionSchema);
import mongoose from 'mongoose';

const QuizResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  instagramId: { type: String, required: true },
  userName: { type: String },
  userEmail: { type: String },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  percentage: { type: Number, required: true },
  timeTaken: { type: Number },
  timeFormatted: { type: String },
  answers: { type: Array },
  correctAnswers: { type: Number },
  wrongAnswers: { type: Number },
  category: { type: String, default: 'General' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.QuizResult || mongoose.model('QuizResult', QuizResultSchema);




import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  googleId: { type: String, unique: true, sparse: true },
  instagramId: { type: String, required: true, unique: true },
  profileImage: { type: String },
  role: { type: String, default: 'user', enum: ['user', 'admin', 'moderator'] },
  score: { type: Number, default: 0 },
  totalQuizzesTaken: { type: Number, default: 0 },
  totalCorrectAnswers: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastQuizDate: { type: Date },
  badges: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
