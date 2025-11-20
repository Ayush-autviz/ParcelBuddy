import apiClient from "../apiClient";

export const kycVerification = async () => {
    const response = await apiClient.post('/auth/kyc-verification/');
    return response.data;
};