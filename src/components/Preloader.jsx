import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const Preloader = ({ onComplete }) => {
    const text = "UDHBAV";
    const bootLines = [
        { label: "SYSTEM CHECK", status: "OK" },
        { label: "LINKING MODULES", status: "OK" },
        { label: "BOOT COMPLETE", status: "READY", cursor: true }
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 2500);

        return () => clearTimeout(timer);
    }, [onComplete]);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                duration: 0.4
            }
        },
        exit: {
            opacity: 0,
            scale: 1.02,
            filter: "blur(6px)",
            transition: { duration: 0.4, ease: "easeInOut" }
        }
    };

    const logoVariants = {
        hidden: { opacity: 0, y: 8 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const bootContainer = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.7
            }
        }
    };

    const bootLine = {
        hidden: { opacity: 0, y: 6 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.35,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--color-background)] overflow-hidden"
            initial="hidden"
            animate="show"
            exit="exit"
            variants={container}
        >
            <div className="absolute inset-0 boot-vignette" />
            <div className="absolute inset-0 noise-layer" />
            <div className="absolute inset-0 scanlines" />

            <div className="relative z-10 flex flex-col items-center text-center gap-4 px-6">
                <motion.div
                    className="flex items-center justify-center font-display text-6xl md:text-9xl font-black"
                    variants={logoVariants}
                    aria-label={text}
                >
                    {text.split("").map((char, index) => (
                        <span
                            key={`${char}-${index}`}
                            className="glitch-text glitch-letter flicker text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-teal-300"
                            data-text={char}
                            style={{
                                '--glitch-delay': `${index * 0.08}s`,
                                '--flicker-delay': `${index * 0.12}s`
                            }}
                        >
                            {char}
                        </span>
                    ))}
                </motion.div>

                <motion.ul
                    className="mt-2 space-y-2"
                    variants={bootContainer}
                    initial="hidden"
                    animate="show"
                >
                    {bootLines.map((line, index) => (
                        <motion.li
                            key={index}
                            variants={bootLine}
                            className="boot-line"
                        >
                            <span className="text-teal-200/90">{line.label}</span>
                            <span className="text-teal-400/90"> ... </span>
                            <span className="text-teal-300">{line.status}</span>
                            {line.cursor ? <span className="boot-caret">|</span> : null}
                        </motion.li>
                    ))}
                </motion.ul>

                <motion.div
                    className="mt-2 h-1 w-56 overflow-hidden rounded-full bg-white/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.9 } }}
                >
                    <motion.div
                        className="h-full bg-gradient-to-r from-transparent via-teal-300 to-transparent"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1.2, delay: 0.9, ease: "easeInOut" }}
                        style={{
                            transformOrigin: "left center",
                            boxShadow: "0 0 12px rgba(20, 184, 166, 0.6)"
                        }}
                    />
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Preloader;
