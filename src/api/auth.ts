import axios from 'axios';
import type {SignInRequest, SignUpRequest, JwtAuthenticationResponse} from '../types/auth';

const API_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080') + '/auth';

export const signUp = async (data: SignUpRequest): Promise<JwtAuthenticationResponse> => {
    const response = await axios.post(`${API_URL}/sign-up`, data);
    return response.data;
};

export const signIn = async (data: SignInRequest): Promise<JwtAuthenticationResponse> => {
    const response = await axios.post(`${API_URL}/sign-in`, data);
    return response.data;
};
