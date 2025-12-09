"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { useUsers } from "./UsersContext";
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
    const { users } = useUsers();
    const [requests, setRequests] = useState<ConnectionRequest[]>([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await fetch('/api/connections');
                const data = await res.json();
                setRequests(data);
            } catch (error) {
                console.error("Failed to fetch requests", error);
            }
        };

        fetchRequests();

        const interval = setInterval(fetchRequests, 2000);
        return () => clearInterval(interval);
    }, []);

    const sendRequest = async (toUserId: string) => {
        if (!user) return;

        // Prevent duplicate
        if (requests.find(r =>
            ((r.senderId === user.id && r.receiverId === toUserId) ||
                (r.senderId === toUserId && r.receiverId === user.id)) &&
            (r.status === 'PENDING' || r.status === 'ACCEPTED')
        )) {
            return;
        }

        const newRequest = {
            id: Date.now().toString(),
            senderId: user.id,
            receiverId: toUserId,
            status: 'PENDING',
            timestamp: Date.now()
        };

        await fetch('/api/connections', {
            method: 'POST',
            body: JSON.stringify(newRequest)
        });

        // Optimistic update
        setRequests([...requests, newRequest as ConnectionRequest]);
    };

    const acceptRequest = async (requestId: string) => {
        await fetch('/api/connections', {
            method: 'PUT',
            body: JSON.stringify({ requestId, status: 'ACCEPTED' })
        });

        setRequests(requests.map(r => r.id === requestId ? { ...r, status: 'ACCEPTED' as const } : r));
    };

    const rejectRequest = async (requestId: string) => {
        await fetch('/api/connections', {
            method: 'PUT',
            body: JSON.stringify({ requestId, status: 'REJECTED' })
        });

        setRequests(requests.map(r => r.id === requestId ? { ...r, status: 'REJECTED' as const } : r));
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

        return myRequests.map(req => ({
            ...req,
            sender: users.find(u => u.id === req.senderId)
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
