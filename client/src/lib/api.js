// client/src/lib/api.js

const API_BASE = 'http://localhost:5000/api';

/**
 * Global response handler for all API calls
 * Ensures consistent error throwing if the backend returns a 4xx or 5xx status
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    // Attempt to parse the JSON error message from the backend, fallback to generic error
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP Error: ${response.status}`);
  }
  return response.json();
};

export const api = {
  /**
   * Uploads a new Polaroid image and caption to the backend
   * Note: We don't set 'Content-Type' here because the browser automatically 
   * sets it to 'multipart/form-data' along with the required boundary when sending FormData.
   */
  uploadPolaroid: async (formData) => {
    const response = await fetch(`${API_BASE}/polaroids`, {
      method: 'POST',
      body: formData,
      credentials: 'include', // Strictly required to send Better Auth session cookies
    });
    return handleResponse(response);
  },

  /**
   * Fetches all saved Polaroids for the authenticated user
   */
  getPolaroids: async () => {
    const response = await fetch(`${API_BASE}/polaroids`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Fetches a single Polaroid by its ID
   */
  getPolaroidById: async (id) => {
    const response = await fetch(`${API_BASE}/polaroids/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Deletes a Polaroid from both the database and Cloudinary
   */
  deletePolaroid: async (id) => {
    const response = await fetch(`${API_BASE}/polaroids/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    return handleResponse(response);
  }
};