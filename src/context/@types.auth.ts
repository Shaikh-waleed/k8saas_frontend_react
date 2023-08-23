
export interface AuthContextType {
    user: User | null,
    setUser: (user: User | null) => void,
    setCookie: (name: 'auth-token', value: any, options: any) => void
    accessToken: string
}

export interface AuthProviderProps {
    children: React.ReactNode,
}

export interface User {
    fullName: string;
    email: string;
    password?: string;
    authToken?: string;
    country: string;
}