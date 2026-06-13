// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// export default function AdminPanel() {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [admin, setAdmin] = useState(null);
//   const [loading, setLoading] = useState(true);
  
//   // Data states
//   const [questions, setQuestions] = useState([]);
//   const [qaQuestions, setQaQuestions] = useState([]);
//   const [notes, setNotes] = useState([]);
//   const [currentAffairs, setCurrentAffairs] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [quizResults, setQuizResults] = useState([]);
  
//   // Form states
//   const [showModal, setShowModal] = useState(false);
//   const [editingItem, setEditingItem] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [message, setMessage] = useState({ text: '', type: '' });
  
//   // Explanation Editor states
//   const [showExplanationModal, setShowExplanationModal] = useState(false);
//   const [explanationQuestion, setExplanationQuestion] = useState(null);
//   const [explanationText, setExplanationText] = useState('');

//   useEffect(() => {
//     const token = localStorage.getItem('adminToken');
//     const adminData = localStorage.getItem('admin');
//     if (!token || !adminData) {
//       router.push('/admin-login');
//       return;
//     }
//     setAdmin(JSON.parse(adminData));
//     fetchData();
//   }, [activeTab]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       if (activeTab === 'dashboard') {
//         const [qRes, qaRes, nRes, caRes, uRes, rRes] = await Promise.all([
//           fetch('/api/questions').catch(() => ({ json: () => [] })),
//           fetch('/api/admin/qa-questions').catch(() => ({ json: () => [] })),
//           fetch('/api/admin/notes').catch(() => ({ json: () => [] })),
//           fetch('/api/admin/current-affairs').catch(() => ({ json: () => [] })),
//           fetch('/api/admin/users').catch(() => ({ json: () => [] })),
//           fetch('/api/quiz-results').catch(() => ({ json: () => [] }))
//         ]);
//         setQuestions(await qRes.json());
//         setQaQuestions(await qaRes.json());
//         setNotes(await nRes.json());
//         setCurrentAffairs(await caRes.json());
//         setUsers(await uRes.json());
//         setQuizResults(await rRes.json());
//       } else if (activeTab === 'questions') {
//         const res = await fetch('/api/questions');
//         setQuestions(await res.json());
//       } else if (activeTab === 'qa-questions') {
//         const res = await fetch('/api/admin/qa-questions');
//         setQaQuestions(await res.json());
//       } else if (activeTab === 'notes') {
//         const res = await fetch('/api/admin/notes');
//         setNotes(await res.json());
//       } else if (activeTab === 'current-affairs') {
//         const res = await fetch('/api/admin/current-affairs');
//         setCurrentAffairs(await res.json());
//       } else if (activeTab === 'users') {
//         const res = await fetch('/api/admin/users');
//         setUsers(await res.json());
//       } else if (activeTab === 'results') {
//         const res = await fetch('/api/quiz-results');
//         setQuizResults(await res.json());
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const method = editingItem ? 'PUT' : 'POST';
//     let url = '';
    
//     if (activeTab === 'questions') url = editingItem ? `/api/questions?id=${editingItem._id}` : '/api/questions';
//     else if (activeTab === 'qa-questions') url = editingItem ? `/api/admin/qa-questions?id=${editingItem._id}` : '/api/admin/qa-questions';
//     else if (activeTab === 'notes') url = editingItem ? `/api/admin/notes?id=${editingItem._id}` : '/api/admin/notes';
//     else if (activeTab === 'current-affairs') url = editingItem ? `/api/admin/current-affairs?id=${editingItem._id}` : '/api/admin/current-affairs';
    
//     try {
//       const response = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });
//       if (response.ok) {
//         setShowModal(false);
//         setEditingItem(null);
//         setFormData({});
//         fetchData();
//         setMessage({ text: 'Saved successfully!', type: 'success' });
//         setTimeout(() => setMessage({ text: '', type: '' }), 3000);
//       } else {
//         setMessage({ text: 'Error saving', type: 'error' });
//         setTimeout(() => setMessage({ text: '', type: '' }), 3000);
//       }
//     } catch (error) {
//       setMessage({ text: 'Error saving', type: 'error' });
//       setTimeout(() => setMessage({ text: '', type: '' }), 3000);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (confirm('Delete this item? This cannot be undone.')) {
//       let url = '';
//       if (activeTab === 'questions') url = `/api/questions?id=${id}`;
//       else if (activeTab === 'qa-questions') url = `/api/admin/qa-questions?id=${id}`;
//       else if (activeTab === 'notes') url = `/api/admin/notes?id=${id}`;
//       else if (activeTab === 'current-affairs') url = `/api/admin/current-affairs?id=${id}`;
      
//       try {
//         const response = await fetch(url, { method: 'DELETE' });
//         if (response.ok) {
//           fetchData();
//           setMessage({ text: 'Deleted successfully!', type: 'success' });
//           setTimeout(() => setMessage({ text: '', type: '' }), 3000);
//         } else {
//           setMessage({ text: 'Error deleting', type: 'error' });
//           setTimeout(() => setMessage({ text: '', type: '' }), 3000);
//         }
//       } catch (error) {
//         setMessage({ text: 'Error deleting', type: 'error' });
//         setTimeout(() => setMessage({ text: '', type: '' }), 3000);
//       }
//     }
//   };

//   const handleUpdateExplanation = async () => {
//     if (!explanationQuestion) return;
    
//     try {
//       const response = await fetch('/api/admin/update-explanation', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           questionId: explanationQuestion._id,
//           explanation: explanationText
//         })
//       });
      
//       if (response.ok) {
//         setMessage({ text: 'Explanation updated successfully!', type: 'success' });
//         setTimeout(() => setMessage({ text: '', type: '' }), 3000);
//         setShowExplanationModal(false);
//         fetchData();
//       } else {
//         setMessage({ text: 'Error updating explanation', type: 'error' });
//       }
//     } catch (error) {
//       setMessage({ text: 'Error updating explanation', type: 'error' });
//     }
//   };

//   const getFormFields = () => {
//     if (activeTab === 'questions') {
//       return (
//         <>
//           <div><label className="block text-sm font-medium mb-2">Question *</label><textarea required className="w-full p-2 border rounded-lg" rows="3" value={formData.question || ''} onChange={(e) => setFormData({ ...formData, question: e.target.value })} placeholder="Enter question" /></div>
//           <div className="grid grid-cols-2 gap-3">
//             <div><label className="block text-sm font-medium mb-2">Option A *</label><input required className="w-full p-2 border rounded-lg" value={formData.options?.[0] || ''} onChange={(e) => setFormData({ ...formData, options: [e.target.value, formData.options?.[1] || '', formData.options?.[2] || '', formData.options?.[3] || ''] })} placeholder="Option A" /></div>
//             <div><label className="block text-sm font-medium mb-2">Option B *</label><input required className="w-full p-2 border rounded-lg" value={formData.options?.[1] || ''} onChange={(e) => setFormData({ ...formData, options: [formData.options?.[0] || '', e.target.value, formData.options?.[2] || '', formData.options?.[3] || ''] })} placeholder="Option B" /></div>
//             <div><label className="block text-sm font-medium mb-2">Option C *</label><input required className="w-full p-2 border rounded-lg" value={formData.options?.[2] || ''} onChange={(e) => setFormData({ ...formData, options: [formData.options?.[0] || '', formData.options?.[1] || '', e.target.value, formData.options?.[3] || ''] })} placeholder="Option C" /></div>
//             <div><label className="block text-sm font-medium mb-2">Option D *</label><input required className="w-full p-2 border rounded-lg" value={formData.options?.[3] || ''} onChange={(e) => setFormData({ ...formData, options: [formData.options?.[0] || '', formData.options?.[1] || '', formData.options?.[2] || '', e.target.value] })} placeholder="Option D" /></div>
//           </div>
//           <div><label className="block text-sm font-medium mb-2">Correct Answer *</label><input required className="w-full p-2 border rounded-lg" value={formData.answer || ''} onChange={(e) => setFormData({ ...formData, answer: e.target.value })} placeholder="Correct answer" /></div>
          
//           <div className="mt-3">
//             <label className="block text-sm font-medium mb-2">📖 Explanation (What users see after answering)</label>
//             <textarea 
//               className="w-full p-2 border rounded-lg bg-blue-50" 
//               rows="4" 
//               value={formData.explanation || ''} 
//               onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
//               placeholder="Explain why this answer is correct. This helps students learn from their mistakes."
//             />
//             <p className="text-xs text-gray-400 mt-1">💡 Tip: Add detailed explanation with key points for better learning</p>
//           </div>
          
//           <div className="grid grid-cols-2 gap-3">
//             <div><label className="block text-sm font-medium mb-2">Category</label><select className="w-full p-2 border rounded-lg" value={formData.category || 'General'} onChange={(e) => setFormData({ ...formData, category: e.target.value })}><option>General</option><option>Karnataka GK</option><option>Karnataka History</option><option>Karnataka Geography</option><option>Current Affairs</option></select></div>
//             <div><label className="block text-sm font-medium mb-2">Difficulty</label><select className="w-full p-2 border rounded-lg" value={formData.difficulty || 'medium'} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}><option>easy</option><option>medium</option><option>hard</option></select></div>
//           </div>
//         </>
//       );
//     } else if (activeTab === 'qa-questions') {
//       return (
//         <>
//           <div><label className="block text-sm font-medium mb-2">Question (Kannada) *</label><textarea required className="w-full p-2 border rounded-lg" rows="3" value={formData.question || ''} onChange={(e) => setFormData({ ...formData, question: e.target.value })} placeholder="Enter question in Kannada" /></div>
//           <div><label className="block text-sm font-medium mb-2">Question (English)</label><textarea className="w-full p-2 border rounded-lg" rows="2" value={formData.question_en || ''} onChange={(e) => setFormData({ ...formData, question_en: e.target.value })} placeholder="Enter question in English" /></div>
//           <div><label className="block text-sm font-medium mb-2">Answer (Kannada) *</label><textarea required className="w-full p-2 border rounded-lg" rows="3" value={formData.answer || ''} onChange={(e) => setFormData({ ...formData, answer: e.target.value })} placeholder="Enter answer in Kannada" /></div>
//           <div><label className="block text-sm font-medium mb-2">Answer (English)</label><textarea className="w-full p-2 border rounded-lg" rows="2" value={formData.answer_en || ''} onChange={(e) => setFormData({ ...formData, answer_en: e.target.value })} placeholder="Enter answer in English" /></div>
//           <div className="grid grid-cols-2 gap-3">
//             <div><label className="block text-sm font-medium mb-2">Category</label><select className="w-full p-2 border rounded-lg" value={formData.category || 'General'} onChange={(e) => setFormData({ ...formData, category: e.target.value })}><option>General</option><option>History</option><option>Geography</option><option>Polity</option><option>Economy</option><option>Science</option><option>Current Affairs</option></select></div>
//             <div><label className="block text-sm font-medium mb-2">Important</label><select className="w-full p-2 border rounded-lg" value={formData.important || false} onChange={(e) => setFormData({ ...formData, important: e.target.value === 'true' })}><option value="false">No</option><option value="true">Yes (Mark as Important)</option></select></div>
//           </div>
//         </>
//       );
//     } else if (activeTab === 'notes') {
//       return (
//         <>
//           <div><label className="block text-sm font-medium mb-2">Title (Kannada) *</label><input required className="w-full p-2 border rounded-lg" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></div>
//           <div><label className="block text-sm font-medium mb-2">Title (English)</label><input className="w-full p-2 border rounded-lg" value={formData.title_en || ''} onChange={(e) => setFormData({ ...formData, title_en: e.target.value })} /></div>
//           <div><label className="block text-sm font-medium mb-2">Content (Kannada) *</label><textarea required className="w-full p-2 border rounded-lg" rows="5" value={formData.content || ''} onChange={(e) => setFormData({ ...formData, content: e.target.value })} /></div>
//           <div><label className="block text-sm font-medium mb-2">Content (English)</label><textarea className="w-full p-2 border rounded-lg" rows="5" value={formData.content_en || ''} onChange={(e) => setFormData({ ...formData, content_en: e.target.value })} /></div>
//           <div><label className="block text-sm font-medium mb-2">Category</label><input className="w-full p-2 border rounded-lg" value={formData.category || 'General'} onChange={(e) => setFormData({ ...formData, category: e.target.value })} /></div>
//         </>
//       );
//     } else if (activeTab === 'current-affairs') {
//       return (
//         <>
//           <div><label className="block text-sm font-medium mb-2">Title (Kannada) *</label><input required className="w-full p-2 border rounded-lg" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></div>
//           <div><label className="block text-sm font-medium mb-2">Title (English)</label><input className="w-full p-2 border rounded-lg" value={formData.title_en || ''} onChange={(e) => setFormData({ ...formData, title_en: e.target.value })} /></div>
//           <div><label className="block text-sm font-medium mb-2">Content (Kannada) *</label><textarea required className="w-full p-2 border rounded-lg" rows="4" value={formData.content || ''} onChange={(e) => setFormData({ ...formData, content: e.target.value })} /></div>
//           <div><label className="block text-sm font-medium mb-2">Content (English)</label><textarea className="w-full p-2 border rounded-lg" rows="4" value={formData.content_en || ''} onChange={(e) => setFormData({ ...formData, content_en: e.target.value })} /></div>
//           <div><label className="block text-sm font-medium mb-2">Date *</label><input type="date" required className="w-full p-2 border rounded-lg" value={formData.date || new Date().toISOString().split('T')[0]} onChange={(e) => setFormData({ ...formData, date: e.target.value })} /></div>
//           <div><label className="block text-sm font-medium mb-2">Category</label><input className="w-full p-2 border rounded-lg" value={formData.category || 'General'} onChange={(e) => setFormData({ ...formData, category: e.target.value })} /></div>
//           <div><label className="block text-sm font-medium mb-2">Important</label><select className="w-full p-2 border rounded-lg" value={formData.important || false} onChange={(e) => setFormData({ ...formData, important: e.target.value === 'true' })}><option value="false">No</option><option value="true">Yes (Mark as Important)</option></select></div>
//         </>
//       );
//     }
//     return null;
//   };

//   if (loading && activeTab === 'dashboard') {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-800 to-indigo-800 text-white shadow-lg sticky top-0 z-50">
//         <div className="container mx-auto px-6 py-4">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-2xl font-bold">🎯 Kannada Exam Pro Admin</h1>
//               <p className="text-blue-200 text-sm">Complete Content Management System</p>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="text-right">
//                 <p className="font-semibold">{admin?.name}</p>
//                 <p className="text-xs text-blue-200">{admin?.role}</p>
//               </div>
//               <button onClick={() => { localStorage.removeItem('adminToken'); localStorage.removeItem('admin'); router.push('/'); }} className="bg-red-500/20 hover:bg-red-500/30 px-4 py-2 rounded-lg transition">Logout</button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Message */}
//       {message.text && (
//         <div className={`fixed top-20 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
//           {message.text}
//         </div>
//       )}

//       {/* Navigation Tabs */}
//       <div className="bg-white shadow-md sticky top-0 z-40">
//         <div className="container mx-auto px-6">
//           <div className="flex flex-wrap gap-1 py-2 overflow-x-auto">
//             <button onClick={() => { setActiveTab('dashboard'); setShowModal(false); }} className={`px-5 py-2 rounded-lg font-medium capitalize transition-all whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>📊 Dashboard</button>
//             <button onClick={() => { setActiveTab('questions'); setShowModal(false); }} className={`px-5 py-2 rounded-lg font-medium capitalize transition-all whitespace-nowrap ${activeTab === 'questions' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>❓ Quiz Questions ({questions.length})</button>
//             <button onClick={() => { setActiveTab('qa-questions'); setShowModal(false); }} className={`px-5 py-2 rounded-lg font-medium capitalize transition-all whitespace-nowrap ${activeTab === 'qa-questions' ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>📝 Q&A Bank ({qaQuestions.length})</button>
//             <button onClick={() => { setActiveTab('notes'); setShowModal(false); }} className={`px-5 py-2 rounded-lg font-medium capitalize transition-all whitespace-nowrap ${activeTab === 'notes' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>📚 Study Notes ({notes.length})</button>
//             <button onClick={() => { setActiveTab('current-affairs'); setShowModal(false); }} className={`px-5 py-2 rounded-lg font-medium capitalize transition-all whitespace-nowrap ${activeTab === 'current-affairs' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>📰 Current Affairs ({currentAffairs.length})</button>
//             <button onClick={() => { setActiveTab('users'); setShowModal(false); }} className={`px-5 py-2 rounded-lg font-medium capitalize transition-all whitespace-nowrap ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>👥 Users ({users.length})</button>
//             <button onClick={() => { setActiveTab('results'); setShowModal(false); }} className={`px-5 py-2 rounded-lg font-medium capitalize transition-all whitespace-nowrap ${activeTab === 'results' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>📋 Results ({quizResults.length})</button>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="container mx-auto px-6 py-8">
//         {/* Dashboard */}
//         {activeTab === 'dashboard' && (
//           <div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//               <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white"><div className="flex justify-between"><div><p className="text-blue-100">Quiz Questions</p><p className="text-4xl font-bold">{questions.length}</p></div><div className="text-5xl">❓</div></div></div>
//               <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white"><div className="flex justify-between"><div><p className="text-green-100">Q&A Bank</p><p className="text-4xl font-bold">{qaQuestions.length}</p></div><div className="text-5xl">📝</div></div></div>
//               <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white"><div className="flex justify-between"><div><p className="text-emerald-100">Study Notes</p><p className="text-4xl font-bold">{notes.length}</p></div><div className="text-5xl">📚</div></div></div>
//               <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white"><div className="flex justify-between"><div><p className="text-orange-100">Current Affairs</p><p className="text-4xl font-bold">{currentAffairs.length}</p></div><div className="text-5xl">📰</div></div></div>
//               <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white"><div className="flex justify-between"><div><p className="text-purple-100">Total Users</p><p className="text-4xl font-bold">{users.length}</p></div><div className="text-5xl">👥</div></div></div>
//               <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl shadow-lg p-6 text-white"><div className="flex justify-between"><div><p className="text-pink-100">Quiz Attempts</p><p className="text-4xl font-bold">{quizResults.length}</p></div><div className="text-5xl">📊</div></div></div>
//             </div>

//             <div className="grid lg:grid-cols-2 gap-6">
//               <div className="bg-white rounded-xl shadow-lg p-6"><h3 className="text-lg font-bold mb-4">⚡ Quick Actions</h3>
//                 <div className="space-y-3">
//                   <button onClick={() => { setActiveTab('questions'); setShowModal(true); setEditingItem(null); setFormData({}); }} className="w-full bg-blue-50 text-blue-600 p-3 rounded-lg text-left hover:bg-blue-100">➕ Add Quiz Question</button>
//                   <button onClick={() => { setActiveTab('qa-questions'); setShowModal(true); setEditingItem(null); setFormData({}); }} className="w-full bg-green-50 text-green-600 p-3 rounded-lg text-left hover:bg-green-100">📝 Add Q&A Question</button>
//                   <button onClick={() => { setActiveTab('notes'); setShowModal(true); setEditingItem(null); setFormData({}); }} className="w-full bg-emerald-50 text-emerald-600 p-3 rounded-lg text-left hover:bg-emerald-100">📚 Add Study Note</button>
//                   <button onClick={() => { setActiveTab('current-affairs'); setShowModal(true); setEditingItem(null); setFormData({}); }} className="w-full bg-orange-50 text-orange-600 p-3 rounded-lg text-left hover:bg-orange-100">📰 Add Current Affairs</button>
//                 </div>
//               </div>
//               <div className="bg-white rounded-xl shadow-lg p-6"><h3 className="text-lg font-bold mb-4">📊 Content Stats</h3>
//                 <div className="space-y-3"><div className="flex justify-between"><span>Total Content Items</span><span className="font-bold">{questions.length + qaQuestions.length + notes.length + currentAffairs.length}</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min((questions.length + qaQuestions.length + notes.length + currentAffairs.length) / 2, 100)}%` }}></div></div>
//                 <div className="flex justify-between"><span>Q&A Completion</span><span className="font-bold">{qaQuestions.length} / 50+</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-green-600 h-2 rounded-full" style={{ width: `${Math.min(qaQuestions.length, 100)}%` }}></div></div></div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Quiz Questions Management */}
//         {activeTab === 'questions' && (
//           <div>
//             <div className="flex justify-between items-center mb-4">
//               <button onClick={() => { setShowModal(true); setEditingItem(null); setFormData({}); }} className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">➕ Add Question</button>
//               <p className="text-sm text-gray-500">Total: {questions.length} questions</p>
//             </div>
//             {questions.length === 0 ? (
//               <div className="bg-white rounded-xl shadow p-12 text-center"><div className="text-6xl mb-4">❓</div><p className="text-gray-500">No questions yet.</p></div>
//             ) : (
//               <div className="space-y-4">
//                 {questions.map((q, idx) => (
//                   <div key={q._id} className="bg-white rounded-lg shadow p-5 hover:shadow-md transition">
//                     <div className="flex justify-between">
//                       <div className="flex-1">
//                         <div className="flex gap-2 mb-2">
//                           <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">#{idx + 1}</span>
//                           <span className="text-xs bg-gray-100 px-2 py-1 rounded">{q.category}</span>
//                           <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">{q.difficulty}</span>
//                         </div>
//                         <h3 className="font-semibold mb-2">{q.question}</h3>
//                         <div className="grid grid-cols-2 gap-2 text-sm">
//                           <div className="p-1 bg-gray-50 rounded">A) {q.options?.[0]}</div>
//                           <div className="p-1 bg-gray-50 rounded">B) {q.options?.[1]}</div>
//                           <div className="p-1 bg-gray-50 rounded">C) {q.options?.[2]}</div>
//                           <div className="p-1 bg-gray-50 rounded">D) {q.options?.[3]}</div>
//                         </div>
//                         <p className="text-green-600 text-sm mt-2">✓ Correct Answer: {q.answer}</p>
                        
//                         {q.explanation && (
//                           <div className="mt-3 p-3 bg-blue-50 rounded-lg">
//                             <p className="text-xs font-semibold text-blue-800 mb-1">📖 Current Explanation:</p>
//                             <p className="text-sm text-blue-700">{q.explanation}</p>
//                           </div>
//                         )}
//                       </div>
//                       <div className="flex flex-col gap-2 ml-4">
//                         <button onClick={() => { setEditingItem(q); setFormData(q); setShowModal(true); }} className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600">✏️ Edit</button>
//                         <button onClick={() => { setExplanationQuestion(q); setExplanationText(q.explanation || ''); setShowExplanationModal(true); }} className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600">📖 Edit Explanation</button>
//                         <button onClick={() => handleDelete(q._id)} className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">🗑️ Delete</button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Q&A Bank Management */}
//         {activeTab === 'qa-questions' && (
//           <div>
//             <div className="flex justify-between items-center mb-4">
//               <button onClick={() => { setShowModal(true); setEditingItem(null); setFormData({}); }} className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">➕ Add Q&A Question</button>
//               <p className="text-sm text-gray-500">Total: {qaQuestions.length} Q&A pairs</p>
//             </div>
//             {qaQuestions.length === 0 ? (
//               <div className="bg-white rounded-xl shadow p-12 text-center">
//                 <div className="text-6xl mb-4">📝</div>
//                 <p className="text-gray-500">No Q&A questions yet. Click "Add Q&A Question" to create one.</p>
//                 <p className="text-xs text-gray-400 mt-2">You can add up to 50+ questions for exam preparation</p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {qaQuestions.map((qa, idx) => (
//                   <div key={qa._id} className="bg-white rounded-lg shadow p-5 border-l-4 border-green-500">
//                     <div className="flex justify-between">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-2 mb-2">
//                           <span className="text-sm font-bold text-green-600">#{idx + 1}</span>
//                           {qa.important && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">⭐ Important</span>}
//                           <span className="text-xs bg-gray-100 px-2 py-1 rounded">{qa.category}</span>
//                         </div>
//                         <p className="font-semibold text-gray-800">❓ {qa.question || qa.question_en}</p>
//                         <details className="mt-2">
//                           <summary className="cursor-pointer text-green-600 text-sm font-medium">📖 Show Answer</summary>
//                           <div className="bg-green-50 rounded-lg p-3 mt-2">
//                             <p className="text-sm text-green-700">✓ {qa.answer || qa.answer_en}</p>
//                           </div>
//                         </details>
//                       </div>
//                       <div className="flex gap-2">
//                         <button onClick={() => { setEditingItem(qa); setFormData(qa); setShowModal(true); }} className="px-3 py-1 bg-yellow-500 text-white rounded text-sm">Edit</button>
//                         <button onClick={() => handleDelete(qa._id)} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Delete</button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Notes Management */}
//         {activeTab === 'notes' && (
//           <div>
//             <div className="flex justify-between items-center mb-4">
//               <button onClick={() => { setShowModal(true); setEditingItem(null); setFormData({}); }} className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">➕ Add Note</button>
//               <p className="text-sm text-gray-500">Total: {notes.length} notes</p>
//             </div>
//             {notes.length === 0 ? (
//               <div className="bg-white rounded-xl shadow p-12 text-center"><div className="text-6xl mb-4">📚</div><p className="text-gray-500">No notes yet.</p></div>
//             ) : (
//               <div className="space-y-4">
//                 {notes.map(note => (
//                   <div key={note._id} className="bg-white rounded-lg shadow p-5">
//                     <div className="flex justify-between">
//                       <div>
//                         <h3 className="font-semibold">{note.title}</h3>
//                         <p className="text-sm text-gray-500">{note.category}</p>
//                         <p className="text-gray-600 mt-2 line-clamp-2">{note.content?.substring(0, 150)}...</p>
//                       </div>
//                       <div className="flex gap-2">
//                         <button onClick={() => { setEditingItem(note); setFormData(note); setShowModal(true); }} className="px-3 py-1 bg-yellow-500 text-white rounded text-sm">Edit</button>
//                         <button onClick={() => handleDelete(note._id)} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Delete</button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Current Affairs Management */}
//         {activeTab === 'current-affairs' && (
//           <div>
//             <div className="flex justify-between items-center mb-4">
//               <button onClick={() => { setShowModal(true); setEditingItem(null); setFormData({}); }} className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">➕ Add Current Affairs</button>
//               <p className="text-sm text-gray-500">Total: {currentAffairs.length} items</p>
//             </div>
//             {currentAffairs.length === 0 ? (
//               <div className="bg-white rounded-xl shadow p-12 text-center"><div className="text-6xl mb-4">📰</div><p className="text-gray-500">No current affairs yet.</p></div>
//             ) : (
//               <div className="space-y-4">
//                 {currentAffairs.map(ca => (
//                   <div key={ca._id} className="bg-white rounded-lg shadow p-5">
//                     <div className="flex justify-between">
//                       <div>
//                         <h3 className="font-semibold">{ca.title}</h3>
//                         <p className="text-sm text-gray-500">{ca.date} | {ca.category}</p>
//                         <p className="text-gray-600 mt-2 line-clamp-2">{ca.content?.substring(0, 150)}...</p>
//                       </div>
//                       <div className="flex gap-2">
//                         <button onClick={() => { setEditingItem(ca); setFormData(ca); setShowModal(true); }} className="px-3 py-1 bg-yellow-500 text-white rounded text-sm">Edit</button>
//                         <button onClick={() => handleDelete(ca._id)} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Delete</button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Users Management */}
//         {activeTab === 'users' && (
//           <div className="bg-white rounded-xl shadow overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">User</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Instagram</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Score</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Quizzes</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Joined</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {users.map(user => (
//                     <tr key={user._id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-3">
//                           <img src={user.profileImage} className="w-10 h-10 rounded-full" alt={user.name} />
//                           <div><p className="font-medium">{user.name}</p></div>
//                         </div>
//                        </td>
//                       <td className="px-6 py-4">@{user.instagramId}</td>
//                       <td className="px-6 py-4 font-semibold text-blue-600">{user.score || 0}</td>
//                       <td className="px-6 py-4">{user.totalQuizzesTaken || 0}</td>
//                       <td className="px-6 py-4 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               {users.length === 0 && <div className="p-8 text-center"><p className="text-gray-500">No users yet</p></div>}
//             </div>
//           </div>
//         )}

//         {/* Quiz Results */}
//         {activeTab === 'results' && (
//           <div className="bg-white rounded-xl shadow overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">User</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Instagram</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Score</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Percentage</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Date</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {quizResults.map(result => (
//                     <tr key={result._id} className="hover:bg-gray-50">
//                       <td className="px-4 py-3">{result.userName}</td>
//                       <td className="px-4 py-3">@{result.instagramId}</td>
//                       <td className="px-4 py-3 font-bold text-blue-600">{result.score}/{result.totalQuestions}</td>
//                       <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs ${result.percentage >= 70 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{result.percentage}%</span></td>
//                       <td className="px-4 py-3 text-sm">{new Date(result.date || result.createdAt).toLocaleDateString()}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               {quizResults.length === 0 && <div className="p-8 text-center"><p className="text-gray-500">No quiz results yet</p></div>}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Add/Edit Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-2xl font-bold">{editingItem ? 'Edit' : 'Add'} {activeTab === 'qa-questions' ? 'Q&A Question' : activeTab}</h2>
//                 <button onClick={() => { setShowModal(false); setEditingItem(null); }} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
//               </div>
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 {getFormFields()}
//                 <div className="flex gap-3 pt-4">
//                   <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button>
//                   <button type="button" onClick={() => { setShowModal(false); setEditingItem(null); }} className="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Explanation Editor Modal */}
//       {showExplanationModal && explanationQuestion && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl max-w-2xl w-full">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-2xl font-bold">📖 Edit Explanation</h2>
//                 <button onClick={() => { setShowExplanationModal(false); setExplanationQuestion(null); }} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
//               </div>
              
//               <div className="mb-4 p-4 bg-gray-50 rounded-lg">
//                 <p className="text-sm font-semibold text-gray-700">Question:</p>
//                 <p className="text-gray-800 mt-1">{explanationQuestion.question}</p>
//                 <p className="text-sm text-green-600 mt-2">✓ Correct Answer: {explanationQuestion.answer}</p>
//               </div>
              
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-2">Explanation (What users see after answering)</label>
//                 <textarea 
//                   className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" 
//                   rows="6"
//                   value={explanationText}
//                   onChange={(e) => setExplanationText(e.target.value)}
//                   placeholder="Explain why this answer is correct. Include key points for learning..."
//                 />
//                 <p className="text-xs text-gray-400 mt-2">
//                   💡 Tip: A good explanation helps students understand the concept, not just the answer.
//                 </p>
//               </div>
              
//               <div className="flex gap-3 pt-4">
//                 <button onClick={handleUpdateExplanation} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//                   💾 Save Explanation
//                 </button>
//                 <button onClick={() => { setShowExplanationModal(false); setExplanationQuestion(null); }} className="flex-1 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
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
            <textarea className="w-full p-2 border rounded-lg bg-blue-50" rows="4" value={formData.explanation || ''} onChange={(e) => setFormData({ ...formData, explanation: e.target.value })} placeholder="Explain why this answer is correct. This helps students learn from their mistakes." />
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
            <button onClick={() => setActiveTab('dashboard')} className={`px-5 py-2 rounded-lg font-medium capitalize whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>📊 Dashboard</button>
            <button onClick={() => setActiveTab('questions')} className={`px-5 py-2 rounded-lg font-medium capitalize whitespace-nowrap ${activeTab === 'questions' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>❓ Quiz Questions ({questions.length})</button>
            <button onClick={() => setActiveTab('qa-questions')} className={`px-5 py-2 rounded-lg font-medium capitalize whitespace-nowrap ${activeTab === 'qa-questions' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>📝 Q&A Bank ({qaQuestions.length})</button>
            <button onClick={() => setActiveTab('notes')} className={`px-5 py-2 rounded-lg font-medium capitalize whitespace-nowrap ${activeTab === 'notes' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>📚 Study Notes ({notes.length})</button>
            <button onClick={() => setActiveTab('current-affairs')} className={`px-5 py-2 rounded-lg font-medium capitalize whitespace-nowrap ${activeTab === 'current-affairs' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>📰 Current Affairs ({currentAffairs.length})</button>
            <button onClick={() => setActiveTab('users')} className={`px-5 py-2 rounded-lg font-medium capitalize whitespace-nowrap ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>👥 Users ({users.length})</button>
            <button onClick={() => setActiveTab('results')} className={`px-5 py-2 rounded-lg font-medium capitalize whitespace-nowrap ${activeTab === 'results' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>📋 Results ({quizResults.length})</button>
          </div>
        </div>
      </div>

      {/* Main Content - No loading indicators */}
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
              <div className="bg-white rounded-xl shadow p-12 text-center"><div className="text-6xl mb-4">❓</div><p className="text-gray-500">No questions yet. Click "Add Question" to create one.</p></div>
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
                            <p className="text-xs font-semibold text-blue-800 mb-1">📖 Explanation:</p>
                            <p className="text-sm text-blue-700">{q.explanation}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <button onClick={() => { setEditingItem(q); setFormData(q); setShowModal(true); }} className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600">✏️ Edit</button>
                        <button onClick={() => { setExplanationQuestion(q); setExplanationText(q.explanation || ''); setShowExplanationModal(true); }} className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600">📖 Explanation</button>
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
              <p className="text-sm text-gray-500">Total: {notes.length} notes</p>
            </div>
            {notes.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-12 text-center"><div className="text-6xl mb-4">📚</div><p className="text-gray-500">No notes yet. Click "Add Note" to create one.</p></div>
            ) : (
              <div className="space-y-4">
                {notes.map(note => (
                  <div key={note._id} className="bg-white rounded-lg shadow p-5">
                    <div className="flex justify-between">
                      <div><h3 className="font-semibold">{note.title}</h3><p className="text-sm text-gray-500">{note.category}</p><p className="text-gray-600 mt-2 line-clamp-2">{note.content?.substring(0, 150)}...</p></div>
                      <div className="flex gap-2"><button onClick={() => { setEditingItem(note); setFormData(note); setShowModal(true); }} className="px-3 py-1 bg-yellow-500 text-white rounded text-sm">Edit</button><button onClick={() => handleDelete(note._id)} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Delete</button></div>
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
            <div className="flex justify-between items-center mb-4"><button onClick={() => { setShowModal(true); setEditingItem(null); setFormData({}); }} className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">➕ Add Current Affairs</button><p className="text-sm text-gray-500">Total: {currentAffairs.length} items</p></div>
            {currentAffairs.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-12 text-center"><div className="text-6xl mb-4">📰</div><p className="text-gray-500">No current affairs yet. Click "Add Current Affairs" to create one.</p></div>
            ) : (
              <div className="space-y-4">{currentAffairs.map(ca => (<div key={ca._id} className="bg-white rounded-lg shadow p-5"><div className="flex justify-between"><div><h3 className="font-semibold">{ca.title}</h3><p className="text-sm text-gray-500">{ca.date} | {ca.category}</p><p className="text-gray-600 mt-2 line-clamp-2">{ca.content?.substring(0, 150)}...</p></div><div className="flex gap-2"><button onClick={() => { setEditingItem(ca); setFormData(ca); setShowModal(true); }} className="px-3 py-1 bg-yellow-500 text-white rounded text-sm">Edit</button><button onClick={() => handleDelete(ca._id)} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Delete</button></div></div></div>))}</div>
            )}
          </div>
        )}

        {/* Users Management */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">User</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Instagram</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Score</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Quizzes</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Joined</th></tr></thead>
                <tbody>{users.map(user => (<tr key={user._id} className="hover:bg-gray-50"><td className="px-6 py-4"><div className="flex items-center gap-3"><img src={user.profileImage} className="w-10 h-10 rounded-full" alt={user.name} /><div><p className="font-medium">{user.name}</p></div></div></td><td className="px-6 py-4">@{user.instagramId}</td><td className="px-6 py-4 font-semibold text-blue-600">{user.score || 0}</td><td className="px-6 py-4">{user.totalQuizzesTaken || 0}</td><td className="px-6 py-4 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td></tr>))}</tbody>
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
                <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">User</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Instagram</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Score</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Percentage</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Date</th></tr></thead>
                <tbody>{quizResults.map(result => (<tr key={result._id} className="hover:bg-gray-50"><td className="px-4 py-3">{result.userName}</td><td className="px-4 py-3">@{result.instagramId}</td><td className="px-4 py-3 font-bold text-blue-600">{result.score}/{result.totalQuestions}</td><td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs ${result.percentage >= 70 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{result.percentage}%</span></td><td className="px-4 py-3 text-sm">{new Date(result.date || result.createdAt).toLocaleDateString()}</td></tr>))}</tbody>
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