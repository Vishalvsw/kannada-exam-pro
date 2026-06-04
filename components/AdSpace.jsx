'use client';

export default function AdSpace({ type = 'banner', className = '' }) {
  
  // Native Ad Style (Blends with content)
  if (type === 'native') {
    return (
      <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 text-xl">📘</span>
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Sponsored</p>
            <p className="text-sm font-medium text-blue-800">Karnataka Exam Prep</p>
            <p className="text-[10px] text-gray-500">Study materials & mock tests</p>
          </div>
          <button className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 transition">
            Learn More →
          </button>
        </div>
        <p className="text-[9px] text-gray-400 text-center mt-2">Advertisement</p>
      </div>
    );
  }
  
  // Banner Ad Style (Default)
  const adStyles = {
    banner: 'h-24 md:h-16',
    sidebar: 'h-60 w-full',
    inArticle: 'h-32 my-4',
  };

  const adColors = {
    banner: 'from-blue-50 to-indigo-50',
    sidebar: 'from-purple-50 to-pink-50',
    inArticle: 'from-green-50 to-teal-50',
  };

  const adMessages = {
    banner: '📢 Your Ad Here',
    sidebar: '📢 Sponsor Message',
    inArticle: '📢 Recommended for you',
  };

  const heightClass = adStyles[type] || adStyles.banner;
  const bgColor = adColors[type] || adColors.banner;
  const message = adMessages[type] || adMessages.banner;

  return (
    <div className={`ad-space ${heightClass} ${className}`}>
      <div className={`bg-gradient-to-r ${bgColor} rounded-xl border border-gray-200 overflow-hidden h-full`}>
        <div className="flex items-center justify-center h-full p-3">
          <div className="text-center">
            <p className="text-[10px] text-gray-400 mb-1">Advertisement</p>
            <p className="text-sm text-gray-500 font-medium">{message}</p>
            <p className="text-[10px] text-gray-400 mt-1">Support Kannada Exam Pro</p>
          </div>
        </div>
      </div>
    </div>
  );
}