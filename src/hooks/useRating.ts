import { useMutation, UseMutationResult, useQuery, UseQueryResult } from '@tanstack/react-query';
import { createRating, getMyRating, getRatingGivenByMe, getRatingChart } from '../services/api/rating';

export interface CreateRatingRequest {
  rating_type: 'traveler' | 'sender';
  rated_to: string;
  luggage_request: string;
  rating: number;
  review: string;
}

export interface RatingResponse {
  id: number;
  rated_by_name?: string;
  rated_to_name?: string;
  is_deleted: boolean;
  created_by: string | null;
  created_on: string;
  modified_by: string | null;
  modified_on: string;
  deleted_by: string | null;
  deleted_on: string | null;
  rating_type: 'traveler' | 'sender';
  rating: number;
  review: string;
  rated_by: string;
  rated_to: string;
  luggage_request: string;
}

export interface PaginatedRatingResponse {
  pagination: {
    total_records: number;
    total_pages: number;
    current_page: number;
    next_page: number | null;
    previous_page: number | null;
    page_size: number;
  };
  results: RatingResponse[];
}

export const useCreateRating = (): UseMutationResult<any, Error, CreateRatingRequest, unknown> => {
  return useMutation({
    mutationFn: (data: CreateRatingRequest) => createRating(data),
  });
};

export const useMyRatings = (): UseQueryResult<RatingResponse[], Error> => {
  return useQuery({
    queryKey: ['myRatings'],
    queryFn: async () => {
      const response = await getMyRating();
      // Handle paginated response
      if (response && response.results && Array.isArray(response.results)) {
        return response.results;
      }
      // Fallback for non-paginated response
      return Array.isArray(response) ? response : [];
    },
  });
};

export const useRatingsGivenByMe = (): UseQueryResult<RatingResponse[], Error> => {
  return useQuery({
    queryKey: ['ratingsGivenByMe'],
    queryFn: async () => {
      const response = await getRatingGivenByMe();
      // Handle paginated response
      if (response && response.results && Array.isArray(response.results)) {
        return response.results;
      }
      // Fallback for non-paginated response
      return Array.isArray(response) ? response : [];
    },
  });
};

export interface RatingChartResponse {
  average_rating: number;
  total_reviews: number;
  distribution: {
    [key: string]: number; // "1": 0, "2": 1, etc.
  };
  percentages: {
    [key: string]: number; // "1": 0.0, "2": 33.33, etc.
  };
}

export const useRatingChart = (): UseQueryResult<RatingChartResponse, Error> => {
  return useQuery({
    queryKey: ['ratingChart'],
    queryFn: async () => {
      const response = await getRatingChart();
      return response;
    },
  });
};

