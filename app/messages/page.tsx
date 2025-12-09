"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect, useRef } from "react";
import { useMessages, Conversation, Message } from "@/context/MessagesContext";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/types";

export default function Messages() {
    const {
        conversations,
        activeConversationId,
        setActiveConversationId,
        sendMessage,
        getConversationPartner
    } = useMessages();
    const { user } = useAuth();

    const [inputText, setInputText] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const activeConversation = conversations.find(c => c.id === activeConversationId);
    const activePartner = activeConversation ? getConversationPartner(activeConversation) : undefined;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeConversation?.messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || !activeConversationId) return;

        sendMessage(activeConversationId, inputText);
        setInputText("");
    };

    // Helper to format time
    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="min-h-screen flex flex-col h-screen overflow-hidden">
            <Navbar />

            <main className="flex-grow pt-16 flex h-full">
                {/* Sidebar */}
                <div className={`w-full md:w-80 border-r border-white/10 bg-slate-900 flex-shrink-0 ${activeConversationId ? 'hidden md:flex' : 'flex'} flex-col`}>
                    <div className="p-4 border-b border-white/10">
                        <h1 className="text-2xl font-bold">Messages</h1>
                    </div>
                    <div className="flex-grow overflow-y-auto">
                        {conversations.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                <p>No conversations yet.</p>
                                <p className="text-sm mt-2">Explore skills and connect with others to start chatting!</p>
                            </div>
                        ) : (
                            conversations.map((chat) => {
                                const partner = getConversationPartner(chat);
                                if (!partner) return null;

                                const lastMsg = chat.messages[chat.messages.length - 1];

                                return (
                                    <button
                                        key={chat.id}
                                        onClick={() => setActiveConversationId(chat.id)}
                                        className={`w-full p-4 flex items-center space-x-4 hover:bg-white/5 transition-colors text-left ${activeConversationId === chat.id ? "bg-white/10" : ""
                                            }`}
                                    >
                                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-lg flex-shrink-0`}>
                                            {partner.name.charAt(0)}
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className="font-bold truncate text-slate-200">{partner.name}</h3>
                                                {lastMsg && (
                                                    <span className="text-xs text-slate-400">{formatTime(lastMsg.timestamp)}</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-400 truncate">
                                                {lastMsg ? lastMsg.text : "Start a conversation"}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Chat Window */}
                <div className={`flex-grow flex flex-col bg-slate-950 ${!activeConversationId ? 'hidden md:flex' : 'flex'}`}>
                    {activeConversationId && activePartner ? (
                        <>
                            {/* Header */}
                            <div className="p-4 border-b border-white/10 flex items-center space-x-4 bg-slate-900/50 backdrop-blur-md">
                                <button
                                    onClick={() => setActiveConversationId(null)}
                                    className="md:hidden text-slate-400 hover:text-white"
                                >
                                    &larr; Back
                                </button>
                                <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white`}>
                                    {activePartner.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="font-bold">{activePartner.name}</h2>
                                    <span className="text-xs text-green-400 flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-green-400"></span> Online
                                    </span>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                                {activeConversation?.messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.senderId === user?.id ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.senderId === user?.id
                                                ? "bg-indigo-600 text-white rounded-br-sm"
                                                : "bg-slate-800 text-slate-200 rounded-bl-sm"
                                                }`}
                                        >
                                            <p>{msg.text}</p>
                                            <span className={`text-[10px] block text-right mt-1 ${msg.senderId === user?.id ? "text-indigo-200" : "text-slate-500"}`}>
                                                {formatTime(msg.timestamp)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="p-4 border-t border-white/10 bg-slate-900/50">
                                <form onSubmit={handleSend} className="flex gap-4">
                                    <input
                                        type="text"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-grow bg-slate-800 border-none rounded-full px-6 py-3 focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-500"
                                    />
                                    <button
                                        type="submit"
                                        className="p-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                                    >
                                        <svg className="w-6 h-6 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-grow flex items-center justify-center text-slate-500">
                            Select a conversation to start chatting
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
