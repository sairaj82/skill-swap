"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUsers } from "@/context/UsersContext";
import { useAuth } from "@/context/AuthContext";
import { useMessages } from "@/context/MessagesContext";
import { useConnections } from "@/context/ConnectionsContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Skill } from "@/types";

export default function SkillDetail() {
    const params = useParams();
    const router = useRouter();
    const { getAllSkills } = useUsers();
    const { user: currentUser } = useAuth();
    const { startConversation } = useMessages();
    const { sendRequest, getConnectionStatus } = useConnections();

    const [skill, setSkill] = useState<(Skill & { authorName: string; type: "TEACH" | "LEARN"; authorId: string }) | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            const allSkills = getAllSkills();
            const foundSkill = allSkills.find(s => s.id === params.id);

            if (foundSkill) {
                setSkill(foundSkill);
            }
        }
        setLoading(false);
    }, [params.id, getAllSkills]);

    // Get connection status handling safety if skill is null
    const connectionStatus = (skill && currentUser)
        ? getConnectionStatus(skill.authorId)
        : 'NONE';

    const handleAction = () => {
        if (!currentUser) {
            router.push("/login");
            return;
        }

        if (!skill) return;

        if (connectionStatus === 'ACCEPTED') {
            startConversation(skill.authorId);
            router.push("/messages");
        } else if (connectionStatus === 'NONE' || connectionStatus === 'REJECTED') {
            sendRequest(skill.authorId);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!skill) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-950">
                <Navbar />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Skill not found</h1>
                        <Link href="/explore" className="text-indigo-400 hover:text-indigo-300">
                            Back to Explore
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const renderActionButton = () => {
        if (!currentUser || currentUser.id === skill.authorId) return null;

        switch (connectionStatus) {
            case 'ACCEPTED':
                return (
                    <button
                        onClick={handleAction}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg shadow-indigo-500/25 transition-all hover:scale-105"
                    >
                        Message {skill.authorName}
                    </button>
                );
            case 'PENDING_SENT':
                return (
                    <button
                        disabled
                        className="px-6 py-3 bg-slate-700 text-slate-400 font-bold rounded-lg cursor-not-allowed"
                    >
                        Request Sent
                    </button>
                );
            case 'PENDING_RECEIVED':
                return (
                    <Link
                        href="/requests"
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg shadow-indigo-500/25 transition-all hover:scale-105"
                    >
                        Respond to Request
                    </Link>
                );
            default: // NONE or REJECTED
                return (
                    <button
                        onClick={handleAction}
                        className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg shadow-lg shadow-green-500/25 transition-all hover:scale-105"
                    >
                        Connect
                    </button>
                );
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-950">
            <Navbar />

            <main className="flex-grow pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
                <Link
                    href="/explore"
                    className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors"
                >
                    &larr; Back to Explore
                </Link>

                <div className="glass-card rounded-2xl p-8 md:p-12 animate-in fade-in zoom-in duration-500">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span
                                    className={`text-xs font-bold px-3 py-1 rounded-full ${skill.type === "TEACH"
                                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                                        : "bg-pink-500/20 text-pink-300 border border-pink-500/30"
                                        }`}
                                >
                                    {skill.type === "TEACH" ? "Teaching" : "Learning"}
                                </span>
                                <span className="text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded border border-slate-700">
                                    {skill.category}
                                </span>
                            </div>
                            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                {skill.name}
                            </h1>
                        </div>

                        {renderActionButton()}
                    </div>

                    <div className="h-px bg-slate-800 w-full mb-8" />

                    {/* Author Info */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold mb-4 text-slate-200">About the {skill.type === "TEACH" ? "Instructor" : "Learner"}</h2>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white">
                                {skill.authorName.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">{skill.authorName}</h3>
                                <p className="text-slate-400 text-sm">Member since 2024</p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h2 className="text-xl font-bold mb-4 text-slate-200">Skill Description</h2>
                        <div className="text-slate-300 leading-relaxed space-y-4">
                            <p>
                                This is a great opportunity to connect with {skill.authorName} about {skill.name}.
                                {skill.type === "TEACH"
                                    ? ` They are offering to teach this skill in the ${skill.category} category.`
                                    : ` They are looking to learn this skill in the ${skill.category} category.`
                                }
                            </p>
                            <p className="text-slate-400 italic">
                                "Connect with me to discuss how we can swap skills!"
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
