'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdSenseBanner from '@/components/AdSenseBanner';

export default function NoteDetailPage({ params }) {
  const router = useRouter();
  const [note, setNote] = useState(null);

  useEffect(() => {
    fetchNote();
  }, [params.id]);

  const fetchNote = async () => {
    try {
      const res = await fetch(`/api/notes/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setNote(data);
      } else {
        router.push('/notes');
      }
    } catch (error) {
      console.error('Error fetching note:', error);
      router.push('/notes');
    }
  };

  if (!note) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AdSenseBanner className="mx-4 mt-2" />
      
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 pt-8 pb-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/notes" className="text-sm text-white/80 hover:text-white mb-4 inline-block">
            ← Back to Notes
          </Link>
          <h1 className="text-3xl font-bold">{note.title}</h1>
          <p className="text-green-100 text-sm mt-1">{note.category || 'General'}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {note.content}
            </p>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <Link href="/notes" className="text-blue-600 hover:underline">
              ← Back to all notes
            </Link>
          </div>
        </div>
      </div>

      <AdSenseBanner className="mx-4 mt-8 mb-4" />
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 shadow-lg">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">🏠</span><span className="text-[10px]">Home</span>
          </Link>
          <Link href="/quiz" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">🎯</span><span className="text-[10px]">Quiz</span>
          </Link>
          <Link href="/notes" className="flex flex-col items-center text-green-600">
            <span className="text-xl">📝</span><span className="text-[10px]">Notes</span>
          </Link>
          <Link href="/current-affairs" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">📰</span><span className="text-[10px]">Current</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-500 hover:text-green-600 transition">
            <span className="text-xl">👤</span><span className="text-[10px]">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
export const dynamic = 'force-dynamic';
