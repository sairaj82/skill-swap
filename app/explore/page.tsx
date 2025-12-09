"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SkillCard from "@/components/SkillCard";
import { useState } from "react";
import { useUsers } from "@/context/UsersContext";

// Mock Data

const CATEGORIES = ["All", "Development", "Design", "Language", "Art", "Music", "Cooking", "Lifestyle"];

export default function Explore() {
    const { getAllSkills } = useUsers();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [filterType, setFilterType] = useState<"ALL" | "TEACH" | "LEARN">("ALL");

    const availableSkills = getAllSkills();

    const filteredSkills = availableSkills.filter((skill) => {
        const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || skill.category === selectedCategory;
        const matchesType = filterType === "ALL" || skill.type === filterType;

        return matchesSearch && matchesCategory && matchesType;
    });

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold mb-4">Explore Skills</h1>
                    <p className="text-slate-400">Find what you want to learn, or see what others need help with.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-6 mb-10">
                    <div className="flex-grow">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search skills..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-100 placeholder-slate-500"
                            />
                            <svg className="h-5 w-5 text-slate-500 absolute right-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as "ALL" | "TEACH" | "LEARN")}
                            className="bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="ALL">All Types</option>
                            <option value="TEACH">Teaching</option>
                            <option value="LEARN">Learning</option>
                        </select>
                    </div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                                : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20 animate-in fade-in zoom-in duration-500">
                    {filteredSkills.length > 0 ? (
                        filteredSkills.map((skill) => (
                            <SkillCard
                                key={`${skill.id}-${skill.type}`}
                                id={skill.id}
                                title={skill.name}
                                description={`A ${skill.category} skill offered by ${skill.authorName}. Connect to learn more!`}
                                category={skill.category}
                                authorName={skill.authorName}
                                type={skill.type}
                            />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-bold mb-2">No skills found</h3>
                            <p className="text-slate-400">Try adjusting your search or filters.</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
