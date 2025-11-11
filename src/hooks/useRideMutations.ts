import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { createRide, deleteRide } from '../services/api/ride';

export interface CreateRideRequest {
  origin_name: string;
  origin_lat: number;
  origin_lng: number;
  destination_name: string;
  destination_lat: number;
  destination_lng: number;
  travel_date: string;
  travel_time: string;
  destination_date: string;
  destination_time: string;
  available_weight_kg: number;
  max_length_cm: number;
  max_width_cm: number;
  max_height_cm: number;
  price_per_kg: number;
  is_price_negotiable: boolean;
  notes: string;
  status: string;
}

export const useCreateRide = (): UseMutationResult<any, Error, CreateRideRequest, unknown> => {
  return useMutation({
    mutationFn: (data: CreateRideRequest) => createRide(data),
  });
};

export const useDeleteRide = (): UseMutationResult<any, Error, string, unknown> => {
  return useMutation({
    mutationFn: (id: string) => deleteRide(id),
  });
};

