import axios from 'axios';
import type {SignInRequest, SignUpRequest, JwtAuthenticationResponse} from '../types/auth';

const API_URL = 'http://localhost:8080/auth'; // Замени, если другой порт

export const signUp = async (data: SignUpRequest): Promise<JwtAuthenticationResponse> => {
    const response = await axios.post(`${API_URL}/sign-up`, data);
    return response.data;
};

export const signIn = async (data: SignInRequest): Promise<JwtAuthenticationResponse> => {
    const response = await axios.post(`${API_URL}/sign-in`, data);
    return response.data;
};
