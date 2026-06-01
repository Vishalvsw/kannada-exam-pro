'use client';

import { useState, useEffect } from 'react';

export default function NotificationPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState('default');

  useEffect(() => {
    // Check if user has already been asked
    const hasAsked = localStorage.getItem('notificationAsked');
    if (!hasAsked) {
      setTimeout(() => {
        setShowPopup(true);
      }, 3000); // Show after 3 seconds
    }

    // Check current permission status
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        // Show a test notification
        new Notification('Kannada Exam Pro', {
          body: 'You will now receive quiz notifications!',
          icon: '/favicon.ico',
        });
      }
    }
    localStorage.setItem('notificationAsked', 'true');
    setShowPopup(false);
  };

  const handleLater = () => {
    localStorage.setItem('notificationAsked', 'true');
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:bottom-4 md:max-w-sm z-50 animate-slide-up">
      <div className="bg-white rounded-2xl shadow-2xl p-4 border-l-4 border-blue-500">
        <div className="flex items-start gap-3">
          <div className="text-3xl">🔔</div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-800">Get Quiz Alerts!</h3>
            <p className="text-sm text-gray-600 mt-1">
              Allow notifications to receive instant alerts when new quizzes are available!
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={requestNotificationPermission}
                className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
              >
                Allow
              </button>
              <button
                onClick={handleLater}
                className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-300 transition"
              >
                Later
              </button>
            </div>
          </div>
          <button onClick={handleLater} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
