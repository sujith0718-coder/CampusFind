import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Accept': 'application/json',
  },
});

/**
 * Submit Lost Item Report
 * POST /api/reports/lost
 * Content-Type: multipart/form-data
 */
export async function submitLostReport(payload) {
  const formData = new FormData();
  
  formData.append('studentName', payload.studentName);
  formData.append('studentRollNumber', payload.studentRollNumber);
  formData.append('studentEmail', payload.studentEmail);
  formData.append('studentPhone', payload.studentPhone);
  formData.append('itemName', payload.itemName);
  formData.append('itemCategory', payload.itemCategory);
  formData.append('itemCharacteristics', payload.itemCharacteristics);
  
  // Convert datetime-local or Date object to ISO string if provided
  if (payload.approxLostTime) {
    const isoString = new Date(payload.approxLostTime).toISOString();
    formData.append('approxLostTime', isoString);
  } else {
    formData.append('approxLostTime', payload.approxLostTime || '');
  }
  
  formData.append('approxLostLocation', payload.approxLostLocation);
  
  if (payload.itemImage instanceof File) {
    formData.append('itemImage', payload.itemImage);
  }

  const response = await apiClient.post('/api/reports/lost', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

/**
 * Submit Found Item Query
 * POST /api/reports/found
 * Content-Type: multipart/form-data
 */
export async function submitFoundQuery(payload) {
  const formData = new FormData();
  
  formData.append('name', payload.name);
  formData.append('rollNumber', payload.rollNumber);
  formData.append('email', payload.email);
  formData.append('phone', payload.phone);
  formData.append('itemName', payload.itemName);
  formData.append('category', payload.category);
  formData.append('characteristics', payload.characteristics);
  formData.append('location', payload.location);
  
  if (payload.itemImage instanceof File) {
    formData.append('itemImage', payload.itemImage);
  }
  
  if (payload.locationImage instanceof File) {
    formData.append('locationImage', payload.locationImage);
  }

  const response = await apiClient.post('/api/reports/found', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}
