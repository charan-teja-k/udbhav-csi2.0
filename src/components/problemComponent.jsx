import {
  Search,
  Code,
  Brain,
  Smartphone,
  Globe,
  Shield,
  Heart,
  Zap,
  Leaf,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
} from "lucide-react"
const ProblemCard = ({ problem, isExpanded, onToggle, index }) => {
  const iconMap = {
    "AI/ML": Brain,
    "Web Development": Globe,
    "Mobile App": Smartphone,
    Cybersecurity: Shield,
    Healthcare: Heart,
    IoT: Zap,
    Sustainability: Leaf,
    EdTech: BookOpen,
  }

  const Icon = iconMap[problem.category] || Code

  const difficultyColors = {
    Easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Medium: "bg-amber-50 text-amber-700 border-amber-200",
    Hard: "bg-rose-50 text-rose-700 border-rose-200",
  }

  const categoryColors = {
    "AI/ML": "bg-violet-50 text-violet-700 border-violet-200",
    "Web Development": "bg-blue-50 text-blue-700 border-blue-200",
    "Mobile App": "bg-indigo-50 text-indigo-700 border-indigo-200",
    Cybersecurity: "bg-red-50 text-red-700 border-red-200",
    Healthcare: "bg-pink-50 text-pink-700 border-pink-200",
    IoT: "bg-amber-50 text-amber-700 border-amber-200",
    Sustainability: "bg-green-50 text-green-700 border-green-200",
    EdTech: "bg-cyan-50 text-cyan-700 border-cyan-200",
  }

  return (
    <div
      className="bg-white rounded-xl border border-slate-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Header - Always Visible */}
      <div className="p-6 cursor-pointer" onClick={onToggle}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div
              className={`p-3 ${categoryColors[problem.category]} rounded-xl border transition-transform duration-300 hover:scale-105`}
            >
              <Icon size={24} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-sm font-medium text-slate-500">#{problem.id}</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${difficultyColors[problem.difficulty]}`}
                >
                  {problem.difficulty}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${categoryColors[problem.category]}`}
                >
                  {problem.category}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 hover:text-blue-600 transition-colors">
                {problem.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">{problem.description}</p>
            </div>
          </div>
          <button className="p-2 hover:bg-slate-50 rounded-lg transition-all duration-200">
            {isExpanded ? (
              <ChevronUp className="text-slate-600" size={20} />
            ) : (
              <ChevronDown className="text-slate-600" size={20} />
            )}
          </button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4 ml-16">
          {problem.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-slate-50 rounded-md text-sm text-slate-700 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all duration-200 cursor-default"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-6 border-t border-slate-100 pt-6 animate-expandDown">
          {/* Requirements */}
          <div className="animate-fadeIn">
            <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-blue-600 rounded"></span>
              Requirements
            </h4>
            <ul className="space-y-2 ml-6">
              {problem.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-700 leading-relaxed">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Expected Deliverables */}
          <div className="animate-fadeIn" style={{ animationDelay: "100ms" }}>
            <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-cyan-500 rounded"></span>
              Expected Deliverables
            </h4>
            <ul className="space-y-2 ml-6">
              {problem.deliverables.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-700 leading-relaxed">
                  <span className="text-emerald-600 text-lg">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technologies */}
          <div className="animate-fadeIn" style={{ animationDelay: "200ms" }}>
            <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-indigo-600 rounded"></span>
              Suggested Technologies
            </h4>
            <div className="flex flex-wrap gap-2 ml-6">
              {problem.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-slate-50 rounded-lg text-slate-700 font-medium border border-slate-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Points */}
          <div
            className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 ml-6 hover:shadow-md transition-all duration-300"
            style={{ animationDelay: "300ms" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-semibold">Total Points</span>
              <span className="text-3xl font-bold text-blue-600">{problem.points}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default ProblemCard;