"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function Login() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Attempt to log in with credentials
        const success = login({ email, password });

        if (success) {
            router.push("/profile");
        } else {
            setError("Invalid email or password.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 blur-[120px] rounded-full -z-10" />

                <div className="glass-card w-full max-w-md p-8 rounded-2xl animate-in fade-in zoom-in duration-500">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                        <p className="text-slate-400">Log in to continue your learning journey.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-500 transition-all focus:border-indigo-500"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                                    Password
                                </label>
                                <Link href="#" className="text-xs text-indigo-400 hover:text-indigo-300">
                                    Forgot password?
                                </Link>
                            </div>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-500 transition-all focus:border-indigo-500"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all hover:scale-[1.02] shadow-lg shadow-indigo-500/25"
                        >
                            Log In
                        </button>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-slate-900 text-slate-500">Or continue with</span>
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

                    <div className="mt-6 text-center text-sm text-slate-400">
                        Don't have an account?{" "}
                        <Link href="/register" className="font-medium text-indigo-400 hover:text-indigo-300">
                            Sign up
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
