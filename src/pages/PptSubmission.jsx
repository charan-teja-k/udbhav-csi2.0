import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Users, User, FileText, Check, AlertCircle, ArrowLeft, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import axios from 'axios';
import { uploadToCloudinary } from '@/components/FileUpload';

export default function PptSubmission() {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [teamCode, setTeamCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [teamData, setTeamData] = useState(null);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [cloudinaryUrl, setCloudinaryUrl] = useState('');
  const [dragOver, setDragOver] = useState(false);

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
      const teamRes = await axios.get(`https://hackthon-backend-1-d2zj.onrender.com/get-team-details/${teamCode}`);
      if (!teamRes) {
        throw new Error('Team not found. Please check your team code.');
      }
      setTeamData(teamRes.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to verify team. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed.');
      setSelectedFile(null);
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError('File size must be under 20 MB.');
      setSelectedFile(null);
      return;
    }

    setError('');
    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed.');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError('File size must be under 20 MB.');
      return;
    }

    setError('');
    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmitPpt = async () => {
    if (!selectedFile) {
      setError('Please select a PDF file to upload.');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);
    setError('');

    try {
      const secureUrl = await uploadToCloudinary(
        selectedFile,
        teamData.teamName,
        setUploadProgress
      );

      setCloudinaryUrl(secureUrl);
      setSubmitSuccess(true);
      setSelectedFile(null);
      setUploadProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => setSubmitSuccess(false), 6000);
    } catch (err) {
      setError(err.message || 'Failed to upload PPT. Please try again.');
      setUploadProgress(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setTeamCode('');
    setTeamData(null);
    setSelectedFile(null);
    setError('');
    setSubmitSuccess(false);
    setUploadProgress(null);
    setCloudinaryUrl('');
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
              <FileText className="w-4 h-4 text-teal-400" />
              <span className="text-sm text-teal-400 font-medium">Upload Your Presentation</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-teal-300 via-cyan-400 to-teal-500 bg-clip-text text-transparent">
                PPT Submission
              </span>
            </h1>
            <p className="text-gray-400 text-lg">
              Upload your presentation (PDF) for UDBHAV 2K26
            </p>
          </div>

          {/* Main Card */}
          <div className="glass-card p-6 md:p-8">

            {/* Step 1: Team Code Verification */}
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

            {/* Step 2: Team Info + File Upload */}
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

                {/* Success Banner */}
                <AnimatePresence>
                  {submitSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-3 mb-6"
                    >
                      <Check className="w-4 h-4 flex-shrink-0" />
                      PPT submitted successfully! Your presentation has been uploaded.
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* File Upload Area */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                    <FileText className="w-4 h-4 text-teal-400" />
                    Upload Presentation (PDF only, max 20 MB)
                  </label>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="ppt-file-input"
                  />

                  {/* Drop Zone */}
                  {!selectedFile ? (
                    <div
                      onDragOver={(e) => { e.preventDefault(); if (!isSubmitting) setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={isSubmitting ? undefined : handleDrop}
                      onClick={() => !isSubmitting && fileInputRef.current?.click()}
                      className={`flex flex-col items-center justify-center gap-4 p-10 rounded-xl border-2 border-dashed transition-all duration-200
                        ${isSubmitting
                          ? 'border-white/10 bg-white/5 opacity-50 cursor-not-allowed'
                          : dragOver
                            ? 'cursor-pointer border-teal-400 bg-teal-500/15'
                            : 'cursor-pointer border-teal-500/30 bg-white/5 hover:border-teal-400/60 hover:bg-teal-500/10'
                        }`}
                    >
                      <div className="w-14 h-14 rounded-full bg-teal-500/20 flex items-center justify-center">
                        <Upload className="w-7 h-7 text-teal-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-white font-medium mb-1">
                          {dragOver ? 'Drop your PDF here' : 'Drag & drop your PDF here'}
                        </p>
                        <p className="text-gray-500 text-sm">or</p>
                        <p className="text-teal-400 text-sm font-medium mt-1">Click to choose file</p>
                      </div>
                      <p className="text-gray-500 text-xs">PDF format only · Maximum 20 MB</p>
                    </div>
                  ) : (
                    /* Selected File Preview */
                    <motion.div
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-4 p-4 rounded-xl border border-teal-500/40 bg-teal-500/10"
                    >
                      <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate">{selectedFile.name}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{formatFileSize(selectedFile.size)}</p>
                      </div>
                      <button
                        onClick={handleRemoveFile}
                        disabled={isSubmitting}
                        className="flex-shrink-0 p-1.5 rounded-full text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}

                  {/* Replace file button */}
                  {selectedFile && (
                    <button
                      onClick={() => !isSubmitting && fileInputRef.current?.click()}
                      disabled={isSubmitting}
                      className="mt-3 text-xs text-teal-400 hover:text-teal-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Choose a different file
                    </button>
                  )}
                </div>

                {/* Upload Progress Bar */}
                <AnimatePresence>
                  {uploadProgress !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mb-4"
                    >
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                        <span>Uploading to Cloudinary...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500 rounded-full"
                          initial={{ width: '0%' }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ ease: 'linear', duration: 0.2 }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error */}
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

                <Button
                  onClick={handleSubmitPpt}
                  disabled={isSubmitting || !selectedFile}
                  className="w-full py-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Submit PPT
                    </>
                  )}
                </Button>
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
