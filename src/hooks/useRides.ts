import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getPublishedRides } from '../services/api/ride';
import { RideCardData, StatusType } from '../components/track';

export interface PublishedRideResponse {
  id: string;
  traveler: any;
  origin_name: string;
  origin_lat: string;
  origin_lng: string;
  destination_name: string;
  destination_lat: string;
  destination_lng: string;
  travel_date: string;
  travel_time: string;
  available_weight_kg: string;
  price_per_kg: string;
  is_price_negotiable: boolean;
  status: string;
  views_count: number;
  distance_km: number | null;
  created_on: string;
  destination_date: string;
  destination_time: string;
}

// Interface for paginated published rides response
export interface PaginatedPublishedRidesResponse {
  rides: RideCardData[];
  pagination: {
    next_page: string | null;
    current_page: number;
    total_pages: number;
    total_records: number;
  } | null;
}

export const usePublishedRides = (): UseQueryResult<PaginatedPublishedRidesResponse, Error> => {
  return useQuery({
    queryKey: ['publishedRides'],
    queryFn: async () => {
      const response = await getPublishedRides();
      
      // Check if response has pagination structure
      const hasPagination = response?.pagination && response?.results;
      const ridesArray = hasPagination 
        ? response.results 
        : (Array.isArray(response) ? response : (response?.data || response?.results || []));
      
      if (!Array.isArray(ridesArray)) {
        console.warn('getPublishedRides: Expected array but got:', typeof response, response);
        return {
          rides: [],
          pagination: null,
        };
      }

      const rides = ridesArray.map((ride: PublishedRideResponse) => {
        // Format date: "2025-11-07" -> "Nov 07"
        const formatDate = (dateString: string): string => {
          if (!dateString) {
            return 'Invalid Date';
          }
          const date = new Date(dateString);
          if (isNaN(date.getTime())) {
            return 'Invalid Date';
          }
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const month = months[date.getMonth()];
          const day = date.getDate().toString().padStart(2, '0');
          return `${month} ${day}`;
        };

        // Format time: "16:45:03" -> "4:45 PM"
        const formatTime = (timeString: string): string => {
          if (!timeString) {
            return '12:00 AM'; // Default time if missing
          }
          const timeParts = timeString.split(':');
          const hours = timeParts[0] || '0';
          const minutes = timeParts[1] || '0';
          const hour = parseInt(hours, 10);
          const ampm = hour >= 12 ? 'PM' : 'AM';
          const displayHour = hour % 12 || 12;
          const displayMinutes = minutes.padStart(2, '0');
          return `${displayHour}:${displayMinutes} ${ampm}`;
        };

        const showRate = ride.status === 'completed' ? true : false;



        return {
          id: ride.id || '',
          status: ride.status,
          date: formatDate(ride.travel_date),
          origin: ride.origin_name || 'Unknown Origin',
          originTime: formatTime(ride.travel_time),
          destination: ride.destination_name || 'Unknown Destination',
          destinationTime: formatTime(ride.destination_time),
          passengers: 0, // Not available in API, set to 0 or calculate if needed
          showRateButton: showRate,
          requestCount: ride.total_request_count || 0,
        } as RideCardData;
      });

      return {
        rides,
        pagination: hasPagination ? {
          next_page: response.pagination.next_page,
          current_page: response.pagination.current_page,
          total_pages: response.pagination.total_pages,
          total_records: response.pagination.total_records,
        } : null,
      };
    },
    staleTime: 30000, // Cache for 30 seconds
    retry: 1,
  });
};

