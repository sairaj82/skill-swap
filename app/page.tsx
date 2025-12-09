import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SkillCard from "@/components/SkillCard";
import Link from "next/link";

export default function Home() {
  const featuredSkills = [
    {
      id: "1",
      title: "Advanced React Patterns",
      description: "Master higher-order components, render props, and custom hooks to build scalable applications.",
      category: "Development",
      authorName: "Alex Dev",
      type: "TEACH" as const,
    },
    {
      id: "2",
      title: "Conversational Spanish",
      description: "Looking for someone to practice Spanish conversation with. I can offer English tutoring in return.",
      category: "Language",
      authorName: "Maria Garcia",
      type: "LEARN" as const,
    },
    {
      id: "3",
      title: "Digital Photography Basics",
      description: "Learn how to use your DSLR camera manually. ISO, Aperture, Shutter Speed explained simply.",
      category: "Art",
      authorName: "John Camera",
      type: "TEACH" as const,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 py-24 sm:py-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full -z-10 animate-pulse" />

          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8 bg-gradient-to-br from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
              Exchange Skills. <br />
              <span className="text-indigo-400">Learn Together.</span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join a community where knowledge is the currency. Swap your expertise for new skills—no money involved.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up">
              <Link
                href="/explore"
                className="px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-indigo-500/25"
              >
                Find a Skill
              </Link>
              <Link
                href="/profile"
                className="px-8 py-4 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-lg border border-slate-700 hover:border-slate-600 transition-all hover:scale-105"
              >
                Share Your Skill
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Skills Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-slate-900/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold mb-2">Featured Opportunities</h2>
                <p className="text-slate-400">Discover what's happening in the community today.</p>
              </div>
              <Link href="/explore" className="text-indigo-400 hover:text-indigo-300 font-medium hidden sm:block">
                View all &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredSkills.map((skill) => (
                <SkillCard key={skill.id} {...skill} />
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link href="/explore" className="text-indigo-400 hover:text-indigo-300 font-medium">
                View all &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-colors">
              <div className="w-12 h-12 mx-auto bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400 mb-4 text-2xl">
                🤝
              </div>
              <h3 className="text-xl font-bold mb-2">Direct Exchange</h3>
              <p className="text-slate-400">Connect directly with others. You teach them, they teach you. Simple.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-pink-500/30 transition-colors">
              <div className="w-12 h-12 mx-auto bg-pink-500/20 rounded-lg flex items-center justify-center text-pink-400 mb-4 text-2xl">
                💬
              </div>
              <h3 className="text-xl font-bold mb-2">Real-time Chat</h3>
              <p className="text-slate-400">Discuss learning goals and schedule sessions instantly with built-in messaging.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-violet-500/30 transition-colors">
              <div className="w-12 h-12 mx-auto bg-violet-500/20 rounded-lg flex items-center justify-center text-violet-400 mb-4 text-2xl">
                🌱
              </div>
              <h3 className="text-xl font-bold mb-2">Community Growth</h3>
              <p className="text-slate-400">Join a supportive environment focused on continuous learning and helping others.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
