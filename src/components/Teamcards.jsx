import { useState } from "react";

const AVATAR_COLORS = [
  "bg-violet-500", "bg-cyan-500", "bg-rose-500", "bg-amber-500",
  "bg-emerald-500", "bg-indigo-500", "bg-pink-500", "bg-teal-500",
];

function getInitials(name) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function avatarColor(name) {
  let h = 0;
  for (let c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function Avatar({ name, size = "sm" }) {
  const sz =
    size === "xl" ? "w-12 h-12 text-base" :
    size === "lg" ? "w-9 h-9 text-sm" :
    "w-7 h-7 text-xs";
  return (
    <div className={`${sz} ${avatarColor(name)} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ring-2 ring-white shadow-sm`}>
      {getInitials(name)}
    </div>
  );
}

// Google Drive folder/file icon SVG
function DriveIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
      <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
      <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/>
      <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
      <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
      <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
      <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 27h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
    </svg>
  );
}

function PPTSection({ ppt }) {
  // Try to extract a readable name from the drive URL
  const getFileName = (url) => {
    try {
      if (url.includes("drive.google.com")) return "Google Drive File";
      const parts = url.split("/");
      const name = parts[parts.length - 1].split("?")[0];
      return name || "Presentation File";
    } catch {
      return "Presentation File";
    }
  };

  if (!ppt) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl px-4 py-8 text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl">📂</div>
        <p className="text-sm font-bold text-gray-500">No PPT uploaded yet</p>
        <p className="text-xs text-gray-400">This team hasn't submitted a presentation file yet.</p>
      </div>
    );
  }

  return (
    <a
      href={ppt}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-4 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 cursor-pointer"
    >
      {/* Drive icon */}
      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 border border-blue-100 group-hover:shadow-md transition-shadow">
        <DriveIcon />
      </div>

      {/* File info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900 truncate">{getFileName(ppt)}</p>
        <p className="text-xs text-blue-500 font-mono truncate mt-0.5">{ppt}</p>
        <div className="flex items-center gap-1 mt-1.5">
          <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full uppercase tracking-wide">Google Drive</span>
        </div>
      </div>

      {/* Open arrow */}
      <div className="w-8 h-8 rounded-full bg-white border border-blue-200 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-200 shadow-sm">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 group-hover:text-white transition-colors">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
      </div>
    </a>
  );
}

export default function TeamCard({ team }) {
  const [expanded, setExpanded] = useState(false);
  const hasSubmissions = team.problemstatment.length > 0;

  return (
    <div
      className={`rounded-2xl transition-all duration-300 overflow-hidden bg-white
        ${expanded
          ? "shadow-xl ring-2 ring-violet-400 ring-offset-1"
          : "shadow-md ring-1 ring-gray-200 hover:shadow-lg hover:ring-gray-300"
        }`}
    >
      {/* ── Card Header ── */}
      <button onClick={() => setExpanded((p) => !p)} className="w-full text-left group">
        {/* Coloured accent strip */}
        <div className={`h-1 w-full transition-all duration-300 ${expanded ? "bg-violet-500" : `${avatarColor(team.teamName)} opacity-60`}`} />

        <div className="px-4 sm:px-6 py-4 flex items-center gap-3 sm:gap-4">
          {/* Team letter avatar */}
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-black text-xl text-white flex-shrink-0 shadow-md ${avatarColor(team.teamName)}`}>
            {team.teamName[0].toUpperCase()}
          </div>

          {/* Name + lead */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="font-black text-gray-900 capitalize text-base sm:text-lg leading-tight">{team.teamName}</span>
              <span className="text-[11px] text-gray-400 font-mono bg-gray-100 px-1.5 py-0.5 rounded-md">#{team._id.slice(-6)}</span>
            </div>
            <p className="text-sm text-gray-500 truncate mt-0.5">{team.teamLead.name}</p>
          </div>

          {/* Badges — desktop */}
          <div className="hidden sm:flex flex-col items-end gap-1.5 flex-shrink-0">
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              PAID
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              hasSubmissions ? "bg-violet-50 text-violet-700 border border-violet-200" : "bg-orange-50 text-orange-500 border border-orange-200"
            }`}>
              {hasSubmissions ? `${team.problemstatment.length} submission${team.problemstatment.length > 1 ? "s" : ""}` : "No submissions"}
            </span>
          </div>

          {/* Chevron */}
          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${expanded ? "bg-violet-100 rotate-180" : "bg-gray-100 group-hover:bg-gray-200"}`}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={expanded ? "#7c3aed" : "#9ca3af"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        {/* Badges — mobile */}
        <div className="sm:hidden flex items-center gap-2 px-4 pb-3">
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            PAID
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            hasSubmissions ? "bg-violet-50 text-violet-700 border border-violet-200" : "bg-orange-50 text-orange-500 border border-orange-200"
          }`}>
            {hasSubmissions ? `${team.problemstatment.length} submission${team.problemstatment.length > 1 ? "s" : ""}` : "No submissions"}
          </span>
        </div>
      </button>

      {/* ── Expanded Body ── */}
      {expanded && (
        <div className="border-t border-gray-100 px-4 sm:px-6 py-5 flex flex-col gap-6">

          {/* Lead + Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-4 border border-violet-100">
              <p className="text-[10px] font-black text-violet-500 uppercase tracking-widest mb-3">Team Lead</p>
              <div className="flex items-center gap-3">
                <Avatar name={team.teamLead.name} size="xl" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 leading-snug">{team.teamLead.name}</p>
                  <a href={`tel:${team.teamLead.mobile}`} className="text-xs text-violet-600 font-mono mt-1 flex items-center gap-1 hover:text-violet-800 transition-colors">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/>
                    </svg>
                    {team.teamLead.mobile}
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100 flex flex-col justify-between">
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3">Amount Paid</p>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-black text-emerald-700 leading-none">₹{team.amount.toLocaleString()}</span>
                <div className="w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Members */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Team Members</p>
              <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-0.5 rounded-full">{team.teamMembers.length}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {team.teamMembers.map((m, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100 hover:bg-gray-100 transition-colors">
                  <Avatar name={m.name} size="lg" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 leading-snug truncate">{m.name}</p>
                    <p className="text-xs text-gray-400">Member {i + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Problem Statements */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Problem Statements</p>
              {hasSubmissions && (
                <span className="bg-violet-100 text-violet-600 text-xs font-bold px-2 py-0.5 rounded-full">{team.problemstatment.length}</span>
              )}
            </div>
            {hasSubmissions ? (
              <div className="flex flex-col gap-2">
                {team.problemstatment.map((p, i) => (
                  <div key={i} className="flex items-start gap-3 bg-violet-50 border border-violet-100 rounded-xl px-4 py-3 hover:bg-violet-100 transition-colors">
                    <span className="w-5 h-5 rounded-full bg-violet-200 text-violet-700 flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-sm text-gray-800 font-medium leading-snug">{p}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl px-4 py-8 text-center">
                <span className="text-4xl">📭</span>
                <p className="text-sm font-bold text-gray-500">No submissions yet</p>
                <p className="text-xs text-gray-400 max-w-xs">This team hasn't submitted any problem statements yet.</p>
              </div>
            )}
          </div>

          {/* PPT / Drive File */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Presentation File</p>
              {team.ppt && (
                <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">Uploaded</span>
              )}
            </div>
            <PPTSection ppt={team.ppt} />
          </div>

        </div>
      )}
    </div>
  );
}