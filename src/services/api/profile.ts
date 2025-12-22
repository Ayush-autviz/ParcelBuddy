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

// delete account
export const deleteAccount = async () => {
  const response = await apiClient.delete('/auth/user/delete/');
  console.log('Delete account response:', response);
  console.log('Delete account response data:', response.data);
  console.log('Delete account response status:', response.status);
  return response.data;
};