'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function CurrentAffairDetail() {
  const { id } = useParams();
  const [affair, setAffair] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchCurrentAffair();
    }
  }, [id]);

  const fetchCurrentAffair = async () => {
    try {
      const response = await fetch(`/api/current-affairs/${id}`);
      const data = await response.json();
      
      if (data && !data.error) {
        setAffair(data);
      } else {
        setError('Current affair not found');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load content');
    }
  };

  if (error || !affair) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-green-600 text-white px-5 pt-8 pb-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold">Current Affairs</h1>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-5 py-12 text-center">
          <div className="bg-red-50 rounded-xl p-8">
            <p className="text-red-600">{error || 'Content not found'}</p>
            <Link href="/current-affairs">
              <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-semibold">
                ← Back
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-green-600 text-white px-5 pt-8 pb-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/current-affairs" className="text-sm text-white/80 hover:text-white">
            ← Back to All
          </Link>
          <h1 className="text-2xl font-bold mt-3">{affair.title}</h1>
          {affair.date && (
            <p className="text-sm text-white/80 mt-2">
              {new Date(affair.date).toLocaleDateString('en-IN')}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-5 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {affair.content}
          </div>
          
          {affair.source && affair.source !== 'Admin' && (
            <div className="mt-4 pt-3 border-t text-sm text-gray-500">
              Source: {affair.source}
            </div>
          )}
          
          <div className="mt-4 pt-3 border-t text-sm text-gray-500">
            Category: {affair.category || 'General'}
            {affair.important && (
              <span className="ml-2 text-red-600">★ Important</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
