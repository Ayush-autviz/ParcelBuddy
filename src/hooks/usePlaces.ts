import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getPlaces } from '../services/api/places';
import { PlaceResultItemData } from '../components/search/PlaceResultItem';

export const usePlaces = (
  query: string,
  isDomestic: boolean,
  enabled: boolean = false
): UseQueryResult<PlaceResultItemData[], Error> => {
  const trimmedQuery = query.trim();
  const shouldFetch = enabled && trimmedQuery.length >= 2;

  return useQuery({
    queryKey: ['places', trimmedQuery, isDomestic],
    queryFn: async () => {
      const response = await getPlaces(trimmedQuery, isDomestic);

      // Handle different response formats
      if (Array.isArray(response)) {
        return response.map((item: any) => ({
          id: item.id?.toString() || Math.random().toString(),
          name: item.name || item.place_name || item.address || '',
          address: item.address || item.place_name || '',
          city: item.city || '',
          country: item.country || '',
        }));
      }

      if (response?.results && Array.isArray(response.results)) {
        return response.results.map((item: any) => ({
          id: item.id?.toString() || Math.random().toString(),
          name: item.name || item.place_name || item.address || '',
          address: item.address || item.place_name || '',
          city: item.city || '',
          country: item.country || '',
        }));
      }

      return [];
    },
    enabled: shouldFetch,
    staleTime: 30000,
    retry: 1,
  });
};

