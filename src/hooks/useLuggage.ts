import { useQuery, UseQueryResult, useMutation, UseMutationResult } from '@tanstack/react-query';
import { getLuggageRequestsForRide, createLuggageRequest } from '../services/api/luggage';
import { LuggageRequestItemData } from '../components/track/LuggageRequestItem';

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

