'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdSpace from '@/components/AdSpace';
import AnswerExplanation from '@/components/AnswerExplanation';

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [qaQuestions, setQaQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('qa');
  const [selectedSubject, setSelectedSubject] = useState('all');

  useEffect(() => {
    fetchNotes();
    fetchQAQuestions();
  }, []);
  
  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/notes');
      const data = await response.json();
      setNotes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setNotes([]);
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

  // Get unique subjects for filtering
  const subjects = [...new Set(notes.map(note => note.subject).filter(Boolean))];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = searchTerm === '' || 
                          note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          note.title_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          note.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || note.subject === selectedSubject;
    return matchesSearch && matchesSubject;
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

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-5 pt-8 pb-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 animate-bounce">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300">
                <span className="text-5xl animate-pulse">📖</span>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Study Material</h1>
              <p className="text-green-100 text-sm mt-1">Learn & Practice for Karnataka Exams</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rich Content Section - Visible to Crawlers */}
      <div className="max-w-6xl mx-auto px-5 py-6 bg-white rounded-xl shadow-sm mt-4">
        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Comprehensive Study Material for Karnataka Competitive Exams
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Prepare for <strong>KAS, PSI, PDO, FDA, SDA</strong> and other Karnataka 
            state government exams with our curated study materials. Our notes cover 
            all essential subjects including Kannada grammar, reasoning, quantitative 
            aptitude, general knowledge, and Karnataka history.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <span className="text-2xl">📚</span>
              <p className="text-xs font-semibold mt-1">Kannada Grammar</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <span className="text-2xl">📐</span>
              <p className="text-xs font-semibold mt-1">Reasoning</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg text-center">
              <span className="text-2xl">📊</span>
              <p className="text-xs font-semibold mt-1">Quantitative</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <span className="text-2xl">🏛️</span>
              <p className="text-xs font-semibold mt-1">Karnataka History</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
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
            ❓ Q&A ({qaQuestions.length})
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'notes'
                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            📖 Notes ({notes.length})
          </button>
        </div>
      </div>

      {/* Subject Filter - Only for Notes */}
      {activeTab === 'notes' && subjects.length > 0 && (
        <div className="max-w-6xl mx-auto px-5 mt-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedSubject('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                selectedSubject === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              All Subjects
            </button>
            {subjects.map(subject => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  selectedSubject === subject
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="max-w-6xl mx-auto px-5 mt-4">
        <div className="bg-white rounded-2xl shadow-lg p-3">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xl">🔍</span>
            <input
              type="text"
              placeholder={activeTab === 'notes' ? "Search notes by title or content..." : "Search Q&A..."}
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

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-5 py-6">
        {activeTab === 'qa' ? (
          filteredQA.length > 0 ? (
            <div className="space-y-3">
              <div className="text-sm text-gray-500 mb-3">
                Showing {filteredQA.length} Q&A {searchTerm && `matching "${searchTerm}"`}
              </div>
              {filteredQA.map((qa, index) => (
                <div key={qa._id || index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="border-l-4 border-green-500 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-sm leading-relaxed mb-2">
                          {qa.question || qa.question_en}
                        </h3>
                        {qa.subject && (
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full mb-2 inline-block">
                            📖 {qa.subject}
                          </span>
                        )}
                        <details className="group">
                          <summary className="cursor-pointer inline-flex items-center gap-1 text-green-600 text-xs font-semibold hover:text-green-700 transition">
                            <span className="text-sm">📖</span>
                            <span>Show Answer</span>
                            <svg className="w-3 h-3 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </summary>
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 mt-2 border border-green-100">
                            <div className="flex items-start gap-2">
                              <span className="text-green-600 text-sm">✓</span>
                              <div>
                                <p className="text-xs text-green-800 leading-relaxed font-medium">
                                  {qa.answer || qa.answer_en}
                                </p>
                                {qa.explanation && (
                                  <p className="text-xs text-gray-600 mt-2 pt-2 border-t border-green-200">
                                    <span className="font-semibold">💡 Explanation:</span> {qa.explanation}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </details>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
              <div className="text-6xl mb-4">❓</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Q&A Available</h3>
              <p className="text-gray-500 text-sm">Questions and answers will appear here once added.</p>
              <p className="text-gray-400 text-xs mt-2">Check back later for new content</p>
            </div>
          )
        ) : (
          filteredNotes.length > 0 ? (
            <>
              <div className="text-sm text-gray-500 mb-3">
                Showing {filteredNotes.length} notes {searchTerm && `matching "${searchTerm}"`}
                {selectedSubject !== 'all' && ` in "${selectedSubject}"`}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredNotes.map((note) => (
                  <Link key={note._id} href={`/notes/${note._id}`}>
                    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-1">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 text-white">
                        <div className="text-2xl">📖</div>
                        <h3 className="font-bold text-sm mt-2 line-clamp-2">{note.title}</h3>
                        {note.subject && (
                          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full inline-block mt-1">
                            {note.subject}
                          </span>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-gray-600 text-xs line-clamp-2">
                          {note.content?.substring(0, 80)}...
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-[10px] text-gray-400">📅 {new Date(note.createdAt).toLocaleDateString()}</span>
                          <button className="text-green-600 font-semibold text-xs group-hover:translate-x-1 transition">
                            Read →
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
              <div className="text-6xl mb-4">📖</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Notes Available</h3>
              <p className="text-gray-500 text-sm">Study notes will appear here once added.</p>
              <p className="text-gray-400 text-xs mt-2">Check back later for new content</p>
            </div>
          )
        )}
      </div>

      <AdSpace type="banner" className="mx-4 mt-6 mb-4" />

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 shadow-lg">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">🏠</span><span className="text-[10px]">Home</span>
          </Link>
          <Link href="/quiz" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">🎯</span><span className="text-[10px]">Quiz</span>
          </Link>
          <Link href="/notes" className="flex flex-col items-center text-green-600">
            <span className="text-xl">📖</span><span className="text-[10px]">Study</span>
          </Link>
          <Link href="/current-affairs" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">📰</span><span className="text-[10px]">Current</span>
          </Link>
          <Link href="/leaderboard" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">🏆</span><span className="text-[10px]">Rank</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">👤</span><span className="text-[10px]">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}