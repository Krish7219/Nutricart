const API_URL = 'http://localhost:5000/api';

// Helper function for API calls
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    // Check if response is ok first
    if (!response.ok) {
      // Try to parse error response
      try {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      } catch (parseError) {
        // If JSON parsing fails, throw a more helpful error
        if (response.status === 0 || response.type === 'opaque') {
          throw new Error('Unable to connect to server. Please ensure the backend is running on port 5000.');
        }
        throw new Error(`Server returned error: ${response.status} ${response.statusText}`);
      }
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    // Check if it's a network error (server not running)
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('Network request failed')) {
      throw new Error('Unable to connect to server. Please ensure the backend is running on port 5000 and MongoDB is connected.');
    }
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: (email, password) => 
    fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  signup: (name, email, password, goals = [], dietary = []) =>
    fetchAPI('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, goals, dietary }),
    }),
  
  getUser: (userId) => 
    fetchAPI(`/auth/user/${userId}`),
  
  updateUser: (userId, updates) =>
    fetchAPI(`/auth/user/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  
  getTodayIntake: (userId) =>
    fetchAPI(`/auth/user/${userId}/today-intake`),
  
  addDailyIntake: (userId, mealData) =>
    fetchAPI(`/auth/user/${userId}/daily-intake`, {
      method: 'POST',
      body: JSON.stringify(mealData),
    }),
  
  updateCalorieLimit: (userId, dailyCalorieLimit) =>
    fetchAPI(`/auth/user/${userId}/calorie-limit`, {
      method: 'PUT',
      body: JSON.stringify({ dailyCalorieLimit }),
    }),
};

// Chatbot API
export const chatbotAPI = {
  sendMessage: (message, context) =>
    fetchAPI('/chatbot', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    }),
};

// Meals API
export const mealsAPI = {
  getAll: () => fetchAPI('/meals'),
  
  getById: (id) => fetchAPI(`/meals/${id}`),
  
  getTrending: () => fetchAPI('/meals/trending'),
  
  filter: (filters) => {
    const params = new URLSearchParams(filters).toString();
    return fetchAPI(`/meals/filter?${params}`);
  },
};

// Vendors API
export const vendorsAPI = {
  getAll: () => fetchAPI('/vendors'),
  
  getById: (id) => fetchAPI(`/vendors/${id}`),
};

// Orders API
export const ordersAPI = {
  create: (orderData) =>
    fetchAPI('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),
  
  getUserOrders: (userId) => fetchAPI(`/orders/user/${userId}`),
  
  getVendorOrders: (vendorId) => fetchAPI(`/orders/vendor/${vendorId}`),
};

// Payment API
export const paymentAPI = {
  createOrder: (amount, currency = 'INR') =>
    fetchAPI('/payment/create-order', {
      method: 'POST',
      body: JSON.stringify({ amount, currency }),
    }),
  
  verifyPayment: (razorpay_order_id, razorpay_payment_id, razorpay_signature) =>
    fetchAPI('/payment/verify', {
      method: 'POST',
      body: JSON.stringify({ razorpay_order_id, razorpay_payment_id, razorpay_signature }),
    }),
  
  getKey: () => fetchAPI('/payment/key'),
};

export default {
  auth: authAPI,
  meals: mealsAPI,
  vendors: vendorsAPI,
  orders: ordersAPI,
  payment: paymentAPI,
};
