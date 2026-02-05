"use client";
import { useScroll, useTransform, motion } from "framer-motion";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import React, { useEffect, useRef, useState } from "react";

export const Timeline = ({ data }) => {
    const ref = useRef(null);
    const containerRef = useRef(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setHeight(rect.height);
        }
    }, [ref]);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 10%", "end 50%"],
    });

    const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
    const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

    return (
        <div
            className="w-full bg-transparent font-sans md:px-10"
            ref={containerRef}
        >
            <div className="max-w-7xl mx-auto py-10 px-4 md:px-8 lg:px-10">
                <h2 className="text-lg md:text-4xl mb-4 text-white max-w-4xl text-center mx-auto">
                    Event Timeline
                </h2>
                <p className="text-neutral-300 text-sm md:text-base max-w-sm mx-auto text-center">
                    Follow the schedule for VIDBHAV 2025 throughout the 24-hour hackathon.
                </p>
            </div>

            <div ref={ref} className="relative max-w-7xl mx-auto pb-10">
                {/* Center Vertical Line */}
                <div
                    style={{
                        height: height + "px",
                    }}
                    className="absolute left-4 md:left-1/2 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-700 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] md:-translate-x-1/2"
                >
                    <motion.div
                        style={{
                            height: heightTransform,
                            opacity: opacityTransform,
                        }}
                        className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
                    />
                </div>

                {data.map((item, index) => (
                    <div
                        key={index}
                        className="flex justify-between items-center w-full pt-8 md:pt-12 md:gap-10"
                    >
                        {/* Time/Title Side - Alternates */}
                        {/* 
                           For Index 0 (Even): We want Content on Right. 
                           So Left side should be Title/Time? Or Empty? 
                           User said: "1st event [index 0] is at right side".
                           Usually timeline has Time on one side, Content on other?
                           Or just the card on the Right side.
                           
                           Let's assume "Event" means the whole block.
                           If Index 0 is Right:
                           Left: Empty (or time)
                           Right: Content
                           
                           If we use flex-row for even:
                           Left Element -> Right Element.
                           We need Left Empty, Right Content.
                        */}

                        {/* Left Side (Empty for Even, Content for Odd) */}
                        <div className="hidden md:block w-5/12">
                            {index % 2 !== 0 && (
                                <motion.div
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    viewport={{ once: true }}
                                >
                                    <HoverBorderGradient
                                        as="div"
                                        containerClassName="rounded-xl w-full"
                                        className="min-h-[150px] bg-gray-900/40 backdrop-blur-md flex flex-col items-end text-right p-6 w-full h-full justify-center"
                                    >
                                        <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                                        <div className="text-neutral-300">{item.content}</div>
                                    </HoverBorderGradient>
                                </motion.div>
                            )}
                        </div>

                        {/* Center Point & Connectors */}
                        <div className="relative z-10 flex items-center justify-center w-8 h-8 left-4 md:left-0">
                            <div className="w-8 h-8 rounded-full bg-neutral-800 border-2 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)] z-20 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-orange-500" />
                            </div>
                            {/* Connector Line for Desktop - Right (Even Index) */}
                            {index % 2 === 0 && (
                                <div className="hidden md:block absolute left-full top-1/2 -translate-y-1/2 w-16 h-[2px] bg-gradient-to-r from-orange-500 to-transparent" />
                            )}
                            {/* Connector Line for Desktop - Left (Odd Index) */}
                            {index % 2 !== 0 && (
                                <div className="hidden md:block absolute right-full top-1/2 -translate-y-1/2 w-16 h-[2px] bg-gradient-to-l from-orange-500 to-transparent" />
                            )}
                            {/* Connector Line for Mobile - Always Right */}
                            <div className="md:hidden absolute left-full top-1/2 -translate-y-1/2 w-12 h-[2px] bg-gradient-to-r from-orange-500 to-transparent" />
                        </div>

                        {/* Right Side (Content for Even, Empty for Odd) */}
                        <div className="w-full pl-16 md:pl-0 md:w-5/12">
                            {index % 2 === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    viewport={{ once: true }}
                                >
                                    <HoverBorderGradient
                                        as="div"
                                        containerClassName="rounded-xl w-full"
                                        className="min-h-[150px] bg-gray-900/40 backdrop-blur-md flex flex-col items-start text-left p-6 w-full h-full justify-center"
                                    >
                                        <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                                        <div className="text-neutral-300">{item.content}</div>
                                    </HoverBorderGradient>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    viewport={{ once: true }}
                                >
                                    <HoverBorderGradient
                                        as="div"
                                        containerClassName="rounded-xl w-full md:hidden"
                                        className="min-h-[150px] bg-gray-900/40 backdrop-blur-md flex flex-col items-start text-left p-6 w-full h-full justify-center"
                                    >
                                        <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                                        <div className="text-neutral-300">{item.content}</div>
                                    </HoverBorderGradient>
                                </motion.div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
