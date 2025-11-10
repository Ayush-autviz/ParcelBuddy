import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getPublishedRides } from '../services/api/ride';
import { RideCardData, StatusType } from '../components/track/RideCard';

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

export const usePublishedRides = (): UseQueryResult<RideCardData[], Error> => {
  return useQuery({
    queryKey: ['publishedRides'],
    queryFn: async () => {
      const response = await getPublishedRides();
      
      if (!Array.isArray(response)) {
        return [];
      }

      return response.map((ride: PublishedRideResponse) => {
        // Format date: "2025-11-07" -> "Nov 07"
        const formatDate = (dateString: string): string => {
          const date = new Date(dateString);
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const month = months[date.getMonth()];
          const day = date.getDate().toString().padStart(2, '0');
          return `${month} ${day}`;
        };

        // Format time: "16:45:03" -> "4:45 PM"
        const formatTime = (timeString: string): string => {
          const [hours, minutes] = timeString?.split(':');
          const hour = parseInt(hours, 10);
          const ampm = hour >= 12 ? 'PM' : 'AM';
          const displayHour = hour % 12 || 12;
          const displayMinutes = minutes.padStart(2, '0');
          return `${displayHour}:${displayMinutes} ${ampm}`;
        };

        // Map status: "active" -> "new", or determine based on other fields
        const mapStatus = (status: string, viewsCount: number): StatusType => {
          if (status === 'active') {
            // You might want to add logic here based on views_count or other fields
            // For now, defaulting to 'new'
            return 'new';
          }
          // Add other status mappings as needed
          return 'new';
        };

        // Determine if rate button should be shown (for completed rides)
        const isCompleted = ride.status === 'completed' || ride.status === 'finished';
        const showRate = isCompleted;

        return {
          id: ride.id,
          status: mapStatus(ride.status, ride.views_count),
          date: formatDate(ride.travel_date),
          origin: ride.origin_name,
          originTime: formatTime(ride.travel_time),
          destination: ride.destination_name,
          destinationTime: formatTime(ride.destination_time),
          passengers: 0, // Not available in API, set to 0 or calculate if needed
          showRateButton: showRate,
        } as RideCardData;
      });
    },
    staleTime: 30000, // Cache for 30 seconds
    retry: 1,
  });
};

