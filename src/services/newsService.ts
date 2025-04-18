import { ErrorResponse } from "./authService";

// Mock data
let mockNews = [
  {
    id: "1",
    title: "New Hair Treatment Available",
    content: "Introducing our latest deep-conditioning hair treatment. Book your appointment today!",
    highlight: true,
    createdAt: "2025-02-27T00:00:00.000Z"
  }
];

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  highlight: boolean;
  createdAt: string;
}

export const getNews = async () => {
  try {
    // Return mock data instead of making API call
    return mockNews;
    
    // Actual API call (commented out for now)
    // const response = await api.get("/news");
    // return response.data;
  } catch (error) {
    throw error as ErrorResponse;
  }
};

export const createNews = async (newsData: Omit<NewsItem, "id" | "createdAt">) => {
  try {
    const newNews = {
      id: (mockNews.length + 1).toString(),
      ...newsData,
      createdAt: new Date().toISOString()
    };
    
    mockNews.unshift(newNews); // Add to beginning of array
    return newNews;
    
    // Actual API call (commented out for now)
    // const response = await api.post("/news", newsData);
    // return response.data;
  } catch (error) {
    throw error as ErrorResponse;
  }
};

export const updateNews = async (id: string, newsData: Partial<NewsItem>) => {
  try {
    const index = mockNews.findIndex(news => news.id === id);
    if (index !== -1) {
      mockNews[index] = { ...mockNews[index], ...newsData };
      return mockNews[index];
    }
    throw new Error("News not found");
    
    // Actual API call (commented out for now)
    // const response = await api.put(`/news/${id}`, newsData);
    // return response.data;
  } catch (error) {
    throw error as ErrorResponse;
  }
};

export const deleteNews = async (id: string) => {
  try {
    const index = mockNews.findIndex(news => news.id === id);
    if (index !== -1) {
      mockNews = mockNews.filter(news => news.id !== id);
      return true;
    }
    throw new Error("News not found");
    
    // Actual API call (commented out for now)
    // await api.delete(`/news/${id}`);
    // return true;
  } catch (error) {
    throw error as ErrorResponse;
  }
};
