import apiClient from "../apiClient";

// get profile
export const getProfile = async () => {
  const response = await apiClient.get('/auth/profiles/');
  return response.data;
};