'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdSenseBanner from '@/components/AdSenseBanner';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', subject: '', message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'kexampro@gmail.com';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      <AdSenseBanner adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT} className="mx-4 mt-2" />
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 pt-8 pb-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-3">📞</div>
          <h1 className="text-3xl font-bold">Contact Us</h1>
          <p className="text-green-100 text-sm mt-2">We'd love to hear from you!</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">✉️ Send us a Message</h2>
            {submitted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-green-700 text-sm">✅ Thank you! We'll get back to you soon.</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                <input required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea required rows="4" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg"></textarea>
              </div>
              <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition">Send Message 📨</button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📍 Get in Touch</h2>
            <div className="space-y-4">
              <div><span className="text-2xl">📧</span> {contactEmail}</div>
              <div><span className="text-2xl">📱</span> Follow us on Instagram</div>
              <div><span className="text-2xl">⏰</span> Support Hours: Mon-Fri 9AM-6PM</div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition">← Back to Home</Link>
        </div>
      </div>

      <AdSenseBanner adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT} className="mx-4 mt-8 mb-4" />
    </div>
  );
}
