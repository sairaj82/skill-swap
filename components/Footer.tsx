export default function Footer() {
    return (
        <footer className="bg-slate-950 border-t border-white/10 mt-auto">
            <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
                <div className="flex justify-center space-x-6">
                    <p className="text-center text-slate-400 font-display">
                        Built for the community.
                    </p>
                </div>
                <div className="mt-8">
                    <p className="text-center text-base text-slate-500">
                        &copy; {new Date().getFullYear()} Skill Swap. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
