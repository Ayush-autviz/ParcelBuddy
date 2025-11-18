import apiClient from "../apiClient";

export const kycVerification = async (data: any) => {
    const response = await apiClient.post('/auth/kyc-verification/', data);
    return response.data;
};