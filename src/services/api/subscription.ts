import apiClient from "../apiClient";

export interface CreateSubscriptionRequest {
  plan_id: string;
}

export interface CreateSubscriptionResponse {
  success: boolean;
  message: string;
  payment_gateway: string;
  checkout_url: string;
  session_id: string;
  stripe_customer_id?: string;
  plan: {
    name: string;
    price: number;
    currency: string;
  };
}

export const createSubscription = async (data: CreateSubscriptionRequest): Promise<CreateSubscriptionResponse> => {
    const response = await apiClient.post('/auth/subscription/create/', data);
    return response.data;
};