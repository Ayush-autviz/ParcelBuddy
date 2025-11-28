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
  rated_by_image?: string | null;
  rated_to_image?: string | null;
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
    next_page: string | null;
    previous_page: string | null;
    page_size: number;
  };
  results: RatingResponse[];
}

export interface PaginatedRatingsData {
  ratings: RatingResponse[];
  pagination: {
    next_page: string | null;
    current_page: number;
    total_pages: number;
    total_records: number;
  } | null;
}

export const useCreateRating = (): UseMutationResult<any, Error, CreateRatingRequest, unknown> => {
  return useMutation({
    mutationFn: (data: CreateRatingRequest) => createRating(data),
  });
};

export const useMyRatings = (): UseQueryResult<PaginatedRatingsData, Error> => {
  return useQuery({
    queryKey: ['myRatings'],
    queryFn: async () => {
      const response = await getMyRating();
      const hasPagination = response?.pagination && response?.results;
      const ratingsArray = hasPagination
        ? response.results
        : (Array.isArray(response) ? response : (response?.data || response?.results || []));

      if (!Array.isArray(ratingsArray)) {
        console.warn('getMyRating: Expected array but got:', typeof response, response);
        return {
          ratings: [],
          pagination: null,
        };
      }

      return {
        ratings: ratingsArray,
        pagination: hasPagination ? {
          next_page: response.pagination.next_page,
          current_page: response.pagination.current_page,
          total_pages: response.pagination.total_pages,
          total_records: response.pagination.total_records,
        } : null,
      };
    },
    staleTime: 30000,
    retry: 1,
  });
};

export const useRatingsGivenByMe = (): UseQueryResult<PaginatedRatingsData, Error> => {
  return useQuery({
    queryKey: ['ratingsGivenByMe'],
    queryFn: async () => {
      const response = await getRatingGivenByMe();
      const hasPagination = response?.pagination && response?.results;
      const ratingsArray = hasPagination
        ? response.results
        : (Array.isArray(response) ? response : (response?.data || response?.results || []));

      if (!Array.isArray(ratingsArray)) {
        console.warn('getRatingGivenByMe: Expected array but got:', typeof response, response);
        return {
          ratings: [],
          pagination: null,
        };
      }

      return {
        ratings: ratingsArray,
        pagination: hasPagination ? {
          next_page: response.pagination.next_page,
          current_page: response.pagination.current_page,
          total_pages: response.pagination.total_pages,
          total_records: response.pagination.total_records,
        } : null,
      };
    },
    staleTime: 30000,
    retry: 1,
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

