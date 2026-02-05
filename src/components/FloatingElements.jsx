import React from 'react';
import { motion } from 'framer-motion';

const FloatingElements = () => {
    const elements = [
        { size: 300, x: '10%', y: '20%', delay: 0, color: 'from-teal-500/20 to-cyan-500/20' },
        { size: 200, x: '80%', y: '10%', delay: 0.5, color: 'from-pink-500/20 to-purple-500/20' },
        { size: 250, x: '70%', y: '60%', delay: 1, color: 'from-teal-500/15 to-blue-500/15' },
        { size: 150, x: '20%', y: '70%', delay: 1.5, color: 'from-purple-500/15 to-pink-500/15' },
        { size: 180, x: '50%', y: '40%', delay: 2, color: 'from-cyan-500/10 to-teal-500/10' },
    ];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {elements.map((element, index) => (
                <motion.div
                    key={index}
                    className={`absolute rounded-full bg-gradient-to-br ${element.color} blur-3xl`}
                    style={{
                        width: element.size,
                        height: element.size,
                        left: element.x,
                        top: element.y,
                        transform: 'translate(-50%, -50%)',
                    }}
                    animate={{
                        x: [0, 30, -20, 0],
                        y: [0, -20, 30, 0],
                        scale: [1, 1.1, 0.9, 1],
                    }}
                    transition={{
                        duration: 15 + index * 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: element.delay,
                    }}
                />
            ))}

            {/* Grid overlay */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
                    backgroundSize: '50px 50px',
                }}
            />

            {/* Floating particles */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={`particle-${i}`}
                    className="absolute w-1 h-1 bg-teal-500/30 rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -100, 0],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 4,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                    }}
                />
            ))}
        </div>
    );
};

export default FloatingElements;
