'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CurrentAffairDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [affair, setAffair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchCurrentAffair();
    }
  }, [id]);

  const fetchCurrentAffair = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 mt-3">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !affair) {
    return (
      <div className="min-h-screen p-5">
        <div className="text-center py-10">
          <p className="text-red-600">{error || 'Content not found'}</p>
          <Link href="/current-affairs">
            <button className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm">
              ← Back
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-5">
        <div className="max-w-3xl mx-auto">
          <Link href="/current-affairs" className="text-sm text-white/80 hover:text-white">
            ← Back
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
      <div className="max-w-3xl mx-auto px-5 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {affair.content}
          </div>
          
          {affair.source && affair.source !== 'Admin' && (
            <div className="mt-6 pt-4 border-t text-sm text-gray-500">
              Source: {affair.source}
            </div>
          )}
          
          <div className="mt-6 pt-4 border-t text-sm text-gray-500">
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