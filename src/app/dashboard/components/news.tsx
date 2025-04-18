import { useState } from "react";
import { FiCalendar, FiClock } from "react-icons/fi";

interface NewsItem {
  id: string;
  title: string;
  date: string;
  time: string;
  author: string;
  category: string;
}

export default function News() {
  const [news] = useState<NewsItem[]>([
    {
      id: "1",
      title: "New Hair Treatment Available",
      date: "2024-03-15",
      time: "10:00 AM",
      author: "Sarah Johnson",
      category: "Services"
    },
    {
      id: "2",
      title: "Holiday Special Offers",
      date: "2024-03-14",
      time: "02:30 PM",
      author: "Mike Wilson",
      category: "Promotions"
    },
    {
      id: "3",
      title: "Staff Training Schedule",
      date: "2024-03-13",
      time: "09:00 AM",
      author: "Lisa Brown",
      category: "Internal"
    }
  ]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-gray-700 font-semibold">Title</th>
            <th className="text-left py-3 px-4 text-gray-700 font-semibold">Date</th>
            <th className="text-left py-3 px-4 text-gray-700 font-semibold">Time</th>
            <th className="text-left py-3 px-4 text-gray-700 font-semibold">Author</th>
            <th className="text-left py-3 px-4 text-gray-700 font-semibold">Category</th>
          </tr>
        </thead>
        <tbody>
          {news.map((item) => (
            <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4">
                <span className="text-gray-800 font-medium">{item.title}</span>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center text-gray-700">
                  <FiCalendar className="w-4 h-4 mr-2" />
                  {new Date(item.date).toLocaleDateString()}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center text-gray-700">
                  <FiClock className="w-4 h-4 mr-2" />
                  {item.time}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3 text-gray-700 font-medium">
                    {item.author.charAt(0)}
                  </div>
                  <span className="text-gray-800 font-medium">{item.author}</span>
                </div>
              </td>
              <td className="py-3 px-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.category === 'Services' ? 'bg-blue-100 text-blue-700' :
                  item.category === 'Promotions' ? 'bg-purple-100 text-purple-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {item.category}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
