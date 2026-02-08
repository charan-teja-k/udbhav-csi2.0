import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Users, User, Lightbulb, Clock, Edit3, Check, AlertCircle, ArrowLeft, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

export default function IdeaSubmission() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  
  // States
  const [teamCode, setTeamCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [teamData, setTeamData] = useState(null);
  const [error, setError] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [existingIdea, setExistingIdea] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Canvas animation effect (matching project theme)
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

  // Verify team code
  const handleVerifyTeam = async () => {
    if (!teamCode.trim()) {
      setError('Please enter a team code');
      return;
    }

    setIsVerifying(true);
    setError('');
    setTeamData(null);
    setExistingIdea(null);

    // DUMMY TEAM CODE FOR TESTING - Remove in production
    // if (teamCode === 'TEAM-TEST123') {
    //   setTeamData({
    //     _id: 'dummy123',
    //     teamName: 'Test Team Alpha',
    //     teamCode: 'TEAM-TEST123',
    //     teamLead: { name: 'John Doe' },
    //     teamMembers: [
    //       { name: 'Alice Smith' },
    //       { name: 'Bob Johnson' }
    //     ]
    //   });
    //   setIsVerifying(false);
    //   return;
    // }

    try {
      // Fetch team details
      const teamRes = await fetch(`https://hackthon-backend-1-d2zj.onrender.com/team/${teamCode}`);
      
      if (!teamRes.ok) {
        throw new Error('Team not found. Please check your team code.');
      }
      
      const team = await teamRes.json();
      setTeamData(team);

      // Check for existing idea submission
      try {
        const ideaRes = await fetch(`https://hackthon-backend-1-d2zj.onrender.com/idea/${teamCode}`);
        if (ideaRes.ok) {
          const idea = await ideaRes.json();
          if (idea) {
            setExistingIdea(idea);
            setProblemStatement(idea.currentProblemStatement || '');
          }
        }
      } catch (ideaErr) {
        // No existing idea, that's fine
        console.log('No existing idea found');
      }
    } catch (err) {
      setError(err.message || 'Failed to verify team. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Submit idea
  const handleSubmitIdea = async () => {
    if (!problemStatement.trim()) {
      setError('Please enter your problem statement');
      return;
    }

    setIsSubmitting(true);
    setError('');

    // DUMMY SUBMISSION FOR TESTING - Remove in production
    // if (teamCode === 'TEAM-TEST123') {
    //   const now = new Date().toISOString();
    //   const newHistory = existingIdea?.history ? [...existingIdea.history] : [];
    //   if (existingIdea?.currentProblemStatement) {
    //     newHistory.push({
    //       problemStatement: existingIdea.currentProblemStatement,
    //       changedAt: existingIdea.lastUpdatedAt || existingIdea.submittedAt
    //     });
    //   }
    //   setExistingIdea({
    //     teamCode: 'TEAM-TEST123',
    //     currentProblemStatement: problemStatement.trim(),
    //     submittedAt: existingIdea?.submittedAt || now,
    //     lastUpdatedAt: now,
    //     history: newHistory
    //   });
    //   setSubmitSuccess(true);
    //   setTimeout(() => setSubmitSuccess(false), 3000);
    //   setIsSubmitting(false);
    //   return;
    // }

    try {
      const res = await fetch('https://hackthon-backend-1-d2zj.onrender.com/idea/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamCode: teamCode,
          teamId: teamData._id,
          problemStatement: problemStatement.trim()
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitSuccess(true);
        setExistingIdea(data.idea);
        setTimeout(() => setSubmitSuccess(false), 3000);
      } else {
        throw new Error(data.message || 'Failed to submit idea');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit idea. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  // Reset to search
  const handleReset = () => {
    setTeamCode('');
    setTeamData(null);
    setExistingIdea(null);
    setProblemStatement('');
    setError('');
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
              <Lightbulb className="w-4 h-4 text-teal-400" />
              <span className="text-sm text-teal-400 font-medium">Share Your Innovation</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-teal-300 via-cyan-400 to-teal-500 bg-clip-text text-transparent">
                Idea Submission
              </span>
            </h1>
            <p className="text-gray-400 text-lg">
              Submit your problem statement for UDBHAV 2K26
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
                    <p className="text-gray-400 text-sm">Enter your team code to continue</p>
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
                      onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
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

            {/* Step 2: Team Details & Idea Submission */}
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

                {/* Team Details Card */}
                <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-5 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{teamData.teamName}</h3>
                      <p className="text-teal-400 text-sm font-mono">{teamCode}</p>
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

                {/* Existing Idea Notice */}
                {existingIdea && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Edit3 className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-medium">Previous Submission Found</span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      You can update your problem statement below. Your previous submissions will be saved in history.
                    </p>
                    <p className="text-gray-500 text-xs mt-2">
                      Last updated: {formatDate(existingIdea.lastUpdatedAt || existingIdea.submittedAt)}
                    </p>
                  </motion.div>
                )}

                {/* Problem Statement Input */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <Lightbulb className="w-4 h-4 text-teal-400" />
                      Your Problem Statement
                    </label>
                    {existingIdea && (
                      <span className="text-xs text-teal-400">
                        {existingIdea ? 'Editing' : 'New Submission'}
                      </span>
                    )}
                  </div>
                  <textarea
                    value={problemStatement}
                    onChange={(e) => setProblemStatement(e.target.value)}
                    placeholder="Describe your innovative idea or problem statement in detail..."
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-teal-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all resize-none"
                  />
                  <p className="text-gray-500 text-xs mt-2">
                    {problemStatement.length} characters
                  </p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-red-400 text-sm mb-4"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </motion.div>
                )}

                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-green-400 text-sm mb-4"
                  >
                    <Check className="w-4 h-4" />
                    Idea submitted successfully!
                  </motion.div>
                )}

                <Button
                  onClick={handleSubmitIdea}
                  disabled={isSubmitting}
                  className="w-full py-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      {existingIdea ? <Edit3 className="w-4 h-4 mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                      {existingIdea ? 'Update Idea' : 'Submit Idea'}
                    </>
                  )}
                </Button>

                {/* Submission History */}
                {existingIdea?.history && existingIdea.history.length > 0 && (
                  <div className="mt-8">
                    <button
                      onClick={() => setShowHistory(!showHistory)}
                      className="flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors mb-4"
                    >
                      <History className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {showHistory ? 'Hide' : 'Show'} Submission History ({existingIdea.history.length})
                      </span>
                    </button>

                    <AnimatePresence>
                      {showHistory && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-3 overflow-hidden"
                        >
                          {[...existingIdea.history].reverse().map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-white/5 border border-gray-700 rounded-lg p-4"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-3 h-3 text-gray-500" />
                                <span className="text-gray-500 text-xs">
                                  {formatDate(item.changedAt)}
                                </span>
                              </div>
                              <p className="text-gray-300 text-sm whitespace-pre-wrap">
                                {item.problemStatement}
                              </p>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
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
