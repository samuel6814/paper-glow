// client/src/lib/api.js

/**
 * Dynamically pulls the Backend URL from the environment variable.
 * Fallback to localhost during development if the .env is missing.
 */
const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
const API_BASE = `${BASE_URL}/api`;

/**
 * Global response handler for all API calls
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP Error: ${response.status}`);
  }
  return response.json();
};

export const api = {
  /**
   * Uploads a new Polaroid image and data
   */
  uploadPolaroid: async (formData) => {
    const response = await fetch(`${API_BASE}/polaroids`, {
      method: 'POST',
      body: formData,
      credentials: 'include', // Sends Better Auth session cookies
    });
    return handleResponse(response);
  },

  /**
   * Fetches all saved Polaroids for the authenticated user
   */
  getPolaroids: async () => {
    const response = await fetch(`${API_BASE}/polaroids`, {
      method: 'GET',
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Updates an existing Polaroid (Caption, Theme, etc.)
   */
  updatePolaroid: async (id, data) => {
    const response = await fetch(`${API_BASE}/polaroids/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Deletes a Polaroid
   */
  deletePolaroid: async (id) => {
    const response = await fetch(`${API_BASE}/polaroids/${id}`, {
      method: 'DELETE',
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
      credentials: 'include',
    });
    return handleResponse(response);
  }
};