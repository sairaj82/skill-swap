"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { useUsers } from "./UsersContext";
import { User } from "../types";

export interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: number;
}

export interface Conversation {
    id: string;
    participants: string[];
    messages: Message[];
    lastMessage?: Message;
    unreadCount: number;
}

interface MessagesContextType {
    conversations: Conversation[];
    activeConversationId: string | null;
    setActiveConversationId: (id: string | null) => void;
    sendMessage: (conversationId: string, text: string) => void;
    startConversation: (participantId: string) => string; // Returns conversation ID
    getConversationPartner: (conversation: Conversation) => User | undefined;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export function MessagesProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const { users } = useUsers();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

    // Load conversations from local storage
    useEffect(() => {
        if (!user) {
            setConversations([]);
            return;
        }

        const loadConversations = () => {
            const allConversations: Conversation[] = JSON.parse(localStorage.getItem("skillSwapConversations") || "[]");
            // Filter conversations where current user is a participant
            const userConversations = allConversations.filter(c => c.participants.includes(user.id));
            setConversations(userConversations);
        };

        loadConversations();

        // Listen for storage events
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "skillSwapConversations") {
                loadConversations();
            }
        };

        const handleLocalChange = () => {
            loadConversations();
        };

        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("skillSwapConversationsUpdated", handleLocalChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("skillSwapConversationsUpdated", handleLocalChange);
        };
    }, [user]);

    const sendMessage = (conversationId: string, text: string) => {
        if (!user) return;

        const allConversations: Conversation[] = JSON.parse(localStorage.getItem("skillSwapConversations") || "[]");
        const conversationIndex = allConversations.findIndex(c => c.id === conversationId);

        if (conversationIndex === -1) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            senderId: user.id,
            text,
            timestamp: Date.now()
        };

        const updatedConversation = {
            ...allConversations[conversationIndex],
            messages: [...allConversations[conversationIndex].messages, newMessage],
            lastMessage: newMessage,
            // Simple unread logic: if I sent it, 0 unread for me, but increments for others (not fully implemented here for simplicity)
            unreadCount: 0
        };

        allConversations[conversationIndex] = updatedConversation;
        localStorage.setItem("skillSwapConversations", JSON.stringify(allConversations));

        // Dispatch event
        window.dispatchEvent(new Event("skillSwapConversationsUpdated"));
    };

    const startConversation = (participantId: string) => {
        if (!user) throw new Error("Must be logged in");

        const allConversations: Conversation[] = JSON.parse(localStorage.getItem("skillSwapConversations") || "[]");

        // Check if conversation already exists
        const existingToken = allConversations.find(c =>
            c.participants.includes(user.id) && c.participants.includes(participantId)
        );

        if (existingToken) {
            setActiveConversationId(existingToken.id);
            return existingToken.id;
        }

        // Create new
        const newConversation: Conversation = {
            id: Date.now().toString(),
            participants: [user.id, participantId],
            messages: [],
            unreadCount: 0
        };

        allConversations.push(newConversation);
        localStorage.setItem("skillSwapConversations", JSON.stringify(allConversations));
        window.dispatchEvent(new Event("skillSwapConversationsUpdated"));

        setActiveConversationId(newConversation.id);
        return newConversation.id;
    };

    const getConversationPartner = (conversation: Conversation) => {
        if (!user) return undefined;
        const partnerId = conversation.participants.find(p => p !== user.id);
        if (!partnerId) return undefined;

        // Use users from context
        return users.find(u => u.id === partnerId);
    };

    return (
        <MessagesContext.Provider value={{
            conversations,
            activeConversationId,
            setActiveConversationId,
            sendMessage,
            startConversation,
            getConversationPartner
        }}>
            {children}
        </MessagesContext.Provider>
    );
}

export function useMessages() {
    const context = useContext(MessagesContext);
    if (context === undefined) {
        throw new Error("useMessages must be used within a MessagesProvider");
    }
    return context;
}
