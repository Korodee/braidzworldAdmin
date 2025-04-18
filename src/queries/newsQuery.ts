import { getNews } from "@/services/newsService";
import { useQuery } from "@tanstack/react-query";

export const useGetNews = () => {
    return useQuery({
        queryKey: ["news"],
        queryFn: getNews,
    });
};

