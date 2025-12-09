"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Register() {
    const { register } = useAuth();
    const [success, setSuccess] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const success = register({ name, email, password });

        if (success) {
            setSuccess(true);
        } else {
            setError("User with this email already exists.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden py-20">
                {/* Background Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 blur-[120px] rounded-full -z-10" />

                <div className="glass-card w-full max-w-md p-8 rounded-2xl animate-in fade-in zoom-in duration-500">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                        <p className="text-slate-400">Join the community and start swapping skills.</p>
                    </div>

                    {success ? (
                        <div className="text-center py-8 animate-in fade-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl border border-green-500/30">
                                ✓
                            </div>
                            <h2 className="text-2xl font-bold mb-2 text-white">Successfully Registered!</h2>
                            <p className="text-slate-400 mb-6">Your account has been created.</p>
                            <Link
                                href="/login"
                                className="inline-block w-full py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all hover:scale-[1.02] shadow-lg shadow-indigo-500/25"
                            >
                                Go to Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                                    {error}
                                </div>
                            )}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-500 transition-all focus:border-indigo-500"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-500 transition-all focus:border-indigo-500"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-500 transition-all focus:border-indigo-500"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all hover:scale-[1.02] shadow-lg shadow-indigo-500/25"
                            >
                                Create Account
                            </button>
                        </form>
                    )}

                    {!success && (
                        <div className="mt-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-700"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-slate-900 text-slate-500">Or sign up with</span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <button className="flex items-center justify-center px-4 py-2 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors">
                                    <span className="sr-only">Google</span>
                                    <span className="font-bold text-slate-300">Google</span>
                                </button>
                                <button className="flex items-center justify-center px-4 py-2 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors">
                                    <span className="sr-only">GitHub</span>
                                    <span className="font-bold text-slate-300">GitHub</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {!success && (
                        <div className="mt-6 text-center text-sm text-slate-400">
                            Already have an account?{" "}
                            <Link href="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
                                Log in
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

