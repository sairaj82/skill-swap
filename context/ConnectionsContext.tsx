"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { User } from "../types";

export interface ConnectionRequest {
    id: string;
    senderId: string;
    receiverId: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    timestamp: number;
}

interface ConnectionsContextType {
    requests: ConnectionRequest[];
    sendRequest: (toUserId: string) => void;
    acceptRequest: (requestId: string) => void;
    rejectRequest: (requestId: string) => void;
    getConnectionStatus: (otherUserId: string) => 'NONE' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'ACCEPTED' | 'REJECTED';
    getIncomingRequests: () => (ConnectionRequest & { sender: User | undefined })[];
}

const ConnectionsContext = createContext<ConnectionsContextType | undefined>(undefined);

export function ConnectionsProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [requests, setRequests] = useState<ConnectionRequest[]>([]);

    useEffect(() => {
        const loadRequests = () => {
            const stored = localStorage.getItem("skillSwapRequests");
            if (stored) {
                setRequests(JSON.parse(stored));
            }
        };

        loadRequests();

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "skillSwapRequests") {
                loadRequests();
            }
        };

        const handleLocalChange = () => {
            loadRequests();
        };

        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("skillSwapRequestsUpdated", handleLocalChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("skillSwapRequestsUpdated", handleLocalChange);
        };
    }, []);

    const saveRequests = (newRequests: ConnectionRequest[]) => {
        setRequests(newRequests);
        localStorage.setItem("skillSwapRequests", JSON.stringify(newRequests));
        window.dispatchEvent(new Event("skillSwapRequestsUpdated"));
    };

    const sendRequest = (toUserId: string) => {
        if (!user) return;

        // Prevent duplicate
        if (requests.find(r =>
            ((r.senderId === user.id && r.receiverId === toUserId) ||
                (r.senderId === toUserId && r.receiverId === user.id)) &&
            (r.status === 'PENDING' || r.status === 'ACCEPTED')
        )) {
            return;
        }

        const newRequest: ConnectionRequest = {
            id: Date.now().toString(),
            senderId: user.id,
            receiverId: toUserId,
            status: 'PENDING',
            timestamp: Date.now()
        };

        saveRequests([...requests, newRequest]);
    };

    const acceptRequest = (requestId: string) => {
        const updated = requests.map(r => r.id === requestId ? { ...r, status: 'ACCEPTED' as const } : r);
        saveRequests(updated);
    };

    const rejectRequest = (requestId: string) => {
        const updated = requests.map(r => r.id === requestId ? { ...r, status: 'REJECTED' as const } : r);
        saveRequests(updated);
    };

    const getConnectionStatus = (otherUserId: string): 'NONE' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'ACCEPTED' | 'REJECTED' => {
        if (!user) return 'NONE';

        const request = requests.find(r =>
            (r.senderId === user.id && r.receiverId === otherUserId) ||
            (r.senderId === otherUserId && r.receiverId === user.id)
        );

        if (!request) return 'NONE';

        if (request.status === 'ACCEPTED') return 'ACCEPTED';
        if (request.status === 'REJECTED') return 'REJECTED'; // Depending on logic, might want to show NONE to allow retry

        // Pending state
        if (request.senderId === user.id) return 'PENDING_SENT';
        return 'PENDING_RECEIVED';
    };

    const getIncomingRequests = () => {
        if (!user) return [];

        const myRequests = requests.filter(r => r.receiverId === user.id && r.status === 'PENDING');
        const allUsers: User[] = JSON.parse(localStorage.getItem("skillSwapUsers") || "[]");

        return myRequests.map(req => ({
            ...req,
            sender: allUsers.find(u => u.id === req.senderId)
        }));
    };

    return (
        <ConnectionsContext.Provider value={{
            requests,
            sendRequest,
            acceptRequest,
            rejectRequest,
            getConnectionStatus,
            getIncomingRequests
        }}>
            {children}
        </ConnectionsContext.Provider>
    );
}

export function useConnections() {
    const context = useContext(ConnectionsContext);
    if (context === undefined) {
        throw new Error("useConnections must be used within a ConnectionsProvider");
    }
    return context;
}
