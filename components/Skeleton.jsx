'use client';

export const ProfileSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 pt-8 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-28 h-28 bg-white/20 rounded-full animate-pulse"></div>
          <div className="flex-1 text-center md:text-left">
            <div className="h-8 w-48 bg-white/20 rounded-lg animate-pulse mx-auto md:mx-0"></div>
            <div className="h-5 w-32 bg-white/20 rounded-lg animate-pulse mt-2 mx-auto md:mx-0"></div>
          </div>
        </div>
      </div>
    </div>
    <div className="max-w-4xl mx-auto px-5 -mt-6">
      <div className="bg-white rounded-2xl shadow-xl p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="text-center p-3">
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mx-auto"></div>
              <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mt-2 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const LeaderboardSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
    <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-5 pt-8 pb-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-white/20 rounded-full animate-pulse mx-auto"></div>
        <div className="h-8 w-48 bg-white/20 rounded-lg animate-pulse mt-4 mx-auto"></div>
      </div>
    </div>
    <div className="max-w-md mx-auto px-4 mt-8">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex justify-center gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="text-center w-24">
              <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse mx-auto"></div>
              <div className="h-4 w-12 bg-gray-200 rounded animate-pulse mt-2 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const NotesSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
    <div className="bg-gradient-to-r from-green-600 to-green-700 px-5 pt-8 pb-6">
      <div className="max-w-6xl mx-auto text-center">
        <div className="w-20 h-20 bg-white/20 rounded-2xl animate-pulse mx-auto"></div>
        <div className="h-8 w-48 bg-white/20 rounded-lg animate-pulse mt-4 mx-auto"></div>
      </div>
    </div>
    <div className="max-w-6xl mx-auto px-5 mt-4">
      <div className="bg-white rounded-2xl shadow-lg p-3">
        <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    </div>
    <div className="max-w-6xl mx-auto px-5 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1,2,3].map(i => (
          <div key={i} className="bg-white rounded-xl shadow-md p-4">
            <div className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const CurrentAffairsSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
    <div className="bg-gradient-to-r from-orange-600 to-red-600 px-5 pt-8 pb-6">
      <div className="max-w-6xl mx-auto text-center">
        <div className="w-20 h-20 bg-white/20 rounded-2xl animate-pulse mx-auto"></div>
        <div className="h-8 w-48 bg-white/20 rounded-lg animate-pulse mt-4 mx-auto"></div>
      </div>
    </div>
    <div className="max-w-6xl mx-auto px-5 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1,2,3].map(i => (
          <div key={i} className="bg-white rounded-xl shadow-md p-4">
            <div className="h-40 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const HomeSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
    {/* Hero Section */}
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 pt-8 pb-10">
      <div className="text-center">
        <div className="w-14 h-14 bg-white/20 rounded-2xl animate-pulse mx-auto"></div>
        <div className="h-8 w-48 bg-white/20 rounded-lg animate-pulse mt-3 mx-auto"></div>
        <div className="h-4 w-64 bg-white/20 rounded animate-pulse mt-2 mx-auto"></div>
      </div>
    </div>
    
    {/* Category Cards */}
    <div className="max-w-6xl mx-auto px-5 mt-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-white rounded-2xl shadow-md p-4 text-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse mx-auto"></div>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mt-2 mx-auto"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const QuizSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-5 pt-8 pb-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-white/20 rounded-2xl animate-pulse mx-auto"></div>
        <div className="h-8 w-32 bg-white/20 rounded-lg animate-pulse mt-4 mx-auto"></div>
      </div>
    </div>
    <div className="max-w-4xl mx-auto px-5 py-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="space-y-6">
          {[1,2,3].map(i => (
            <div key={i} className="border-b pb-4">
              <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse mb-3"></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
