import { useQuery, UseQueryResult, useMutation, UseMutationResult } from '@tanstack/react-query';
import { getLuggageRequestsForRide, createLuggageRequest, getLuggageRequests } from '../services/api/luggage';
import { LuggageRequestItemData } from '../components/track/LuggageRequestItem';
import { RideCardData, StatusType } from '../components/track';

export interface LuggageRequestResponse {
  id: string;
  sender?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
  };
  sender_name?: string;
  item_count?: number;
  items?: any[];
  [key: string]: any;
}

export const useLuggageRequestsForRide = (
  rideId: string | undefined
): UseQueryResult<LuggageRequestItemData[], Error> => {
  return useQuery({
    queryKey: ['luggageRequests', rideId],
    queryFn: async () => {
      if (!rideId) {
        throw new Error('Ride ID is required');
      }
      const response = await getLuggageRequestsForRide(rideId);
      
      if (!Array.isArray(response)) {
        return [];
      }

      return response.map((request: LuggageRequestResponse) => {
        // Extract sender name from various possible fields
        let senderName = '';
        if (request.sender_name) {
          senderName = request.sender_name;
        } else if (request.sender) {
          const firstName = request.sender.first_name || '';
          const lastName = request.sender.last_name || '';
          senderName = `${firstName} ${lastName}`.trim() || request.sender.email || request.sender.phone || 'Unknown';
        } else {
          senderName = 'Unknown';
        }

        // Extract item count
        const itemCount = request.item_count || (request.items && request.items.length) || 0;

        return {
          id: request.id,
          senderName,
          itemCount,
        } as LuggageRequestItemData;
      });
    },
    enabled: !!rideId, // Only fetch if rideId is provided
    staleTime: 30000, // Cache for 30 seconds
    retry: 1,
  });
};

export interface CreateLuggageRequestData {
  ride: string;
  weight_kg: number;
  length_cm: number;
  width_cm: number;
  height_cm: number;
  item_description: string;
  special_instructions?: string;
  offered_price: number;
  luggage_photos?: any[]; // Array of image files
}

export const useCreateLuggageRequest = (): UseMutationResult<any, Error, FormData, unknown> => {
  return useMutation({
    mutationFn: (data: FormData) => createLuggageRequest(data),
  });
};

// Interface for booked ride response (direct ride object)
export interface BookedRideResponse {
  id: string;
  traveler: {
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
    email: string | null;
    profile?: {
      profile_photo?: string | null;
      bio?: string;
      average_rating?: number;
    };
  };
  origin_name: string;
  origin_lat: string;
  origin_lng: string;
  destination_name: string;
  destination_lat: string;
  destination_lng: string;
  travel_date: string;
  travel_time: string | null;
  destination_date: string;
  destination_time: string | null;
  available_weight_kg: string;
  price_per_kg: string;
  status: string;
  views_count: number;
  created_on: string;
  [key: string]: any;
}

// Hook to get booked rides (luggage requests made by the user)
export const useBookedRides = (): UseQueryResult<RideCardData[], Error> => {
  return useQuery({
    queryKey: ['bookedRides'],
    queryFn: async () => {
      const response = await getLuggageRequests();
      
      // Handle case where response might be wrapped in an object
      const ridesArray = Array.isArray(response) ? response : (response?.data || response?.results || []);
      
      if (!Array.isArray(ridesArray)) {
        console.warn('getLuggageRequests: Expected array but got:', typeof response, response);
        return [];
      }

      return ridesArray.map((ride: BookedRideResponse) => {
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
        const formatTime = (timeString: string | null): string => {
          if (!timeString) {
            return '12:00 AM';
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

        return {
          id: ride.id,
          status: ride.status,
          date: formatDate(ride.ride_info.travel_date),
          origin: ride.ride_info.origin || 'Unknown Origin',
          originTime: formatTime(ride.travel_time),
          destination: ride.ride_info.destination|| 'Unknown Destination',
          destinationTime: formatTime(ride.destination_time),
          passengers: 0, // Not available in ride data
          // showRateButton: showRate,
        } as RideCardData;
      });
    },
    staleTime: 30000, // Cache for 30 seconds
    retry: 1,
  });
};

