"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, AuthCredentials, RegisterData } from "../types";

interface AuthContextType {
    user: User | null;
    login: (credentials: AuthCredentials) => boolean;
    register: (data: RegisterData) => boolean;
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

    const register = (userData: RegisterData) => {
        // Get existing users
        const users = JSON.parse(localStorage.getItem("skillSwapUsers") || "[]");

        // Check if email already exists
        if (users.find((u: User) => u.email === userData.email)) {
            return false;
        }

        // Add new user
        const newUser: User = {
            ...userData,
            id: Date.now().toString(),
            teaching: [],
            learning: [
                {
                    id: `skill-${Date.now()}`,
                    name: "Community Member",
                    category: "Lifestyle"
                }
            ]
        };

        users.push(newUser);
        localStorage.setItem("skillSwapUsers", JSON.stringify(users));

        // Auto login after register
        setUser(newUser);
        localStorage.setItem("skillSwapUser", JSON.stringify(newUser));

        // Dispatch event for same-tab updates
        window.dispatchEvent(new Event("skillSwapUsersUpdated"));

        return true;
    };

    const login = (credentials: AuthCredentials) => {
        // In a real app, we would verify password here
        // For this mock, we'll check if the user exists in our "db"
        const users = JSON.parse(localStorage.getItem("skillSwapUsers") || "[]");
        const foundUser = users.find((u: User) => u.email === credentials.email && u.password === credentials.password);

        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem("skillSwapUser", JSON.stringify(foundUser));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("skillSwapUser");
    };

    const updateUser = (userData: Partial<User>) => {
        if (user) {
            const newUser = { ...user, ...userData };
            setUser(newUser);
            localStorage.setItem("skillSwapUser", JSON.stringify(newUser));

            // Also update in the "db" to persist changes across sessions
            const users = JSON.parse(localStorage.getItem("skillSwapUsers") || "[]");
            const updatedUsers = users.map((u: User) => u.email === user.email ? newUser : u);
            localStorage.setItem("skillSwapUsers", JSON.stringify(updatedUsers));
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
