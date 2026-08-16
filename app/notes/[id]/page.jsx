'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AdSpace from '@/components/AdSpace';

export default function NoteDetailPage() {
  const { id } = useParams();
  const [note, setNote] = useState(null);

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
    }
  };


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
