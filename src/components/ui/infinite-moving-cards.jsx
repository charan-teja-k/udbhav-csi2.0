"use strict";
import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

export const InfiniteMovingCards = ({
    items,
    direction = "left",
    speed = "fast",
    pauseOnHover = true,
    className,
}) => {
    const containerRef = useRef(null);
    const scrollerRef = useRef(null);

    useEffect(() => {
        addAnimation();
    }, []);

    const [start, setStart] = useState(false);

    function addAnimation() {
        if (containerRef.current && scrollerRef.current) {
            const scrollerContent = Array.from(scrollerRef.current.children);

            scrollerContent.forEach((item) => {
                const duplicatedItem = item.cloneNode(true);
                if (scrollerRef.current) {
                    scrollerRef.current.appendChild(duplicatedItem);
                }
            });

            getDirection();
            getSpeed();
            setStart(true);
        }
    }

    const getDirection = () => {
        if (containerRef.current) {
            if (direction === "left") {
                containerRef.current.style.setProperty("--animation-direction", "forwards");
            } else {
                containerRef.current.style.setProperty("--animation-direction", "reverse");
            }
        }
    };

    const getSpeed = () => {
        if (containerRef.current) {
            if (speed === "fast") {
                containerRef.current.style.setProperty("--animation-duration", "20s");
            } else if (speed === "normal") {
                containerRef.current.style.setProperty("--animation-duration", "40s");
            } else {
                containerRef.current.style.setProperty("--animation-duration", "80s");
            }
        }
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
                className
            )}
        >
            <ul
                ref={scrollerRef}
                className={cn(
                    "flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
                    start && "animate-scroll",
                    pauseOnHover && "hover:[animation-play-state:paused]"
                )}
            >
                {items.map((item, idx) => (
                    <li
                        className="w-[350px] max-w-full relative rounded-2xl border border-b-0 flex-shrink-0 border-white/10 px-8 py-6 md:w-[450px] bg-gradient-to-b from-gray-900 to-black"
                        key={item.id || idx}
                    >
                        {/* 
               The user didn't specify the exact card content structure in the request, 
               but replacing the gallery implies images. 
               However, the "Infinite Moving Cards" usually displays testimonials or text.
               Given the user wants "images for photos in the event gallery", 
               I should adapt this to display IMAGES.
            */}
                        <div className="relative z-20 w-full h-[250px] overflow-hidden rounded-xl">
                            <img src={item.src} alt={item.alt || "Gallery Image"} className="w-full h-full object-cover" />
                        </div>
                        <div className="relative z-20 mt-4">
                            <span className="text-sm leading-[1.6] text-gray-100 font-normal">
                                {item.caption || "Event Moment"}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
