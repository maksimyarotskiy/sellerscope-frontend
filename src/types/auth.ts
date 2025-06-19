export interface SignUpRequest {
    email: string;
    password: string;
}

export interface SignInRequest {
    email: string;
    password: string;
}

export interface JwtAuthenticationResponse {
    accessToken: string;
    refreshToken: string;
}
