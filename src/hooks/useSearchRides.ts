import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { searchRides } from '../services/api/ride';

export interface SearchRidesParams {
  origin?: string;
  destination?: string;
  origin_lat?: number;
  origin_lng?: number;
  destination_lat?: number;
  destination_lng?: number;
  date_from?: string;
  max_price?: number;
  ordering?: string;
}

export const useSearchRides = (): UseMutationResult<any, Error, SearchRidesParams, unknown> => {
  return useMutation({
    mutationFn: (params: SearchRidesParams) => searchRides(params),
  });
};

