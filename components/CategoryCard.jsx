import Link from 'next/link';

export default function CategoryCard({ title, titleKn, icon, description, href, color }) {
  const colorClasses = {
    blue: 'bg-blue-500 hover:bg-blue-600',
    green: 'bg-green-500 hover:bg-green-600',
    purple: 'bg-purple-500 hover:bg-purple-600',
    orange: 'bg-orange-500 hover:bg-orange-600',
    red: 'bg-red-500 hover:bg-red-600',
  };

  return (
    <Link href={href}>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer">
        <div className={`${colorClasses[color]} p-6 text-white`}>
          <div className="text-5xl mb-3">{icon}</div>
          <h3 className="text-xl font-bold mb-1">{title}</h3>
          {titleKn && <p className="text-sm opacity-90">{titleKn}</p>}
        </div>
        <div className="p-4 bg-gray-50">
          <p className="text-gray-600 text-sm">{description}</p>
          <button className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700">
            Explore →
          </button>
        </div>
      </div>
    </Link>
  );
}
