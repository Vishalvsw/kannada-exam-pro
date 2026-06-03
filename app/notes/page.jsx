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
                <span className="text-5xl animate-pulse"></span>
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