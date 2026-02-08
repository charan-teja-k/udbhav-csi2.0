
import React, { useEffect, useRef, useState } from 'react';
import { motion, stagger, useAnimate, useInView } from "framer-motion";
import { ArrowRight, Clock, Code2, Cpu, Globe, Lightbulb, LogOut, Mail, Phone, Rocket, Target, Trophy, Users, Zap, Brain, Cloud, Shield, Smartphone, Bot, Database, Wifi, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Image from '../assets/image.jpg';

import { Timeline } from "@/components/ui/timeline";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import Navbar from "@/components/Navbar";
import NotificationBanner from "@/components/NotificationBanner";
import CountdownTimer from "@/components/CountdownTimer";
import FloatingElements from "@/components/FloatingElements";
import { Button } from "@/components/ui/button";




export default function Home() {
  const canvasRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const registrationUrl = "/registration";
  const navigate = useNavigate();
  useEffect(() => {
    setIsLoaded(true);
  }, []);

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
          this.color = { r: 80, g: 150, b: 255 }; // blue
        } else {
          this.color = { r: 220, g: 80, b: 200 }; // pink
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

  const handleNavigation = (path) => {
    navigate(path)
  };

  const handleRegistration = () => {
    navigate(registrationUrl);
  };

  return (
    <div className={`relative overflow-hidden transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'} `}>
      <div className="fixed top-0 left-0 w-full h-full -z-10 animated-gradient-bg">
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
          style={{ mixBlendMode: 'screen', opacity: 0.6 }}
        />
      </div>

      <Navbar />

      {showNotification && (
        <NotificationBanner onClose={() => setShowNotification(false)} />
      )}

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <FloatingElements />

        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-teal-500/5 via-transparent to-transparent" />

        <div className="container mx-auto px-4 py-20 relative z-10">
          <motion.div
            className="text-center max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-500/30 bg-teal-500/10 mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Rocket className="w-4 h-4 text-teal-400" />
              <span className="text-sm text-teal-400 font-medium">Innovate • Create • Inspire</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-teal-300 via-cyan-400 to-teal-500 bg-clip-text text-transparent">UDBHAV</span>
              <br />
              <span className="text-white">2K26</span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              The Ultimate 24-Hour Hackathon Experience. Build the future with code, creativity, and collaboration.
            </motion.p>

            {/* Countdown */}
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <p className="text-sm text-gray-500 uppercase tracking-widest mb-4">
                Event Starts In
              </p>
              <CountdownTimer targetDate={new Date("2026-03-05T09:00:00")} />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Button
                size="lg"
                className="text-lg px-8 py-6 shadow-lg shadow-teal-500/25"
                onClick={handleRegistration}
              >
                Register Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              {[
                { value: "100+", label: "Participants" },
                { value: "24H", label: "Duration" },
                { value: "35K+", label: "In Prizes" },
                { value: "20+", label: "Mentors" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-teal-400 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 rounded-full border-2 border-teal-500/50 flex items-start justify-center p-2">
              <motion.div
                className="w-1 h-2 bg-teal-500 rounded-full"
                animate={{ opacity: [1, 0.5, 1], y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 relative" id="about">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-500/5 to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
               <span className="bg-gradient-to-r from-teal-300 via-cyan-400 to-teal-500 bg-clip-text text-transparent">About Udbhav</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto mt-8">
              Udbhav 2K26 is the flagship hackathon that brings together the brightest minds
              to solve real-world problems through technology. Join us for 24 hours of innovation,
              learning, and unforgettable experiences.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Code2,
                title: "Build & Code",
                description: "Create innovative solutions using cutting-edge technologies",
              },
              {
                icon: Lightbulb,
                title: "UI/UX Track (First Years)",
                description: "Exclusive UI/UX track for first-year students with a 3-day hands-on workshop and hackathon.",
              },
              {
                icon: Users,
                title: "Team Up",
                description: "Collaborate with like-minded developers and designers",
              },
              {
                icon: Lightbulb,
                title: "Innovate",
                description: "Transform your ideas into working prototypes",
              },
              {
                icon: Globe,
                title: "Network",
                description: "Connect with industry experts and potential employers",
              },
              {
                icon: Cpu,
                title: "Learn",
                description: "Attend workshops and gain hands-on experience",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 group hover:scale-105 hover:border-teal-500/30 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-14 h-14 rounded-xl bg-teal-500/10 flex items-center justify-center mb-6 group-hover:bg-teal-500/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-teal-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 relative" id="tracks">
        <div className="absolute inset-0 grid-pattern opacity-20" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold section-title mb-6">
               <span className="gradient-text"> Hackathon Tracks</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mt-8">
              Choose your battlefield. Exciting tracks to showcase your skills.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: Wifi,
                title: "IoT Systems",
                description: "Connect the physical world with the digital through smart sensors and connected devices.",
                gradient: "from-teal-400 to-cyan-500",
              },
              {
                icon: Globe,
                title: "Web Development",
                description: "Build immersive and responsive web experiences that define the future of the internet.",
                gradient: "from-cyan-500 to-blue-500",
              },
              {
                icon: Smartphone,
                title: "App Development",
                description: "Create powerful mobile applications that solve real-world problems on the go.",
                gradient: "from-blue-500 to-indigo-500",
              },
              {
                icon: Database,
                title: "Web3 & Blockchain",
                description: "Develop decentralized solutions and smart contracts for a transparent future.",
                gradient: "from-indigo-500 to-purple-500",
              },
              {
                icon: Bot,
                title: "Agentic AI",
                description: "Build autonomous AI agents capable of reasoning, planning, and executing complex tasks.",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: Cpu,
                title: "Quantum Computing",
                description: "Explore quantum algorithms, optimization, and the next generation of computing.",
                gradient: "from-teal-300 to-cyan-500",
              },
              {
                icon: Shield,
                title: "Cyber Security",
                description: "Protect digital assets and infrastructure with robust security solutions.",
                gradient: "from-pink-500 to-rose-500",
              },
              {
                icon: Brain,
                title: "Machine Learning",
                description: "Train intelligent models to discover patterns and make data-driven predictions.",
                gradient: "from-rose-500 to-orange-500",
              },
            ].map((domain, index) => (
              <motion.div
                key={domain.title}
                className="relative group cursor-pointer h-64"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="gradient-border h-full">
                  <div className="gradient-border-inner p-8 flex flex-col items-center justify-center text-center h-full relative overflow-hidden">

                    {/* Default State: Icon & Title */}
                    <div className="transition-all duration-300 group-hover:-translate-y-2 group-hover:opacity-0 absolute inset-0 flex flex-col items-center justify-center p-8">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${domain.gradient} flex items-center justify-center mb-6 shadow-lg shadow-black/50`}>
                        <domain.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-display text-2xl font-bold text-white">
                        {domain.title}
                      </h3>
                    </div>

                    {/* Hover State: Description Pop-up */}
                    <div className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center p-6 text-center opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                      <h3 className={`font-display text-xl font-bold mb-3 bg-gradient-to-r ${domain.gradient} bg-clip-text text-transparent`}>
                        {domain.title}
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {domain.description}
                      </p>
                    </div>

                  </div>
                </div>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, rgba(20, 184, 166, 0.2) 0%, transparent 70%)`,
                    filter: "blur(20px)",
                    zIndex: -1
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/*Timeline Section*/}
      <section id="timeline" className="relative py-20 px-4 md:px-8 bg-transparent">
        <Timeline
          data={[
            {
              date: "FEB 5, 2026",
              title: "Registration Opens",
              content: "Start your hackathon journey with initial registration.",
            },
            {
              date: "FEB 9-23, 2026",
              title: "Idea Submission",
              content: "Submit your problem statement ideas in the google form.",
            },
            {
              date: "FEB 23-28, 2026",
              title: "Idea Presentation Deadline",
              content: "Present your Idea for initial screening.No Eliminations",
            },
            {
              date: "MAR 5-6, 2026",
              title: "Hackathon",
              content: "24 hours of non-stop innovation, coding, and building.",
            },
          ]}
        />
      </section>

      <section className="relative py-24 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-500/10 to-transparent" />
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white/5 border border-white/10 rounded-3xl px-8 md:px-12 py-12 backdrop-blur-md"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to build something unforgettable?
            </h3>
            <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto mb-8">
              Join UDBHAV 2K26 for 24 hours of focused creation, rapid learning, and a community
              that ships bold ideas. Your next breakthrough starts here.
            </p>
            <Button
              size="lg"
              className="text-lg px-10 py-6 shadow-lg shadow-teal-500/30 btn-glow font-display"
              onClick={handleRegistration}
            >
              Register Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>




      <footer className="relative py-12 px-4 md:px-8 border-t border-white/10 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <Zap className="text-white" size={24} />
                </div>
                <span className="text-white font-bold text-xl">UDBHAV 2026</span>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering innovation through collaborative problem-solving
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="#about" className="block text-gray-400 hover:text-white transition-colors">About</a>
                <a href="#timeline" className="block text-gray-400 hover:text-white transition-colors">Timeline</a>
                <a href="#prizes" className="block text-gray-400 hover:text-white transition-colors">Prizes</a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Contact Us</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail size={16} />
                  <span className="text-sm">udbhav2026.csi@gmail.com</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Phone size={16} />
                  <span className="text-sm">+91 8465833353</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 text-center">
            <p className="text-gray-400 text-sm">
              © 2026 UDBHAV 2K26. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}



