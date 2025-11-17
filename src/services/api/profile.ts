import apiClient from "../apiClient";

// get profile
export const getProfile = async () => {
  const response = await apiClient.get('/auth/profiles/');
  return response.data;
};

// get my profile
export const getMyProfile = async () => {
  const response = await apiClient.get('/auth/profiles/me/');
  return response.data;
};

// get profile by id
export const getProfileById = async (id: string) => {
  const response = await apiClient.get(`/auth/profiles/${id}/`);
  return response.data;
};