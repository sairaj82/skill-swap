"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, AuthCredentials, RegisterData } from "../types";

interface AuthContextType {
    user: User | null;
    login: (credentials: AuthCredentials) => Promise<boolean>;
    register: (data: RegisterData) => Promise<boolean>;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Check local storage on mount (mock persistence)
        const storedUser = localStorage.getItem("skillSwapUser");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const register = async (userData: RegisterData) => {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });

        const data = await res.json();

        if (data.success) {
            setUser(data.user);
            localStorage.setItem("skillSwapUser", JSON.stringify(data.user));
            return true;
        }

        return false;
    };

    const login = async (credentials: AuthCredentials) => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });

        const data = await res.json();

        if (data.success) {
            setUser(data.user);
            localStorage.setItem("skillSwapUser", JSON.stringify(data.user));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("skillSwapUser");
    };

    const updateUser = async (userData: Partial<User>) => {
        if (user) {
            const newUser = { ...user, ...userData };
            setUser(newUser);
            localStorage.setItem("skillSwapUser", JSON.stringify(newUser));

            // Sync with backend
            await fetch('/api/users', {
                method: 'POST', // We reused POST for update in route
                body: JSON.stringify(newUser)
            });
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateUser, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
