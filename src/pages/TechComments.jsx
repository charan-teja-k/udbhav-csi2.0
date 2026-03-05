import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, Search, Users, User, MessageSquare, CheckSquare,
  Plus, Trash2, Send, AlertCircle, Check, ArrowLeft, ClipboardList
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import axios from 'axios';

const ROUNDS = [1, 2, 3];

function buildRoundState() {
  return ROUNDS.reduce((acc, r) => {
    acc[r] = { comment: '', tasks: [''], submitting: false, success: false, error: '', prefilled: false };
    return acc;
  }, {});
}

export default function TechComments() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  // Admin auth
  const [adminCode, setAdminCode] = useState('');
  const [adminInput, setAdminInput] = useState('');
  const [adminError, setAdminError] = useState('');
  const [isValidatingAdmin, setIsValidatingAdmin] = useState(false);

  // Team
  const [teamCode, setTeamCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [teamData, setTeamData] = useState(null);
  const [teamError, setTeamError] = useState('');

  // Rounds state
  const [rounds, setRounds] = useState(buildRoundState());

  // Canvas animation
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
        this.color = this.x < canvas.width / 2
          ? { r: 80, g: 150, b: 255 }
          : { r: 220, g: 80, b: 200 };
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

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        const limit = Math.min(i + 12, particles.length);
        for (let j = i + 1; j < limit; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < maxDistance * maxDistance) {
            const dist = Math.sqrt(distSq);
            const opacity = (1 - dist / maxDistance) * 0.2;
            const r = (particles[i].color.r + particles[j].color.r) / 2;
            const g = (particles[i].color.g + particles[j].color.g) / 2;
            const b = (particles[i].color.b + particles[j].color.b) / 2;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${r},${g},${b},${opacity})`;
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
      particles.forEach(p => { p.update(); p.draw(); });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Load admin code from session storage on mount (separate key from AdminPage)
  useEffect(() => {
    const stored = sessionStorage.getItem('techAdminCode');
    if (stored) setAdminCode(stored);
  }, []);

  const handleAdminLogin = async () => {
    if (!adminInput.trim()) {
      setAdminError('Please enter the admin code');
      return;
    }
    setIsValidatingAdmin(true);
    setAdminError('');
    try {
      await axios.get(
        `https://hackthon-backend-1-d2zj.onrender.com/admin/teams?adminCode=${adminInput.trim()}`
      );
      sessionStorage.setItem('techAdminCode', adminInput.trim());
      setAdminCode(adminInput.trim());
    } catch (err) {
      setAdminError('Invalid admin code. Please try again.');
    } finally {
      setIsValidatingAdmin(false);
    }
  };

  const handleVerifyTeam = async () => {
    if (!teamCode.trim()) {
      setTeamError('Please enter a team code');
      return;
    }
    setIsVerifying(true);
    setTeamError('');
    setTeamData(null);
    setRounds(buildRoundState());
    try {
      const res = await axios.get(
        `https://hackthon-backend-1-d2zj.onrender.com/get-team-details/${encodeURIComponent(teamCode)}`
      );
      if (!res) throw new Error('Team not found. Please check your team code.');
      setTeamData(res.data);

      // Pre-fill rounds with latest existing remark per round
      const newRounds = buildRoundState();
      (res.data.remarks || []).forEach(remark => {
        const r = remark.round;
        if (ROUNDS.includes(r)) {
          // Later entries overwrite earlier ones — last entry per round wins
          newRounds[r].comment = remark.comment || '';
          newRounds[r].tasks = remark.task && remark.task.length > 0 ? [...remark.task] : [''];
          newRounds[r].prefilled = true;
        }
      });
      setRounds(newRounds);
    } catch (err) {
      setTeamError(err.message || 'Failed to verify team. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResetTeam = () => {
    setTeamCode('');
    setTeamData(null);
    setTeamError('');
    setRounds(buildRoundState());
  };

  // Round field helpers
  const setRoundField = (round, field, value) => {
    setRounds(prev => ({ ...prev, [round]: { ...prev[round], [field]: value } }));
  };

  const addTask = (round) => {
    setRounds(prev => ({
      ...prev,
      [round]: { ...prev[round], tasks: [...prev[round].tasks, ''] }
    }));
  };

  const updateTask = (round, index, value) => {
    setRounds(prev => {
      const tasks = [...prev[round].tasks];
      tasks[index] = value;
      return { ...prev, [round]: { ...prev[round], tasks } };
    });
  };

  const removeTask = (round, index) => {
    setRounds(prev => {
      const tasks = prev[round].tasks.filter((_, i) => i !== index);
      return { ...prev, [round]: { ...prev[round], tasks: tasks.length ? tasks : [''] } };
    });
  };

  const handleSubmitRound = async (round) => {
    const { comment, tasks } = rounds[round];
    const filteredTasks = tasks.map(t => t.trim()).filter(Boolean);

    if (!filteredTasks.length && !comment.trim()) {
      setRoundField(round, 'error', 'Add at least one task or a comment before submitting.');
      return;
    }

    setRoundField(round, 'submitting', true);
    setRoundField(round, 'error', '');
    setRoundField(round, 'success', false);

    try {
      await axios.post(
        `https://hackthon-backend-1-d2zj.onrender.com/submit-remark?adminCode=${adminCode}`,
        {
          teamcode: teamData.teamcode,
          round,
          task: filteredTasks,
          comment: comment.trim() || null
        }
      );
      setRoundField(round, 'success', true);
      setTimeout(() => setRoundField(round, 'success', false), 3000);
    } catch (err) {
      setRoundField(round, 'error', err.response?.data?.message || err.message || 'Failed to submit. Please try again.');
    } finally {
      setRoundField(round, 'submitting', false);
    }
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
              <span className="text-sm text-teal-400 font-medium">Tech Panel</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-teal-300 via-cyan-400 to-teal-500 bg-clip-text text-transparent">
                Tech Comments
              </span>
            </h1>
            <p className="text-gray-400 text-lg">
              Assign tasks and comments per round for a team
            </p>
          </div>

          {/* Admin Login Gate */}
          {!adminCode ? (
            <motion.div
              className="glass-card p-6 md:p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Admin Access Required</h2>
                  <p className="text-gray-400 text-sm">Enter your admin code to continue</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Admin Code</label>
                  <input
                    type="password"
                    value={adminInput}
                    onChange={(e) => setAdminInput(e.target.value)}
                    placeholder="Enter admin code"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-teal-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                  />
                </div>
                {adminError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-red-400 text-sm"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {adminError}
                  </motion.div>
                )}
                <Button onClick={handleAdminLogin} disabled={isValidatingAdmin} className="w-full py-3">
                  {isValidatingAdmin ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Login
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Admin Badge */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs text-teal-400 bg-teal-500/10 border border-teal-500/30 px-3 py-1 rounded-full font-mono">
                  Tech Team
                </span>
                <button
                  onClick={() => {
                    sessionStorage.removeItem('techAdminCode');
                    setAdminCode('');
                    setAdminInput('');
                    handleResetTeam();
                  }}
                  className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                >
                  Sign out
                </button>
              </div>

              {/* Team Code Input */}
              <div className="glass-card p-6 md:p-8 mb-6">
                {!teamData ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                        <Search className="w-5 h-5 text-teal-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Find Team</h2>
                        <p className="text-gray-400 text-sm">Enter team code to load their profile</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Team Code</label>
                        <input
                          type="text"
                          value={teamCode}
                          onChange={(e) => setTeamCode(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-teal-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                          onKeyDown={(e) => e.key === 'Enter' && handleVerifyTeam()}
                        />
                      </div>
                      {teamError && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 text-red-400 text-sm"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {teamError}
                        </motion.div>
                      )}
                      <Button onClick={handleVerifyTeam} disabled={isVerifying} className="w-full py-3">
                        {isVerifying ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <Search className="w-4 h-4 mr-2" />
                            Load Team
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {/* Team Info */}
                    <button
                      onClick={handleResetTeam}
                      className="flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors mb-5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="text-sm">Change Team</span>
                    </button>

                    <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full bg-teal-500/20 flex items-center justify-center">
                          <Users className="w-4 h-4 text-teal-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{teamData.teamName}</h3>
                          <p className="text-teal-400 text-xs font-mono">{teamData.teamcode}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-start gap-2">
                          <User className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-gray-400 text-xs uppercase tracking-wider">Team Lead</p>
                            <p className="text-white text-sm font-medium">{teamData.teamLead?.name || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Users className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-gray-400 text-xs uppercase tracking-wider">Members</p>
                            <p className="text-white text-sm font-medium">
                              {teamData.teamMembers?.length > 0
                                ? teamData.teamMembers.map(m => m.name).join(', ')
                                : 'No additional members'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Round Cards */}
              <AnimatePresence>
                {teamData && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-6"
                  >
                    {ROUNDS.map((round, idx) => {
                      const r = rounds[round];
                      return (
                        <motion.div
                          key={round}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.08 * idx }}
                          className="glass-card p-6 md:p-8"
                        >
                          {/* Round Header */}
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-9 h-9 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 font-bold text-sm">
                              R{round}
                            </div>
                            <h3 className="text-lg font-bold text-white">Round {round}</h3>
                            {r.prefilled && (
                              <span className="ml-auto text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 px-2 py-1 rounded-full">
                                Previously saved
                              </span>
                            )}
                          </div>

                          {/* Comment */}
                          <div className="mb-6">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                              <MessageSquare className="w-4 h-4 text-purple-400" />
                              Comment
                            </label>
                            <textarea
                              value={r.comment}
                              onChange={(e) => setRoundField(round, 'comment', e.target.value)}
                              placeholder={`Write a comment for Round ${round}...`}
                              rows={3}
                              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-purple-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all resize-none"
                            />
                          </div>

                          {/* Tasks */}
                          <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                              <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                <CheckSquare className="w-4 h-4 text-teal-400" />
                                Tasks
                              </label>
                              <button
                                onClick={() => addTask(round)}
                                className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                Add task
                              </button>
                            </div>

                            <div className="space-y-2">
                              {r.tasks.map((task, tIdx) => (
                                <div key={tIdx} className="flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 text-xs font-bold flex-shrink-0">
                                    {tIdx + 1}
                                  </span>
                                  <input
                                    type="text"
                                    value={task}
                                    onChange={(e) => updateTask(round, tIdx, e.target.value)}
                                    placeholder={`Task ${tIdx + 1}`}
                                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-teal-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all text-sm"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addTask(round);
                                      }
                                    }}
                                  />
                                  {r.tasks.length > 1 && (
                                    <button
                                      onClick={() => removeTask(round, tIdx)}
                                      className="p-1.5 text-gray-500 hover:text-red-400 transition-colors flex-shrink-0"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                            <p className="text-gray-600 text-xs mt-2">Press Enter in a task field to add a new one</p>
                          </div>

                          {/* Feedback */}
                          <AnimatePresence>
                            {r.error && (
                              <motion.div
                                key="error"
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2 text-red-400 text-sm mb-4"
                              >
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {r.error}
                              </motion.div>
                            )}
                            {r.success && (
                              <motion.div
                                key="success"
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2 text-green-400 text-sm mb-4"
                              >
                                <Check className="w-4 h-4 flex-shrink-0" />
                                Round {round} submitted successfully!
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Submit */}
                          <Button
                            onClick={() => handleSubmitRound(round)}
                            disabled={r.submitting}
                            className="w-full py-3"
                          >
                            {r.submitting ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                Submitting Round {round}...
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-2" />
                                Submit Round {round}
                              </>
                            )}
                          </Button>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

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
