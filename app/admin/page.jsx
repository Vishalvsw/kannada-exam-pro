'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPanel() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [admin, setAdmin] = useState(null);
  
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
  const [formData, setFormData] = useState({
    question: '',
    questionType: 'mcq',
    options: ['', '', '', ''],
    answer: '',
    correctOrder: '',
    explanation: '',
    category: 'General',
    difficulty: 'medium'
  });
  const [message, setMessage] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
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
  }, [router]);

  // Fetch data with cache busting
  const fetchData = useCallback(async () => {
    const timestamp = Date.now();
    try {
      if (activeTab === 'dashboard') {
        const [qRes, qaRes, nRes, caRes, uRes, rRes] = await Promise.all([
          fetch(`/api/questions?t=${timestamp}`).catch(() => ({ json: () => [] })),
          fetch(`/api/admin/qa-questions?t=${timestamp}`).catch(() => ({ json: () => [] })),
          fetch(`/api/admin/notes?t=${timestamp}`).catch(() => ({ json: () => [] })),
          fetch(`/api/admin/current-affairs?t=${timestamp}`).catch(() => ({ json: () => [] })),
          fetch(`/api/admin/users?t=${timestamp}`).catch(() => ({ json: () => [] })),
          fetch(`/api/quiz-results?t=${timestamp}`).catch(() => ({ json: () => [] }))
        ]);
        setQuestions(await qRes.json());
        setQaQuestions(await qaRes.json());
        setNotes(await nRes.json());
        setCurrentAffairs(await caRes.json());
        setUsers(await uRes.json());
        setQuizResults(await rRes.json());
      } else if (activeTab === 'questions') {
        const res = await fetch(`/api/questions?t=${timestamp}`);
        setQuestions(await res.json());
      } else if (activeTab === 'qa-questions') {
        const res = await fetch(`/api/admin/qa-questions?t=${timestamp}`);
        setQaQuestions(await res.json());
      } else if (activeTab === 'notes') {
        const res = await fetch(`/api/admin/notes?t=${timestamp}`);
        setNotes(await res.json());
      } else if (activeTab === 'current-affairs') {
        const res = await fetch(`/api/admin/current-affairs?t=${timestamp}`);
        setCurrentAffairs(await res.json());
      } else if (activeTab === 'users') {
        const res = await fetch(`/api/admin/users?t=${timestamp}`);
        setUsers(await res.json());
      } else if (activeTab === 'results') {
        const res = await fetch(`/api/quiz-results?t=${timestamp}`);
        setQuizResults(await res.json());
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [activeTab, refreshKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refreshData = () => {
    setRefreshKey(prev => prev + 1);
    showToast('🔄 Refreshing data...', 'info');
  };

  const showToast = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
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
        setFormData({
          question: '',
          questionType: 'mcq',
          options: ['', '', '', ''],
          answer: '',
          correctOrder: '',
          explanation: '',
          category: 'General',
          difficulty: 'medium'
        });
        await fetchData();
        showToast(editingItem ? '✅ Updated successfully!' : '✅ Added successfully!');
      } else {
        showToast('❌ Error saving', 'error');
      }
    } catch (error) {
      showToast('❌ Error saving', 'error');
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
          await fetchData();
          showToast('🗑️ Deleted successfully!');
        } else {
          showToast('❌ Error deleting', 'error');
        }
      } catch (error) {
        showToast('❌ Error deleting', 'error');
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
        showToast('📖 Explanation updated successfully!');
        setShowExplanationModal(false);
        await fetchData();
      } else {
        showToast('❌ Error updating explanation', 'error');
      }
    } catch (error) {
      showToast('❌ Error updating explanation', 'error');
    }
  };

  const getFormFields = () => {
    if (activeTab === 'questions') {
      return (
        <>
          {/* Question Type Selector */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <label className="block text-sm font-medium mb-2">Question Type *</label>
            <div className="grid grid-cols-2 gap-3">
              <div 
                className={`p-3 rounded-lg border-2 cursor-pointer transition text-center ${
                  formData.questionType !== 'ordering' 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setFormData({ 
                  ...formData, 
                  questionType: 'mcq', 
                  options: ['', '', '', ''],
                  answer: '',
                  correctOrder: '' 
                })}
              >
                <div className="text-xl">📝</div>
                <div className="font-semibold text-sm">MCQ</div>
                <div className="text-xs text-gray-500">4 Options</div>
                {formData.questionType !== 'ordering' && (
                  <div className="mt-1 text-blue-600 text-xs">✓ Selected</div>
                )}
              </div>
              
              <div 
                className={`p-3 rounded-lg border-2 cursor-pointer transition text-center ${
                  formData.questionType === 'ordering' 
                    ? 'border-purple-500 bg-purple-50 shadow-md' 
                    : 'border-gray-200 hover:border-purple-300'
                }`}
                onClick={() => setFormData({ 
                  ...formData, 
                  questionType: 'ordering', 
                  options: ['', '', '', '', ''],
                  correctOrder: 'a,b,c,d,e',
                  answer: '' 
                })}
              >
                <div className="text-xl">🔄</div>
                <div className="font-semibold text-sm">Ordering</div>
                <div className="text-xs text-gray-500">5 Options</div>
                {formData.questionType === 'ordering' && (
                  <div className="mt-1 text-purple-600 text-xs">✓ Selected</div>
                )}
              </div>
            </div>
          </div>

          {/* Question */}
          <div>
            <label className="block text-sm font-medium mb-2">Question *</label>
            <textarea 
              required 
              className="w-full p-2 border rounded-lg" 
              rows="3" 
              value={formData.question || ''} 
              onChange={(e) => setFormData({ ...formData, question: e.target.value })} 
              placeholder="Enter question in Kannada..." 
            />
          </div>

          {/* Options */}
          {formData.questionType === 'ordering' ? (
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
              <label className="block text-sm font-medium mb-2">Options (5) *</label>
              <div className="space-y-2">
                {['ಅ', 'ಆ', 'ಇ', 'ಈ', 'ಉ'].map((letter, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-8 font-bold text-purple-600">{letter})</span>
                    <input 
                      required 
                      className="flex-1 p-2 border rounded-lg" 
                      value={formData.options?.[idx] || ''} 
                      onChange={(e) => {
                        const newOptions = [...(formData.options || ['', '', '', '', ''])];
                        newOptions[idx] = e.target.value;
                        setFormData({ ...formData, options: newOptions });
                      }} 
                      placeholder={`Option ${letter}`} 
                    />
                  </div>
                ))}
              </div>
              
              <div className="mt-3">
                <label className="block text-sm font-medium mb-2">✓ Correct Order *</label>
                <select 
                  required 
                  className="w-full p-2 border rounded-lg bg-green-50"
                  value={formData.correctOrder || 'a,b,c,d,e'}
                  onChange={(e) => setFormData({ ...formData, correctOrder: e.target.value })}
                >
                  <option value="a,b,c,d,e">ಅ → ಆ → ಇ → ಈ → ಉ</option>
                  <option value="a,b,d,c,e">ಅ → ಆ → ಈ → ಇ → ಉ</option>
                  <option value="a,c,b,d,e">ಅ → ಇ → ಆ → ಈ → ಉ</option>
                  <option value="a,c,d,b,e">ಅ → ಇ → ಈ → ಆ → ಉ</option>
                  <option value="b,a,c,d,e">ಆ → ಅ → ಇ → ಈ → ಉ</option>
                  <option value="b,a,c,e,d">ಆ → ಅ → ಇ → ಉ → ಈ</option>
                  <option value="b,c,a,d,e">ಆ → ಇ → ಅ → ಈ → ಉ</option>
                  <option value="c,a,b,d,e">ಇ → ಅ → ಆ → ಈ → ಉ</option>
                  <option value="d,a,b,c,e">ಈ → ಅ → ಆ → ಇ → ಉ</option>
                  <option value="e,b,a,c,d">ಉ → ಆ → ಅ → ಇ → ಈ</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <label className="block text-sm font-medium mb-2">Options (4) *</label>
              <div className="grid grid-cols-2 gap-2">
                {['A', 'B', 'C', 'D'].map((letter, idx) => (
                  <div key={idx}>
                    <label className="block text-xs font-medium text-gray-600">{letter} *</label>
                    <input 
                      required 
                      className="w-full p-2 border rounded-lg" 
                      value={formData.options?.[idx] || ''} 
                      onChange={(e) => {
                        const newOptions = [...(formData.options || ['', '', '', ''])];
                        newOptions[idx] = e.target.value;
                        setFormData({ ...formData, options: newOptions });
                      }} 
                      placeholder={`Option ${letter}`} 
                    />
                  </div>
                ))}
              </div>
              
              <div className="mt-3">
                <label className="block text-sm font-medium mb-2">✓ Correct Answer *</label>
                <input 
                  required 
                  className="w-full p-2 border rounded-lg bg-green-50" 
                  value={formData.answer || ''} 
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })} 
                  placeholder="Correct answer" 
                />
              </div>
            </div>
          )}

          {/* Explanation */}
          <div>
            <label className="block text-sm font-medium mb-2">📖 Explanation</label>
            <textarea 
              className="w-full p-2 border rounded-lg bg-blue-50" 
              rows="4" 
              value={formData.explanation || ''} 
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })} 
              placeholder="Explain why this answer is correct..." 
            />
          </div>

          {/* Category & Difficulty */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select 
                className="w-full p-2 border rounded-lg" 
                value={formData.category || 'General'} 
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option>General</option>
                <option>Karnataka GK</option>
                <option>History</option>
                <option>Geography</option>
                <option>Polity</option>
                <option>Science</option>
                <option>Current Affairs</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Difficulty</label>
              <select 
                className="w-full p-2 border rounded-lg" 
                value={formData.difficulty || 'medium'} 
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              >
                <option value="easy">🟢 Easy</option>
                <option value="medium">🟡 Medium</option>
                <option value="hard">🔴 Hard</option>
              </select>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">👁️ Preview:</p>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="text-sm font-medium text-gray-800 mb-2">{formData.question || '📝 Question preview...'}</p>
              <div className="space-y-1">
                {formData.options?.map((opt, idx) => {
                  if (!opt) return null;
                  const labels = formData.questionType === 'ordering' 
                    ? ['ಅ', 'ಆ', 'ಇ', 'ಈ', 'ಉ'] 
                    : ['A', 'B', 'C', 'D'];
                  return (
                    <div key={idx} className="flex items-center gap-2 p-1 bg-gray-50 rounded">
                      <span className="text-sm font-bold text-purple-600 w-6">{labels[idx]})</span>
                      <span className="text-sm text-gray-700">{opt}</span>
                    </div>
                  );
                })}
              </div>
              {formData.questionType === 'ordering' && formData.correctOrder && (
                <div className="mt-2 p-2 bg-green-100 rounded-lg">
                  <p className="text-xs text-green-700">
                    ✓ Correct Order: {formData.correctOrder.split(',').map((l, i) => {
                      const map = {'a':'ಅ','b':'ಆ','c':'ಇ','d':'ಈ','e':'ಉ'};
                      return `${i+1}. ${map[l] || l}`;
                    }).join(' → ')}
                  </p>
                </div>
              )}
              {formData.questionType !== 'ordering' && formData.answer && (
                <div className="mt-2 p-2 bg-green-100 rounded-lg">
                  <p className="text-xs text-green-700">✓ Correct Answer: {formData.answer}</p>
                </div>
              )}
            </div>
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
            <div><label className="block text-sm font-medium mb-2">Category</label><select className="w-full p-2 border rounded-lg" value={formData.category || 'General'} onChange={(e) => setFormData({ ...formData, category: e.target.value })}><option>General</option><option>History</option><option>Geography</option><option>Polity</option><option>Science</option><option>Current Affairs</option></select></div>
            <div><label className="block text-sm font-medium mb-2">Important</label><select className="w-full p-2 border rounded-lg" value={formData.important || false} onChange={(e) => setFormData({ ...formData, important: e.target.value === 'true' })}><option value="false">No</option><option value="true">⭐ Important</option></select></div>
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
          <div><label className="block text-sm font-medium mb-2">Important</label><select className="w-full p-2 border rounded-lg" value={formData.important || false} onChange={(e) => setFormData({ ...formData, important: e.target.value === 'true' })}><option value="false">No</option><option value="true">⭐ Important</option></select></div>
        </>
      );
    }
    return null;
  };

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
              <button onClick={refreshData} className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-sm transition flex items-center gap-1">
                🔄 Refresh
              </button>
              <div className="text-right">
                <p className="font-semibold">{admin?.name || 'Admin'}</p>
                <p className="text-xs text-blue-200">Administrator</p>
              </div>
              <button onClick={() => { localStorage.removeItem('adminToken'); localStorage.removeItem('admin'); router.push('/'); }} className="bg-red-500/20 hover:bg-red-500/30 px-4 py-2 rounded-lg transition">Logout</button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Message */}
      {message && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${message.type === 'success' ? 'bg-green-500 text-white' : message.type === 'error' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}>
          {message.text}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-1 py-2 overflow-x-auto">
            <button onClick={() => setActiveTab('dashboard')} className={`px-5 py-2 rounded-lg font-medium capitalize whitespace-nowrap transition ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>📊 Dashboard</button>
            <button onClick={() => setActiveTab('questions')} className={`px-5 py-2 rounded-lg font-medium capitalize whitespace-nowrap transition ${activeTab === 'questions' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>❓ Quiz Questions ({questions.length})</button>
            <button onClick={() => setActiveTab('qa-questions')} className={`px-5 py-2 rounded-lg font-medium capitalize whitespace-nowrap transition ${activeTab === 'qa-questions' ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>📝 Q&A Bank ({qaQuestions.length})</button>
            <button onClick={() => setActiveTab('notes')} className={`px-5 py-2 rounded-lg font-medium capitalize whitespace-nowrap transition ${activeTab === 'notes' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>📚 Study Notes ({notes.length})</button>
            <button onClick={() => setActiveTab('current-affairs')} className={`px-5 py-2 rounded-lg font-medium capitalize whitespace-nowrap transition ${activeTab === 'current-affairs' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>📰 Current Affairs ({currentAffairs.length})</button>
            <button onClick={() => setActiveTab('users')} className={`px-5 py-2 rounded-lg font-medium capitalize whitespace-nowrap transition ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>👥 Users ({users.length})</button>
            <button onClick={() => setActiveTab('results')} className={`px-5 py-2 rounded-lg font-medium capitalize whitespace-nowrap transition ${activeTab === 'results' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>📋 Results ({quizResults.length})</button>
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
                  <button onClick={() => { setActiveTab('questions'); setShowModal(true); setEditingItem(null); setFormData({ question: '', questionType: 'mcq', options: ['', '', '', ''], answer: '', correctOrder: '', explanation: '', category: 'General', difficulty: 'medium' }); }} className="w-full bg-blue-50 text-blue-600 p-3 rounded-lg text-left hover:bg-blue-100 transition">➕ Add Quiz Question</button>
                  <button onClick={() => { setActiveTab('qa-questions'); setShowModal(true); setEditingItem(null); setFormData({}); }} className="w-full bg-green-50 text-green-600 p-3 rounded-lg text-left hover:bg-green-100 transition">📝 Add Q&A Question</button>
                  <button onClick={() => { setActiveTab('notes'); setShowModal(true); setEditingItem(null); setFormData({}); }} className="w-full bg-emerald-50 text-emerald-600 p-3 rounded-lg text-left hover:bg-emerald-100 transition">📚 Add Study Note</button>
                  <button onClick={() => { setActiveTab('current-affairs'); setShowModal(true); setEditingItem(null); setFormData({}); }} className="w-full bg-orange-50 text-orange-600 p-3 rounded-lg text-left hover:bg-orange-100 transition">📰 Add Current Affairs</button>
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
              <button onClick={() => { setShowModal(true); setEditingItem(null); setFormData({ question: '', questionType: 'mcq', options: ['', '', '', ''], answer: '', correctOrder: '', explanation: '', category: 'General', difficulty: 'medium' }); }} className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">➕ Add Question</button>
              <div className="flex gap-2">
                <button onClick={refreshData} className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">🔄 Refresh</button>
                <p className="text-sm text-gray-500 py-2">Total: {questions.length} questions</p>
              </div>
            </div>
            {questions.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-12 text-center"><div className="text-6xl mb-4">❓</div><p className="text-gray-500">No questions yet. Click "Add Question" to create one.</p></div>
            ) : (
              <div className="space-y-4">
                {questions.map((q, idx) => (
                  <div key={q._id} className="bg-white rounded-lg shadow p-5 hover:shadow-md transition border-l-4 border-l-blue-500">
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded font-semibold">#{idx + 1}</span>
                          
                          {/* Question Type Badge */}
                          {q.questionType === 'ordering' ? (
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-semibold">🔄 Ordering</span>
                          ) : (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">📝 MCQ</span>
                          )}
                          
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{q.category || 'General'}</span>
                          <span className={`text-xs px-2 py-1 rounded font-semibold ${
                            q.difficulty === 'easy' ? 'bg-green-100 text-green-600' :
                            q.difficulty === 'hard' ? 'bg-red-100 text-red-600' :
                            'bg-yellow-100 text-yellow-600'
                          }`}>{q.difficulty || 'medium'}</span>
                          
                          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                            {q.options?.length || 0} options
                          </span>
                        </div>
                        
                        <h3 className="font-semibold text-gray-800 mb-3">{q.question}</h3>
                        
                        {q.questionType === 'ordering' ? (
                          // --- ORDERING DISPLAY ---
                          <div className="space-y-3">
                            <div className="grid grid-cols-5 gap-2">
                              {['ಅ', 'ಆ', 'ಇ', 'ಈ', 'ಉ'].map((letter, idx) => (
                                <div key={idx} className="bg-purple-50 p-2 rounded-lg border border-purple-200 text-center">
                                  <span className="font-bold text-purple-600 text-sm block">{letter})</span>
                                  <span className="text-sm text-gray-700">{q.options?.[idx] || '-'}</span>
                                </div>
                              ))}
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                              <p className="text-sm font-semibold text-green-700">
                                ✓ Correct Order: 
                                <span className="font-bold ml-2">
                                  {q.correctOrder?.split(',').map((l, i) => {
                                    const map = {'a':'ಅ','b':'ಆ','c':'ಇ','d':'ಈ','e':'ಉ'};
                                    return `${i+1}. ${map[l] || l}`;
                                  }).join(' → ')}
                                </span>
                              </p>
                            </div>
                          </div>
                        ) : (
                          // --- MCQ DISPLAY ---
                          <>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {q.options?.map((opt, idx) => (
                                <div key={idx} className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                                  <span className="font-bold text-blue-600">{String.fromCharCode(65 + idx)})</span>
                                  <span className="ml-1">{opt || '-'}</span>
                                </div>
                              ))}
                            </div>
                            <p className="text-green-600 text-sm mt-2 font-semibold">
                              ✓ Correct Answer: <span className="font-bold">{q.answer}</span>
                            </p>
                          </>
                        )}
                        
                        {q.explanation && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-xs font-semibold text-blue-800 mb-1">📖 Explanation:</p>
                            <p className="text-sm text-blue-700">{q.explanation}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <button 
                          onClick={() => { 
                            setEditingItem(q); 
                            setFormData({ 
                              ...q,
                              questionType: q.questionType || 'mcq',
                              options: q.options || (q.questionType === 'ordering' ? ['', '', '', '', ''] : ['', '', '', '']),
                              correctOrder: q.correctOrder || 'a,b,c,d,e'
                            }); 
                            setShowModal(true); 
                          }} 
                          className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 transition"
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          onClick={() => { 
                            setExplanationQuestion(q); 
                            setExplanationText(q.explanation || ''); 
                            setShowExplanationModal(true); 
                          }} 
                          className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600 transition"
                        >
                          📖 Explanation
                        </button>
                        <button 
                          onClick={() => handleDelete(q._id)} 
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition"
                        >
                          🗑️ Delete
                        </button>
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
              <button onClick={() => { setShowModal(true); setEditingItem(null); setFormData({}); }} className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">➕ Add Q&A Question</button>
              <div className="flex gap-2">
                <button onClick={refreshData} className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">🔄 Refresh</button>
                <p className="text-sm text-gray-500 py-2">Total: {qaQuestions.length} Q&A pairs</p>
              </div>
            </div>
            {qaQuestions.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-12 text-center"><div className="text-6xl mb-4">📝</div><p className="text-gray-500">No Q&A questions yet. Click "Add Q&A Question" to create one.</p></div>
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
                          <div className="bg-green-50 rounded-lg p-3 mt-2"><p className="text-sm text-green-700">✓ {qa.answer || qa.answer_en}</p></div>
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
              <div className="flex gap-2">
                <button onClick={refreshData} className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">🔄 Refresh</button>
                <p className="text-sm text-gray-500 py-2">Total: {notes.length} notes</p>
              </div>
            </div>
            {notes.map(note => (
              <div key={note._id} className="bg-white rounded-lg shadow p-5 mb-4"><div className="flex justify-between"><div><h3 className="font-semibold">{note.title}</h3><p className="text-sm text-gray-500">{note.category}</p><p className="text-gray-600 mt-2 line-clamp-2">{note.content?.substring(0, 150)}...</p></div><div className="flex gap-2"><button onClick={() => { setEditingItem(note); setFormData(note); setShowModal(true); }} className="px-3 py-1 bg-yellow-500 text-white rounded text-sm">Edit</button><button onClick={() => handleDelete(note._id)} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Delete</button></div></div></div>
            ))}
          </div>
        )}

        {/* Current Affairs Management */}
        {activeTab === 'current-affairs' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <button onClick={() => { setShowModal(true); setEditingItem(null); setFormData({}); }} className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">➕ Add Current Affairs</button>
              <div className="flex gap-2">
                <button onClick={refreshData} className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">🔄 Refresh</button>
                <p className="text-sm text-gray-500 py-2">Total: {currentAffairs.length} items</p>
              </div>
            </div>
            {currentAffairs.map(ca => (
              <div key={ca._id} className="bg-white rounded-lg shadow p-5 mb-4"><div className="flex justify-between"><div><h3 className="font-semibold">{ca.title}</h3><p className="text-sm text-gray-500">{ca.date} | {ca.category}</p><p className="text-gray-600 mt-2 line-clamp-2">{ca.content?.substring(0, 150)}...</p></div><div className="flex gap-2"><button onClick={() => { setEditingItem(ca); setFormData(ca); setShowModal(true); }} className="px-3 py-1 bg-yellow-500 text-white rounded text-sm">Edit</button><button onClick={() => handleDelete(ca._id)} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Delete</button></div></div></div>
            ))}
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
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
                  <button type="button" onClick={() => { setShowModal(false); setEditingItem(null); }} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Cancel</button>
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
                {explanationQuestion.questionType === 'ordering' ? (
                  <p className="text-sm text-purple-600 mt-2 font-semibold">
                    ✓ Correct Order: 
                    <span className="font-bold ml-2">
                      {explanationQuestion.correctOrder?.split(',').map((l, i) => {
                        const map = {'a':'ಅ','b':'ಆ','c':'ಇ','d':'ಈ','e':'ಉ'};
                        return `${i+1}. ${map[l] || l}`;
                      }).join(' → ')}
                    </span>
                  </p>
                ) : (
                  <p className="text-sm text-green-600 mt-2 font-semibold">
                    ✓ Correct Answer: <span className="font-bold">{explanationQuestion.answer}</span>
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Explanation</label>
                <textarea className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" rows="6" value={explanationText} onChange={(e) => setExplanationText(e.target.value)} placeholder="Explain why this answer is correct..." />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={handleUpdateExplanation} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">💾 Save Explanation</button>
                <button onClick={() => { setShowExplanationModal(false); setExplanationQuestion(null); }} className="flex-1 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}