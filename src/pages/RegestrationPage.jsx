import React, { useEffect, useRef, useState } from 'react';
import Registration from '../components/regestration';
import PaymentSummary from '../components/Payment';
import QrPayment from '../components/QrPaymet';

export default function RegistrationPage() {
  const canvasRef = useRef(null);
  const [formdata, setformData] = useState(null);
  const [back, setBack] = useState(true);

  useEffect(() => {
    setformData(prev => ({
      ...prev,
      teamcode: `TEAM-${Date.now()}`
    }));
  }, []);

  const goback = () => {
    setBack(!back);
  };

  const goToPayment = () => {
    setBack(!back);
  };

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
    const particleCount = 60; 
    const maxDistance = 150; 

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.3;

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
        const checkLimit = Math.min(i + 15, particles.length);
        
        for (let j = i + 1; j < checkLimit; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = dx * dx + dy * dy; 
          const maxDistSq = maxDistance * maxDistance;

          if (distance < maxDistSq) {
            const actualDist = Math.sqrt(distance);
            const opacity = (1 - actualDist / maxDistance) * 0.3;
            
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

    const drawTriangles = () => {
      let triangleCount = 0;
      const maxTriangles = 50; 
      
      for (let i = 0; i < particles.length && triangleCount < maxTriangles; i++) {
        for (let j = i + 1; j < Math.min(i + 10, particles.length) && triangleCount < maxTriangles; j++) {
          for (let k = j + 1; k < Math.min(j + 5, particles.length) && triangleCount < maxTriangles; k++) {
            const d1sq = (particles[i].x - particles[j].x) ** 2 + (particles[i].y - particles[j].y) ** 2;
            const d2sq = (particles[j].x - particles[k].x) ** 2 + (particles[j].y - particles[k].y) ** 2;
            const d3sq = (particles[k].x - particles[i].x) ** 2 + (particles[k].y - particles[i].y) ** 2;
            const maxDistSq = maxDistance * maxDistance;

            if (d1sq < maxDistSq && d2sq < maxDistSq && d3sq < maxDistSq) {
              const avgDist = (Math.sqrt(d1sq) + Math.sqrt(d2sq) + Math.sqrt(d3sq)) / 3;
              const opacity = (1 - avgDist / maxDistance) * 0.06;

              const avgColor = {
                r: (particles[i].color.r + particles[j].color.r + particles[k].color.r) / 3,
                g: (particles[i].color.g + particles[j].color.g + particles[k].color.g) / 3,
                b: (particles[i].color.b + particles[j].color.b + particles[k].color.b) / 3
              };

              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.lineTo(particles[k].x, particles[k].y);
              ctx.closePath();
              ctx.fillStyle = `rgba(${avgColor.r}, ${avgColor.g}, ${avgColor.b}, ${opacity})`;
              ctx.fill();
              
              triangleCount++;
            }
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      drawTriangles();
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

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="fixed top-0 left-0 w-full h-full -z-10 animated-gradient-bg">
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
          style={{ mixBlendMode: 'screen', opacity: 0.6 }}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-radial from-teal-500/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          {
            formdata !== null && !back ? 
              <PaymentSummary formData={formdata} goback={goback} /> :
              <Registration setform={setformData} onsubmit={goToPayment} />
          }
        </div>
      </div>
    </div>
  );
}
