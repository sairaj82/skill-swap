"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SkillCard from "@/components/SkillCard";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
    const { user, isAuthenticated, updateUser } = useAuth();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [location, setLocation] = useState("");

    useEffect(() => {
        if (!isAuthenticated) {
            // Redirect or show loading if not authenticated
            // For now, we'll let the user see a 'not logged in' state or redirect
            // router.push("/login"); 
        }
        if (user) {
            setName(user.name || "");
            setBio(user.bio || "Passionate about technology and sustainable living. Always looking to learn new things and share my knowledge with others.");
            setLocation(user.location || "San Francisco, CA");
        }
    }, [user, isAuthenticated]);

    const handleSave = () => {
        updateUser({ name, bio, location });
        setIsEditing(false);
    };

    const handleCancel = () => {
        if (user) {
            setName(user.name || "");
            setBio(user.bio || "");
            setLocation(user.location || "");
        }
        setIsEditing(false);
    };

    // Mock data for skills (would normally come from an API/Context too)
    const teachingSkills = [
        {
            id: "101",
            title: "React Native Development",
            description: "Build cross-platform mobile apps. I can teach you the basics of React Native and Expo.",
            category: "Development",
            authorName: user?.name || "User",
            authorId: user?.id || "mock-user-id",
            type: "TEACH" as const,
        },
        {
            id: "102",
            title: "Sustainable Gardening",
            description: "How to grow your own vegetables in limited space. Balcony gardening tips.",
            category: "Lifestyle",
            authorName: user?.name || "User",
            authorId: user?.id || "mock-user-id",
            type: "TEACH" as const,
        },
    ];

    const learningSkills = [
        {
            id: "201",
            title: "Pottery Wheel Throwing",
            description: "I've always wanted to try pottery. Looking for a beginner workshop or mentor.",
            category: "Art",
            authorName: user?.name || "User",
            authorId: user?.id || "mock-user-id",
            type: "LEARN" as const,
        },
    ];

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow pt-24 px-4 flex items-center justify-center">
                    <p className="text-slate-400">Please log in to view your profile.</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-20">
                {/* Profile Header */}
                <div className="relative mb-12">
                    {/* Banner */}
                    <div className="h-48 w-full bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-2xl overflow-hidden opacity-80">
                        <div className="absolute inset-0 bg-black/20" />
                    </div>

                    {/* Avatar and Info */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 px-6 sm:px-10 gap-6">
                        <div className={`w-32 h-32 rounded-full border-4 border-slate-950 bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-4xl font-bold shadow-2xl z-10`}>
                            {user.name.charAt(0)}
                        </div>

                        <div className="text-center sm:text-left mb-2 z-10 flex-grow w-full">
                            {isEditing ? (
                                <div className="space-y-4 bg-slate-900/90 p-6 rounded-xl border border-white/10 backdrop-blur-md mt-4 sm:mt-0">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">Name</label>
                                        <input
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">Location</label>
                                        <input
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">Bio</label>
                                        <textarea
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex gap-2 justify-end pt-2">
                                        <button
                                            onClick={handleCancel}
                                            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition-all"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-3xl font-bold">{user.name}</h1>
                                    <div className="text-slate-400 flex flex-wrap justify-center sm:justify-start gap-4 mt-1 text-sm">
                                        {location && <span>📍 {location}</span>}
                                        <span>📅 Member since 2024</span>
                                    </div>
                                </>
                            )}
                        </div>

                        {!isEditing && (
                            <div className="mb-4 z-10">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-colors font-medium"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        )}
                    </div>

                    {!isEditing && bio && (
                        <div className="mt-6 px-6 sm:px-10 max-w-3xl">
                            <p className="text-slate-300 leading-relaxed text-lg">{bio}</p>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Teaching Section */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-sm">🎓</span>
                                Skills I Teach
                            </h2>
                            <button className="text-sm text-indigo-400 hover:text-indigo-300">
                                + Add New
                            </button>
                        </div>
                        <div className="space-y-4">
                            {teachingSkills.map(skill => (
                                <SkillCard key={skill.id} {...skill} />
                            ))}
                        </div>
                    </div>

                    {/* Learning Section */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400 text-sm">🌱</span>
                                Skills I'm Learning
                            </h2>
                            <button className="text-sm text-pink-400 hover:text-pink-300">
                                + Add New
                            </button>
                        </div>
                        <div className="space-y-4">
                            {learningSkills.map(skill => (
                                <SkillCard key={skill.id} {...skill} />
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
