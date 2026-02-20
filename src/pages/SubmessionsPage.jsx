import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import TeamCard from "../components/Teamcards";
const AVATAR_COLORS = [
  "bg-violet-500","bg-cyan-500","bg-rose-500","bg-amber-500",
  "bg-emerald-500","bg-indigo-500","bg-pink-500","bg-teal-500",
];
export default function SubmessionsPage() {
  const [search, setSearch] = useState("");
  const [filterSubmission, setFilterSubmission] = useState("ALL");
    const [TEAMS,setTeams]=useState([])
    const fetchTeams=async()=>{
        try {
            let adminCode = sessionStorage.getItem("adminCode");
            const res=await axios.get(`https://hackthon-backend-1-d2zj.onrender.com/admin/Teamdata?adminCode=${adminCode}`)
            setTeams(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
      let adminCode = sessionStorage.getItem("adminCode");
    if (!adminCode) {
      adminCode = window.prompt("Enter Admin Code:");

      if (!adminCode) {
        alert("Admin code is required!");
        return;
      }
      sessionStorage.setItem("adminCode", adminCode);
    }
        fetchTeams(adminCode);
    },[])



  const submittedCount = TEAMS.filter((t) => t.problemstatment.length > 0).length;
  const totalRevenue = TEAMS.reduce((s, t) => s + t.amount, 0);

  const filtered = TEAMS.filter((t) => {
    const matchSearch =
      t.teamName.toLowerCase().includes(search.toLowerCase()) ||
      t.teamLead.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filterSubmission === "ALL"
        ? true
        : filterSubmission === "SUBMITTED"
        ? t.problemstatment.length > 0
        : t.problemstatment.length === 0;
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');`}</style>

      {/* Topbar */}
      <div className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center font-black text-sm text-white">A</div>
          <span className="font-black text-lg tracking-tight text-gray-900">TeamAdmin</span>
        </div>
        <div className="text-xs text-gray-400 font-mono hidden sm:block">
          {new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-6">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            label="Total Teams"
            value={TEAMS.length}
            sub="registered"
            iconBg="bg-violet-100"
            icon="👥"
          />
          <StatCard
            label="Paid Teams"
            value={TEAMS.length}
            sub="all verified"
            iconBg="bg-emerald-100"
            icon="✅"
          />
          <StatCard
            label="Submissions"
            value={submittedCount}
            sub={`${TEAMS.length - submittedCount} pending`}
            iconBg="bg-amber-100"
            icon="📄"
          />
          <StatCard
            label="Revenue"
            value={`₹${totalRevenue.toLocaleString()}`}
            sub="total collected"
            iconBg="bg-cyan-100"
            icon="💰"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search by team or lead name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
            />
          </div>
          <div className="flex gap-2">
            {[
              { key: "ALL", label: "All" },
              { key: "SUBMITTED", label: "Submitted" },
              { key: "PENDING", label: "Pending" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterSubmission(f.key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap
                  ${filterSubmission === f.key
                    ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                    : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-gray-400 -mt-2 font-mono">
          Showing {filtered.length} of {TEAMS.length} teams — click a card to expand
        </div>

        <div className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400 text-sm">No teams match your search</div>
          ) : (
            filtered.map((team) => <TeamCard key={team._id} team={team} />)
          )}
        </div>
      </div>
    </div>
  );
}



function getInitials(name) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function avatarColor(name) {
  let h = 0;
  for (let c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function Avatar({ name, size = "sm" }) {
  const sz = size === "lg" ? "w-9 h-9 text-sm" : "w-7 h-7 text-xs";
  return (
    <div className={`${sz} ${avatarColor(name)} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`}>
      {getInitials(name)}
    </div>
  );
}

function StatCard({ label, value, sub, iconBg, icon }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{label}</span>
        <div className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center text-base`}>{icon}</div>
      </div>
      <div>
        <div className="text-2xl font-black text-gray-900 leading-tight break-all">{value}</div>
        {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

