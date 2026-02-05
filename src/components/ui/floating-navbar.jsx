"use strict";
import React, { useState } from "react";
import {
    motion,
    AnimatePresence,
    useScroll,
    useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export const FloatingNav = ({
    navItems,
    className,
    actionButtons // Prop to accept Login/Register buttons or custom actions
}) => {
    const { scrollYProgress } = useScroll();

    const [visible, setVisible] = useState(true);

    useMotionValueEvent(scrollYProgress, "change", (current) => {
        // Check if current is not undefined and is a number
        if (typeof current === "number") {
            let direction = current - scrollYProgress.getPrevious();

            if (scrollYProgress.get() < 0.05) {
                setVisible(true);
            } else {
                if (direction < 0) {
                    setVisible(true);
                } else {
                    setVisible(false);
                }
            }
        }
    });

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{
                    opacity: 1,
                    y: -100,
                }}
                animate={{
                    y: visible ? 0 : -100,
                    opacity: visible ? 1 : 0,
                }}
                transition={{
                    duration: 0.2,
                }}
                className={cn(
                    "flex max-w-fit fixed top-4 inset-x-0 mx-auto border border-white/20 dark:border-white/[0.2] rounded-full bg-black/50 dark:bg-black/50 backdrop-blur-md shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-4 pl-8 py-2 items-center justify-between space-x-4",
                    className
                )}
            >
                <div className="flex items-center space-x-4">
                    {navItems.map((navItem, idx) => (
                        <a
                            key={`link=${idx}`}
                            href={navItem.link}
                            className={cn(
                                "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-300 dark:hover:text-neutral-300 hover:text-neutral-100 transition-colors"
                            )}
                        >
                            <span className="block sm:hidden">{navItem.icon}</span>
                            <span className="hidden sm:block text-sm font-medium">{navItem.name}</span>
                        </a>
                    ))}
                </div>

                {/* Render Action Buttons if provided */}
                {actionButtons && (
                    <div className="flex items-center gap-2 pl-4 border-l border-white/10">
                        {actionButtons}
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
};
