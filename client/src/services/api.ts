import axios from 'axios';
import { User, GridData } from '../types/dataGrid';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchUsers = async (query?: string): Promise<User[]> => {
  try {
    const response = await api.get('/users', { params: { query } });
    // Check if the server returns data in the expected format
    return response.data.data?.users || response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const fetchTasks = async (): Promise<GridData> => {
  try {
    const response = await api.get('/tasks');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};
