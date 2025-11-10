import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getRideSearchHistory } from '../services/api/ride';

export interface SearchHistoryItem {
  id: string;
  from: string;
  to: string;
  date: string;
}

export const useSearchHistory = (): UseQueryResult<SearchHistoryItem[], Error> => {
  return useQuery({
    queryKey: ['rideSearchHistory'],
    queryFn: async () => {
      const response = await getRideSearchHistory();
      
      if (!Array.isArray(response)) {
        return [];
      }

      return response.slice(0, 5).map((item: any) => {
        // Format date: "2025-11-10" -> "10 Nov 2025"
        const formatDate = (dateString: string): string => {
          try {
            const date = new Date(dateString);
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const month = months[date.getMonth()];
            const day = date.getDate();
            const year = date.getFullYear();
            return `${day} ${month} ${year}`;
          } catch (error) {
            // If date parsing fails, return the original string or a default
            return dateString || 'Date not available';
          }
        };

        return {
          id: item.id?.toString() || String(Date.now() + Math.random()),
          from: item.origin_name || '',
          to: item.destination_name || '',
          date: item.travel_date ? formatDate(item.travel_date) : 'Date not available',
        } as SearchHistoryItem;
      });
    },
    staleTime: 30000, // Cache for 30 seconds
    retry: 1,
  });
};

