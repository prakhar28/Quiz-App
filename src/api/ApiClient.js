import axios from 'axios';

// Enter your NGROK url here to test it also make sure that you add /api in the end.
const API_BASE_URL = 'http://127.0.0.1:5000/api';

const ApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch survey questions
export const fetchQuestions = async () => {
  try {
    const response = await ApiClient.get('/questions');
    return response.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

// Save a survey response
export const saveResponse = async (userName, questionIndex, response) => {
  try {
    const payload = {
      user_name: userName,
      question_index: questionIndex,
      response: response,
    };
    const result = await ApiClient.post('/responses', payload);
    return result.data;
  } catch (error) {
    console.error('Error saving response:', error);
    throw error;
  }
};

// Get all responses for a user
export const fetchResponses = async (userName) => {
  try {
    const response = await ApiClient.get(`/responses/${userName}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching responses:', error);
    throw error;
  }
};

// Get survey progress for a user
export const fetchUserProgress = async (userName) => {
  try {
    const response = await ApiClient.get(`/progress/${userName}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching progress:', error);
    throw error;
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await ApiClient.get('/health');
    return response.data;
  } catch (error) {
    console.error('Error during health check:', error);
    throw error;
  }
};

export default ApiClient;
