import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getPlans } from '../services/api/auth';

export interface SubscriptionPlanResponse {
  id: string;
  name: string;
  region: string;
  price: string;
  currency: string;
  rides_per_month: number;
  requests_per_month: number;
  duration_days: number;
  description: string;
  is_active: boolean;
  created_on: string;
  modified_on: string;
  features: string[];
}

export interface PlansResponse {
  success: boolean;
  region: string;
  payment_gateway: string;
  plans: SubscriptionPlanResponse[];
}

export const useSubscriptionPlans = (): UseQueryResult<PlansResponse, Error> => {
  return useQuery({
    queryKey: ['subscriptionPlans'],
    queryFn: async () => {
      const response = await getPlans();
      return response;
    },
    staleTime: 30000, // Cache for 30 seconds
    retry: 1,
  });
};

