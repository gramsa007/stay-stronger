// src/components/common/WorkoutTimer.tsx
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { formatTime } from '../../utils/helpers';

interface WorkoutTimerProps {
    transparent?: boolean;
    initialTime?: number;
    // WICHTIG: Diese Zeile hier hat gefehlt!
    onTick?: (s: number) => void;
}

export const WorkoutTimer: React.FC<WorkoutTimerProps> = ({ 
    transparent = false, 
    initialTime = 0, 
    onTick 
}) => {
    const [seconds, setSeconds] = useState(initialTime);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        let interval: any = null;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds((s) => {
                    const next = s + 1;
                    if (onTick) onTick(next);
                    return next;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive, onTick]);

    useEffect(() => {
        setSeconds(initialTime);
    }, [initialTime]);

    return (
        <div className={`flex items-center gap-2 ${transparent ? 'bg-white/10 text-white' : 'bg-white text-gray-800 border border-gray-200'} px-3 py-1.5 rounded-full shadow-sm`}>
            <Clock size={14} className={isActive ? "animate-pulse text-blue-400" : "text-gray-400"} />
            <span className="font-mono font-bold text-sm tracking-widest">{formatTime(seconds || 0)}</span>
        </div>
    );
};