"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useConnections } from "@/context/ConnectionsContext";
import { useMessages } from "@/context/MessagesContext";
import { useRouter } from "next/navigation";

export default function Requests() {
    const { getIncomingRequests, acceptRequest, rejectRequest } = useConnections();
    const { startConversation } = useMessages();
    const router = useRouter();

    const incomingRequests = getIncomingRequests();

    const handleAccept = (requestId: string, senderId: string) => {
        acceptRequest(requestId);
        startConversation(senderId);
        router.push("/messages");
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-950">
            <Navbar />

            <main className="flex-grow pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-4">Connection Requests</h1>
                    <p className="text-slate-400">Manage your skill swap requests.</p>
                </div>

                <div className="space-y-4">
                    {incomingRequests.length === 0 ? (
                        <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-white/5">
                            <div className="text-4xl mb-4">📭</div>
                            <h3 className="text-xl font-bold mb-2">No pending requests</h3>
                            <p className="text-slate-500">When someone wants to connect, you'll see them here.</p>
                        </div>
                    ) : (
                        incomingRequests.map((req) => (
                            <div key={req.id} className="glass-card p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2">
                                <div className="flex items-center gap-4 text-center sm:text-left">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-lg flex-shrink-0">
                                        {req.sender?.name.charAt(0) || "?"}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{req.sender?.name || "Unknown User"}</h3>
                                        <p className="text-sm text-slate-400">
                                            Wants to connect with you.
                                            <span className="block text-xs text-slate-500 mt-1">
                                                {new Date(req.timestamp).toLocaleDateString()}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3 w-full sm:w-auto">
                                    <button
                                        onClick={() => rejectRequest(req.id)}
                                        className="flex-1 sm:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg transition-colors border border-slate-700"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleAccept(req.id, req.senderId)}
                                        className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg shadow-indigo-500/25 transition-all hover:scale-105"
                                    >
                                        Accept
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
