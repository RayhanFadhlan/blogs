import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchApi = async (endpoint: string, options?: RequestInit) => {
  const url = `${API_URL}${endpoint}`
  const token = Cookies.get('auth-token');
  
  // Check if the body is FormData
  const isFormData = options?.body instanceof FormData;
  
  const headers = {
    // Only set Content-Type if it's not FormData
    ...((!isFormData) && { 'Content-Type': 'application/json' }),
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options?.headers,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })
  return response
}