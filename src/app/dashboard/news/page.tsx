"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { format } from "date-fns";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
  published: boolean;
}

// Sample news data
const sampleNews: NewsItem[] = [
  {
    id: "1",
    title: "New Hair Treatment Available",
    content:
      "Introducing our latest deep-conditioning hair treatment. Book your appointment today!",
    publishedAt: "2025-02-27",
    published: true,
  },
  {
    id: "2",
    title: "Holiday Hours Update",
    content:
      "Our salon will have modified hours during the upcoming holiday weekend. Check our website for details.",
    publishedAt: "2025-02-15",
    published: true,
  },
  {
    id: "3",
    title: "New Stylist Joining Our Team",
    content:
      "We're excited to welcome Sarah Johnson to our team of expert stylists. She specializes in natural hair care and protective styles.",
    publishedAt: "2025-02-10",
    published: true,
  },
  {
    id: "4",
    title: "Spring Collection Preview",
    content:
      "Get a sneak peek at our upcoming spring collection featuring the latest trends in braiding and styling.",
    publishedAt: "2025-02-05",
    published: false,
  },
];

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>(sampleNews);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<NewsItem | null>(null);
  const [currentNews, setCurrentNews] = useState<NewsItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/auth/login");
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleAddNews = () => {
    setCurrentNews({
      id: Date.now().toString(),
      title: "",
      content: "",
      publishedAt: format(new Date(), "yyyy-MM-dd"),
      published: false,
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleEditNews = (newsItem: NewsItem) => {
    setCurrentNews({ ...newsItem });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteNews = (id: string) => {
    const newsItem = news.find((item) => item.id === id);
    if (newsItem) {
      setNewsToDelete(newsItem);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = () => {
    if (!newsToDelete) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setNews(news.filter((item) => item.id !== newsToDelete.id));
      setIsLoading(false);
      setIsDeleteModalOpen(false);
      setNewsToDelete(null);
    }, 500);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setNewsToDelete(null);
  };

  const handleSaveNews = () => {
    if (!currentNews) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (isEditing) {
        // Update existing news
        setNews(
          news.map((item) => (item.id === currentNews.id ? currentNews : item))
        );
      } else {
        // Add new news
        setNews([currentNews, ...news]);
      }

      setIsLoading(false);
      setIsModalOpen(false);
      setCurrentNews(null);
      setIsEditing(false);
    }, 500);
  };

  const handleTogglePublish = (id: string) => {
    setNews(
      news.map((item) =>
        item.id === id ? { ...item, published: !item.published } : item
      )
    );
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="relative rounded-xl overflow-hidden shadow-md">
        <div 
          className="h-32 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20 flex flex-col justify-center p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              News Management
            </h1>
            <p className="text-gray-100 text-sm md:text-base max-w-2xl">
              Create and manage news announcements for your clients
            </p>
          </div>
        </div>
        
        <button
          onClick={handleAddNews}
          className="absolute bottom-3 right-3 bg-white text-black p-2 rounded-full shadow-lg hover:bg-gray-100 transition-all transform hover:scale-105"
          aria-label="Add news"
          title="Add news"
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>

      {/* News List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8"
                  >
                    Actions
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8"
                  >
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {news.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-500 line-clamp-3 ">
                        {item.content}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {format(new Date(item.publishedAt), "MMM d, yyyy")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.published
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleTogglePublish(item.id)}
                          className={`text-sm ${
                            item.published
                              ? "text-yellow-600 hover:text-yellow-900"
                              : "text-green-600 hover:text-green-900"
                          }`}
                        >
                          {item.published ? "Unpublish" : "Publish"}
                        </button>
                        <button
                          onClick={() => handleEditNews(item)}
                          className="text-blue-600 hover:text-blue-900"
                          aria-label="Edit news item"
                          title="Edit news item"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleDeleteNews(item.id)}
                        className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-md text-sm font-medium flex items-center justify-center mx-auto"
                        aria-label={`Delete ${
                          item.published ? "published" : "draft"
                        } news item`}
                        title={`Delete ${
                          item.published ? "published" : "draft"
                        } news item`}
                      >
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && newsToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <TrashIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete {newsToDelete.published ? "Published" : "Draft"} News Item
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this {newsToDelete.published ? "published" : "draft"} news item? This action cannot be undone.
                      </p>
                      <div className="mt-4 bg-gray-50 p-4 rounded-md">
                        <p className="text-sm font-medium text-gray-900">{newsToDelete.title}</p>
                        <p className="text-sm text-gray-500 mt-1">{format(new Date(newsToDelete.publishedAt), "MMM d, yyyy")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={isLoading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
                <button
                  type="button"
                  onClick={cancelDelete}
                  disabled={isLoading}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* News Modal */}
      {isModalOpen && currentNews && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      {isEditing ? "Edit News Item" : "Add News Item"}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="title"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Title
                        </label>
                        <input
                          type="text"
                          id="title"
                          value={currentNews.title}
                          onChange={(e) =>
                            setCurrentNews({
                              ...currentNews,
                              title: e.target.value,
                            })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="content"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Content
                        </label>
                        <textarea
                          id="content"
                          rows={4}
                          value={currentNews.content}
                          onChange={(e) =>
                            setCurrentNews({
                              ...currentNews,
                              content: e.target.value,
                            })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="date"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Date
                        </label>
                        <input
                          type="date"
                          id="date"
                          value={currentNews.publishedAt}
                          onChange={(e) =>
                            setCurrentNews({
                              ...currentNews,
                              publishedAt: e.target.value,
                            })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          id="published"
                          type="checkbox"
                          checked={currentNews.published}
                          onChange={(e) =>
                            setCurrentNews({
                              ...currentNews,
                              published: e.target.checked,
                            })
                          }
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="published"
                          className="ml-2 block text-sm text-gray-900"
                        >
                          Publish immediately
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSaveNews}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setCurrentNews(null);
                    setIsEditing(false);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
