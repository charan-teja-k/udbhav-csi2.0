import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = new Date(targetDate) - new Date();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    const timeBlocks = [
        { value: timeLeft.days, label: 'Days' },
        { value: timeLeft.hours, label: 'Hours' },
        { value: timeLeft.minutes, label: 'Minutes' },
        { value: timeLeft.seconds, label: 'Seconds' }
    ];

    return (
        <div className="flex items-center justify-center gap-3 md:gap-6">
            {timeBlocks.map((block, index) => (
                <div key={block.label} className="flex items-center gap-3 md:gap-6">
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <div className="w-16 h-16 md:w-24 md:h-24 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl">
                                <span className="font-display text-3xl md:text-5xl font-bold bg-gradient-to-b from-teal-400 to-teal-600 bg-clip-text text-transparent">
                                    {String(block.value).padStart(2, '0')}
                                </span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-teal-500/20 to-transparent rounded-2xl pointer-events-none" />
                        </div>
                        <span className="text-xs md:text-sm text-gray-400 mt-2 uppercase tracking-wider font-medium">
                            {block.label}
                        </span>
                    </div>
                    {index < timeBlocks.length - 1 && (
                        <span className="text-2xl md:text-4xl font-bold text-teal-500 animate-pulse">:</span>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CountdownTimer;
