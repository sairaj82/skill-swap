"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Skill } from "../types";

// Static mock data to seed the "database"
const SEED_USERS: User[] = [
    {
        id: "1",
        name: "Alex Dev",
        email: "alex@example.com",
        teaching: [
            { id: "101", name: "Advanced React Patterns", category: "Development" }
        ],
        learning: [
            { id: "102", name: "Jazz Guitar Improvisation", category: "Music" }
        ]
    },
    {
        id: "2",
        name: "Maria Garcia",
        email: "maria@example.com",
        teaching: [
            { id: "201", name: "Conversational Spanish", category: "Language" }
        ],
        learning: [
            { id: "202", name: "Python for Data Science", category: "Development" }
        ]
    },
    {
        id: "3",
        name: "John Camera",
        email: "john@example.com",
        teaching: [
            { id: "301", name: "Digital Photography Basics", category: "Art" }
        ],
        learning: [
            { id: "302", name: "Public Speaking Mastery", category: "Lifestyle" }
        ]
    }
];

interface UsersContextType {
    users: User[];
    getAllSkills: () => (Skill & { authorName: string; type: "TEACH" | "LEARN"; authorId: string })[];
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export function UsersProvider({ children }: { children: ReactNode }) {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        // Initial fetch
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/users');
                const data = await res.json();
                setUsers(data);
            } catch (error) {
                console.error("Failed to fetch users", error);
            }
        };

        fetchUsers();

        // Poll every 2 seconds for real-time updates across devices
        const interval = setInterval(fetchUsers, 2000);

        return () => clearInterval(interval);
    }, []);

    const getAllSkills = () => {
        const allSkills: (Skill & { authorName: string; type: "TEACH" | "LEARN"; authorId: string })[] = [];

        users.forEach(user => {
            user.teaching.forEach(skill => {
                allSkills.push({
                    ...skill,
                    authorName: user.name,
                    type: "TEACH",
                    authorId: user.id
                });
            });
            user.learning.forEach(skill => {
                allSkills.push({
                    ...skill,
                    authorName: user.name,
                    type: "LEARN",
                    authorId: user.id
                });
            });
        });

        return allSkills;
    };

    return (
        <UsersContext.Provider value={{ users, getAllSkills }}>
            {children}
        </UsersContext.Provider>
    );
}

export function useUsers() {
    const context = useContext(UsersContext);
    if (context === undefined) {
        throw new Error("useUsers must be used within a UsersProvider");
    }
    return context;
}
