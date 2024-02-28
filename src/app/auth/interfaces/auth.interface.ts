
export interface AuthResponse<T> {
    ok: boolean;
    msg: string;
    token?: string;
    data?: T;
}

export interface User {
    id?: string;
    _id?: string;
    name: string;
    email: string;
    password?: string;
}

export interface CheckTokenResponse {
    user: User;
    token: string;
}