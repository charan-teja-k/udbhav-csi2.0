import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Users, User, ClipboardList, MessageSquare, CheckSquare, AlertCircle, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import axios from 'axios';

export default function CheckTasks() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const [teamCode, setTeamCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [teamData, setTeamData] = useState(null);
  const [error, setError] = useState('');
  const [expandedRounds, setExpandedRounds] = useState({});

  // Canvas animation (matching project theme)
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];
    const particleCount = 50;
    const maxDistance = 150;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.4 + 0.2;
        const leftSide = this.x < canvas.width / 2;
        if (leftSide) {
          this.color = { r: 80, g: 150, b: 255 };
        } else {
          this.color = { r: 220, g: 80, b: 200 };
        }
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        this.x = Math.max(0, Math.min(canvas.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height, this.y));
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        const checkLimit = Math.min(i + 12, particles.length);
        for (let j = i + 1; j < checkLimit; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = dx * dx + dy * dy;
          const maxDistSq = maxDistance * maxDistance;

          if (distance < maxDistSq) {
            const actualDist = Math.sqrt(distance);
            const opacity = (1 - actualDist / maxDistance) * 0.2;
            const avgColor = {
              r: (particles[i].color.r + particles[j].color.r) / 2,
              g: (particles[i].color.g + particles[j].color.g) / 2,
              b: (particles[i].color.b + particles[j].color.b) / 2
            };

            ctx.beginPath();
            ctx.strokeStyle = `rgba(${avgColor.r}, ${avgColor.g}, ${avgColor.b}, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawConnections();
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleVerifyTeam = async () => {
    if (!teamCode.trim()) {
      setError('Please enter a team code');
      return;
    }

    setIsVerifying(true);
    setError('');
    setTeamData(null);

    try {
      const teamRes = await axios.get(
        `https://hackthon-backend-1-d2zj.onrender.com/get-team-details/${encodeURIComponent(teamCode)}`
      );
      if (!teamRes) {
        throw new Error('Team not found. Please check your team code.');
      }
      setTeamData(teamRes.data);

      // Expand deduplicated rounds by default (latest entry per round)
      const latestByRound = {};
      (teamRes.data.remarks || []).forEach(r => { latestByRound[r.round] = r; });
      const expanded = {};
      Object.values(latestByRound).forEach(r => { expanded[r._id] = true; });
      setExpandedRounds(expanded);
    } catch (err) {
      setError(err.message || 'Failed to verify team. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReset = () => {
    setTeamCode('');
    setTeamData(null);
    setError('');
    setExpandedRounds({});
  };

  const toggleRound = (id) => {
    setExpandedRounds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 animated-gradient-bg">
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
          style={{ mixBlendMode: 'screen', opacity: 0.6 }}
        />
      </div>

      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-500/30 bg-teal-500/10 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <ClipboardList className="w-4 h-4 text-teal-400" />
              <span className="text-sm text-teal-400 font-medium">Track Your Progress</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-teal-300 via-cyan-400 to-teal-500 bg-clip-text text-transparent">
                Check Tasks
              </span>
            </h1>
            <p className="text-gray-400 text-lg">
              View your assigned tasks and comments for UDBHAV 2K26
            </p>
          </div>

          {/* Main Card */}
          <div className="glass-card p-6 md:p-8">
            {/* Step 1: Team Code Input */}
            {!teamData && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                    <Search className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Verify Your Team</h2>
                    <p className="text-gray-400 text-sm">Enter your team code to view tasks</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Team Code
                    </label>
                    <input
                      type="text"
                      value={teamCode}
                      onChange={(e) => setTeamCode(e.target.value)}
                      placeholder="Enter your team code (e.g., TEAM-1234567890)"
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-teal-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                      onKeyDown={(e) => e.key === 'Enter' && handleVerifyTeam()}
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-red-400 text-sm"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </motion.div>
                  )}

                  <Button
                    onClick={handleVerifyTeam}
                    disabled={isVerifying}
                    className="w-full py-3"
                  >
                    {isVerifying ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Verify Team
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Team Details + Sections */}
            {teamData && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Back Button */}
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors mb-6"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">Change Team</span>
                </button>

                {/* Team Info Card */}
                <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-5 mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{teamData.teamName}</h3>
                      <p className="text-teal-400 text-sm font-mono">{teamData.teamcode}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <User className="w-4 h-4 text-gray-400 mt-1" />
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wider">Team Lead</p>
                        <p className="text-white font-medium">{teamData.teamLead?.name || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users className="w-4 h-4 text-gray-400 mt-1" />
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wider">Team Members</p>
                        <p className="text-white font-medium">
                          {teamData.teamMembers?.length > 0
                            ? teamData.teamMembers.map(m => m.name).join(', ')
                            : 'No additional members'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 1: Comments */}
                {(() => {
                  // Deduplicate by round — last entry per round wins (matches backend append behaviour)
                  const latestByRound = {};
                  (teamData.remarks || []).forEach(r => { latestByRound[r.round] = r; });
                  const latestRemarks = Object.values(latestByRound).sort((a, b) => a.round - b.round);
                  const remarksWithComments = latestRemarks.filter(r => r.comment);
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="mb-8"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <MessageSquare className="w-4 h-4 text-purple-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Comments</h2>
                        {remarksWithComments.length > 0 && (
                          <span className="ml-auto text-xs text-purple-400 bg-purple-500/10 border border-purple-500/30 px-2 py-1 rounded-full">
                            {remarksWithComments.length} {remarksWithComments.length === 1 ? 'comment' : 'comments'}
                          </span>
                        )}
                      </div>

                      {remarksWithComments.length > 0 ? (
                        <div className="space-y-3">
                          {remarksWithComments.map((remark, index) => (
                            <motion.div
                              key={remark._id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.05 * index }}
                              className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4"
                            >
                              <div className="flex items-start gap-3">
                                <span className="mt-0.5 px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold flex-shrink-0">
                                  R{remark.round}
                                </span>
                                <p className="text-gray-200 text-sm leading-relaxed break-words whitespace-pre-wrap">
                                  {remark.comment}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center">
                          <MessageSquare className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm">No comments yet</p>
                        </div>
                      )}
                    </motion.div>
                  );
                })()}

                {/* Divider */}
                <div className="border-t border-white/10 mb-8" />

                {/* Section 2: Tasks */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {(() => {
                    const latestByRound = {};
                    (teamData.remarks || []).forEach(r => { latestByRound[r.round] = r; });
                    const latestRemarks = Object.values(latestByRound).sort((a, b) => a.round - b.round);
                    return (
                      <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-full bg-teal-500/20 flex items-center justify-center">
                      <CheckSquare className="w-4 h-4 text-teal-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Tasks</h2>
                    {latestRemarks.length > 0 && (
                      <span className="ml-auto text-xs text-teal-400 bg-teal-500/10 border border-teal-500/30 px-2 py-1 rounded-full">
                        {latestRemarks.length} {latestRemarks.length === 1 ? 'round' : 'rounds'}
                      </span>
                    )}
                  </div>

                  {latestRemarks.length > 0 ? (
                    <div className="space-y-4">
                      {latestRemarks.map((remark, index) => (
                        <motion.div
                          key={remark._id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.06 * index }}
                          className="bg-teal-500/10 border border-teal-500/20 rounded-lg overflow-hidden"
                        >
                          {/* Round Header */}
                          <button
                            onClick={() => toggleRound(remark._id)}
                            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-teal-500/5 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-7 h-7 rounded-full bg-teal-500/30 flex items-center justify-center text-teal-300 text-xs font-bold">
                                R{remark.round}
                              </span>
                              <span className="text-white font-semibold">Round {remark.round}</span>
                              <span className="text-gray-500 text-xs">
                                {remark.task?.length || 0} {remark.task?.length === 1 ? 'task' : 'tasks'}
                              </span>
                            </div>
                            {expandedRounds[remark._id] ? (
                              <ChevronUp className="w-4 h-4 text-teal-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-teal-400" />
                            )}
                          </button>

                          {/* Tasks List */}
                          <AnimatePresence initial={false}>
                            {expandedRounds[remark._id] && (
                              <motion.div
                                key="content"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="px-5 pb-4 border-t border-teal-500/20">
                                  {remark.task && remark.task.length > 0 ? (
                                    <ul className="mt-3 space-y-2">
                                      {remark.task.map((task, tIndex) => (
                                        <li
                                          key={tIndex}
                                          className="flex items-start gap-3"
                                        >
                                          <span className="mt-1.5 w-2 h-2 rounded-full bg-teal-400 flex-shrink-0" />
                                          <span className="text-gray-300 text-sm leading-relaxed">
                                            {task}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="text-gray-500 text-sm mt-3">No tasks for this round.</p>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center">
                      <CheckSquare className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No tasks assigned yet</p>
                    </div>
                  )}
                      </>
                    );
                  })()}
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Back to Home */}
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-teal-400 transition-colors text-sm"
            >
              ← Back to Home
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
