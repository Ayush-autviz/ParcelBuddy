import { useQuery, UseQueryResult, useMutation, UseMutationResult } from '@tanstack/react-query';
import { getLuggageRequestsForRide, createLuggageRequest, getLuggageRequests, getLuggageRequestById, cancelLuggageRequest, respondToLuggageRequest, updateLuggageRequestWeight } from '../services/api/luggage';
import { LuggageRequestItemData } from '../components/track/LuggageRequestItem';
import { RideCardData, StatusType } from '../components/track';

export interface LuggageRequestResponse {
  id: string;
  sender?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    profile?: {
      profile_photo?: string;
    };
  };
  sender_name?: string;
  status?: string;
  item_count?: number;
  senderProfilePhoto?: string;
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
        const status = request.status;
        const senderProfilePhoto = request.sender?.profile?.profile_photo;

        return {
          id: request.id,
          senderName,
          itemCount,
          status,
          senderProfilePhoto,
          sender: request.sender, // Include full sender object
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

// Hook to respond to a luggage request (approve or reject)
export const useRespondToLuggageRequest = (): UseMutationResult<any, Error, { requestId: string; status: 'approved' | 'rejected' }, unknown> => {
  return useMutation({
    mutationFn: ({ requestId, status }) => respondToLuggageRequest(requestId, { status }),
  });
};

// Hook to update luggage request weight
export const useUpdateLuggageRequestWeight = (): UseMutationResult<any, Error, { requestId: string; weight_kg: number }, unknown> => {
  return useMutation({
    mutationFn: ({ requestId, weight_kg }) => updateLuggageRequestWeight(requestId, { weight_kg }),
  });
};

// Interface for luggage request detail response
export interface LuggageRequestDetailResponse {
  id: string;
  ride: {
    id: string;
    traveler: any;
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
    [key: string]: any;
  };
  sender: any;
  weight_kg: string;
  length_cm: number | null;
  width_cm: number | null;
  height_cm: number | null;
  luggage_photo: Array<{
    id: string;
    luggage_image: string;
  }>;
  item_description: string;
  special_instructions: string;
  offered_price: string;
  negotiated_price: string | null;
  status: string;
  rejection_reason: string;
  created_on: string;
  responded_at: string | null;
  [key: string]: any;
}

// Hook to get luggage request detail by ID
export const useLuggageRequestDetail = (
  requestId: string | undefined
): UseQueryResult<LuggageRequestDetailResponse, Error> => {
  return useQuery({
    queryKey: ['luggageRequestDetail', requestId],
    queryFn: async () => {
      if (!requestId) {
        throw new Error('Request ID is required');
      }
      const response = await getLuggageRequestById(requestId);
      return response;
    },
    enabled: !!requestId, // Only fetch if requestId is provided
    staleTime: 30000, // Cache for 30 seconds
    retry: 1,
  });
};

// Hook to cancel luggage request
export const useCancelLuggageRequest = (): UseMutationResult<any, Error, string, unknown> => {
  return useMutation({
    mutationFn: (requestId: string) => cancelLuggageRequest(requestId),
  });
};

// Interface for booked ride response (luggage request with ride_info)
export interface BookedRideResponse {
  id: string;
  ride_info: {
    id: string;
    origin_name?: string;
    origin?: string;
    destination_name?: string;
    destination?: string;
    travel_date: string;
    travel_time?: string | null;
    destination_date?: string;
    destination_time?: string | null;
    traveler?: any;
    [key: string]: any;
  };
  travel_time?: string | null;
  destination_time?: string | null;
  weight_kg?: number;
  height_cm?: number;
  width_cm?: number;
  length_cm?: number;
  item_description?: string;
  special_instructions?: string;
  luggage_photos?: any[];
  status?: string;
  created_on?: string;
  [key: string]: any;
}

// Extended RideCardData with booking request info
export interface BookedRideCardData extends RideCardData {
  bookingRequest?: BookedRideResponse; // Store original booking request data
}

// Hook to get booked rides (luggage requests made by the user)
export const useBookedRides = (): UseQueryResult<BookedRideCardData[], Error> => {
  return useQuery({
    queryKey: ['bookedRides'],
    queryFn: async () => {
      const response = await getLuggageRequests();
      
      // Handle case where response might be wrapped in an object
      const requestsArray = Array.isArray(response) ? response : (response?.data || response?.results || []);
      
      if (!Array.isArray(requestsArray)) {
        console.warn('getLuggageRequests: Expected array but got:', typeof response, response);
        return [];
      }

      return requestsArray.filter((request: BookedRideResponse) => request.status !== 'cancelled').map((request: BookedRideResponse) => {
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
        const formatTime = (timeString: string | null | undefined): string => {
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
          id: request.ride_info?.id || request.id,
          status: request.status,
          date: formatDate(request.ride_info?.travel_date || ''),
          origin: request.ride_info?.origin || request.ride_info?.origin_name || 'Unknown Origin',
          originTime: formatTime(request.travel_time || request.ride_info?.travel_time),
          destination: request.ride_info?.destination || request.ride_info?.destination_name || 'Unknown Destination',
          destinationTime: formatTime(request.destination_time || request.ride_info?.destination_time),
          passengers: 0,
          // showRateButton: showRate,
          bookingRequest: request, // Store original booking request for detail screen
        } as BookedRideCardData;
      });
    },
    staleTime: 30000, // Cache for 30 seconds
    retry: 1,
  });
};

