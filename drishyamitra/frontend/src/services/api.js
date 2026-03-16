import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Optionally setup interceptors if token authentication is required later
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const uploadPhoto = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getGallery = async () => {
  const response = await api.get("/photos");
  return response.data;
};

export const detectFaces = async (photoId) => {
  const response = await api.post(`/faces/detect/${photoId}`);
  return response.data;
};

export const getFaces = async (photoId) => {
  const response = await api.get(`/photos/${photoId}/faces`);
  return response.data;
};

export const labelFace = async (faceId, personName) => {
  const response = await api.post(`/faces/${faceId}/label`, {
    person_name: personName,
  });
  return response.data;
};

export const sendMessage = async (message) => {
    // The endpoint path depends on your backend routes. Assuming /chat
    const response = await api.post("/chat", { message });
    return response.data;
};

export const requestDelivery = async (type, destination, photoPath, photoId) => {
    let endpoint = type === 'email' ? '/delivery/email' : '/delivery/whatsapp';
    
    // Build payload matching backend requirements
    let payload = {
        photo_path: photoPath,
        photo_id: photoId
    };
    
    if (type === 'email') {
        payload.to_email = destination;
    } else {
        payload.to_number = destination;
        payload.photo_url = photoPath; // Treating path as URL if WhatsApp service handles it
    }

    const response = await api.post(endpoint, payload);
    return response.data;
};

export default api;
