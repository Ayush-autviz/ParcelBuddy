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

export const getTransactionHistory = async (pageUrl?: string): Promise<any> => {
  if (pageUrl) {
    try {
      const baseUrl = 'https://api.parcelbuddys.com';
      if (pageUrl.startsWith(baseUrl)) {
        const pathWithQuery = pageUrl.substring(baseUrl.length);
        const response = await apiClient.get(pathWithQuery);
        return response.data;
      } else if (pageUrl.startsWith('/')) {
        const response = await apiClient.get(pageUrl);
        return response.data;
      } else {
        const urlMatch = pageUrl.match(/\/[^?]*(\?.*)?$/);
        if (urlMatch) {
          const pathWithQuery = urlMatch[0];
          const response = await apiClient.get(pathWithQuery);
          return response.data;
        }
        const response = await apiClient.get(pageUrl);
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching paginated transaction history:', error);
      throw error;
    }
  }
  const response = await apiClient.get('/auth/payement-transaction/');
  return response.data;
};