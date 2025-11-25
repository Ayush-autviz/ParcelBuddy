import { useMutation, UseMutationResult, useQuery, UseQueryResult } from '@tanstack/react-query';
import { createRating, getMyRating, getRatingGivenByMe } from '../services/api/rating';

export interface CreateRatingRequest {
  rating_type: 'traveler' | 'sender';
  rated_to: string;
  luggage_request: string;
  rating: number;
  review: string;
}

export interface RatingResponse {
  id: number;
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
      return Array.isArray(response) ? response : [];
    },
  });
};

export const useRatingsGivenByMe = (): UseQueryResult<RatingResponse[], Error> => {
  return useQuery({
    queryKey: ['ratingsGivenByMe'],
    queryFn: async () => {
      const response = await getRatingGivenByMe();
      return Array.isArray(response) ? response : [];
    },
  });
};

