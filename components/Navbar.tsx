"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();

    const links = [
        { href: "/", label: "Home" },
        { href: "/explore", label: "Explore" },
        // Only show Messages and Profile if authenticated
        ...(isAuthenticated ? [
            { href: "/messages", label: "Messages" },
            { href: "/requests", label: "Requests" },
            { href: "/profile", label: "Profile" },
        ] : []),
    ];

    return (
        <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="font-display text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mr-10 hover:scale-105 transition-transform duration-300">
                            Skill Swap
                        </Link>
                        <div className="hidden md:block">
                            <div className="flex items-baseline space-x-4">
                                {links.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === link.href
                                            ? "text-white bg-white/10"
                                            : "text-slate-300 hover:text-white hover:bg-white/5"
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:block">
                        <div className="flex items-center space-x-4">
                            {isAuthenticated ? (
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-slate-400">Hi, {user?.name}</span>
                                    <button
                                        onClick={logout}
                                        className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                                        Log in
                                    </Link>
                                    <Link href="/register" className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all hover:scale-105 shadow-lg shadow-indigo-500/25">
                                        Sign up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/10 focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            {/* Menu Icon */}
                            {!isOpen ? (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden glass border-b border-white/10">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === link.href
                                    ? "text-white bg-white/10"
                                    : "text-slate-300 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="border-t border-white/10 my-2 pt-2">
                            {isAuthenticated ? (
                                <button
                                    onClick={() => {
                                        logout();
                                        setIsOpen(false);
                                    }}
                                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-white/5"
                                >
                                    Logout
                                </button>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        onClick={() => setIsOpen(false)}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-white/5"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={() => setIsOpen(false)}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-indigo-400 hover:text-indigo-300 hover:bg-white/5"
                                    >
                                        Sign up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
