import Link from "next/link";

interface SkillCardProps {
    id: string;
    title: string;
    description: string;
    category: string;
    authorName: string;
    type: "TEACH" | "LEARN";
}

export default function SkillCard({
    id,
    title,
    description,
    category,
    authorName,
    type,
}: SkillCardProps) {
    return (
        <div className="glass-card rounded-xl p-6 transition-all duration-300 hover:scale-[1.02] hover:bg-slate-800/60 group animate-fade-in">
            <div className="flex justify-between items-start mb-4">
                <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${type === "TEACH"
                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                        : "bg-pink-500/20 text-pink-300 border border-pink-500/30"
                        }`}
                >
                    {type === "TEACH" ? "Teaching" : "Learning"}
                </span>
                <span className="text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded border border-slate-700">
                    {category}
                </span>
            </div>

            <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">
                {title}
            </h3>
            <p className="text-slate-400 text-sm mb-6 line-clamp-3">
                {description}
            </p>

            <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                        {authorName.charAt(0)}
                    </div>
                    <span className="text-sm text-slate-300">{authorName}</span>
                </div>

                <Link
                    href={`/skill/${id}`}
                    className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
                >
                    Details &rarr;
                </Link>
            </div>
        </div>
    );
}
