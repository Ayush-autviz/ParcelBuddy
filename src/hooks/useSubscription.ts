import { useQuery, UseQueryResult, useMutation, UseMutationResult } from '@tanstack/react-query';
import { getPlans } from '../services/api/auth';
import { createSubscription, CreateSubscriptionRequest, CreateSubscriptionResponse, getTransactionHistory } from '../services/api/subscription';

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
  is_current_plan?: boolean;
}

export interface PlansResponse {
  success: boolean;
  region: string;
  payment_gateway: string;
  plans: SubscriptionPlanResponse[];
}

export const useSubscriptionPlans = (region?: string): UseQueryResult<PlansResponse, Error> => {
  return useQuery({
    queryKey: ['subscriptionPlans', region],
    queryFn: async () => {
      const response = await getPlans(region);
      return response;
    },
    staleTime: 30000, // Cache for 30 seconds
    retry: 1,
  });
};

export const useCreateSubscription = (): UseMutationResult<CreateSubscriptionResponse, Error, CreateSubscriptionRequest, unknown> => {
  return useMutation({
    mutationFn: (data: CreateSubscriptionRequest) => createSubscription(data),
  });
};

export interface TransactionResponse {
  id: string;
  subscription: string;
  amount: string;
  currency: string;
  status: string;
  created_on: string;
  subscription_plan_name: string;
  subscription_plan_region: string;
}

export interface PaginatedTransactionResponse {
  transactions: TransactionResponse[];
  pagination: {
    next_page: string | null;
    current_page: number;
    total_pages: number;
    total_records: number;
  } | null;
}

export const useTransactionHistory = (): UseQueryResult<PaginatedTransactionResponse, Error> => {
  return useQuery({
    queryKey: ['transactionHistory'],
    queryFn: async () => {
      const response = await getTransactionHistory();
      const hasPagination = response?.pagination && response?.results;
      const transactionsArray = hasPagination
        ? response.results
        : (Array.isArray(response) ? response : (response?.data || response?.results || []));

      if (!Array.isArray(transactionsArray)) {
        console.warn('getTransactionHistory: Expected array but got:', typeof response, response);
        return {
          transactions: [],
          pagination: null,
        };
      }

      return {
        transactions: transactionsArray,
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

