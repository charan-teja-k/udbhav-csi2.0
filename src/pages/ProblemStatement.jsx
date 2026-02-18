
import { useState } from "react"
import {
  Search,
  Code,
  ArrowLeft,
} from "lucide-react"
import {problems,difficulties,categories} from "../data"
import ProblemCard  from "../components/problemComponent"
import { useNavigate } from "react-router-dom"
export default function ProblemStatements() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [expandedProblem, setExpandedProblem] = useState(null)
  const navigation =useNavigate()
  const handleBack = () => {
    navigation(-1)
  }

 

  
  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || problem.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "All" || problem.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const toggleProblem = (problemId) => {
    setExpandedProblem(expandedProblem === problemId ? null : problemId)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-12">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="group flex items-center gap-2 text-blue-200 hover:text-white mb-8 transition-all duration-200"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </button>

          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg backdrop-blur-sm border border-blue-400/30">
                <Code className="text-blue-300" size={28} />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">Problem Statements</h1>
            </div>
            <p className="text-lg text-blue-100 leading-relaxed">
              Choose from <span className="font-semibold text-white">8 challenging problems</span> across various
              domains. Build innovative solutions and showcase your technical skills.
            </p>
          </div>
        </div>

        {/* Subtle Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 48h1440V0c-360 48-720 48-1080 0S360 0 0 0v48z" fill="rgb(248, 250, 252)" />
          </svg>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search problems by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400"
            />
          </div>

          {/* Filters */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Difficulty</label>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedDifficulty === difficulty
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-600">
              Showing <span className="font-semibold text-slate-900">{filteredProblems.length}</span> of{" "}
              <span className="font-semibold text-slate-900">{problems.length}</span> problems
            </p>
          </div>
        </div>
      </div>

      {/* Problems List */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="space-y-6">
          {filteredProblems.length > 0 ? (
            filteredProblems.map((problem, index) => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                isExpanded={expandedProblem === problem.id}
                onToggle={() => toggleProblem(problem.id)}
                index={index}
              />
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                <Search className="text-slate-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No problems found</h3>
              <p className="text-slate-600">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-900 border-t border-slate-800 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-slate-400">
            Need help? Contact us at{" "}
            <a href="mailto:support@example.com" className="text-blue-400 hover:text-blue-300 transition-colors">
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
