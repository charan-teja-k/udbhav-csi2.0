import React from 'react';
import { Lightbulb, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotificationBanner({ onClose }) {
  const navigate = useNavigate();

  return (
    <div className="fixed top-16 md:top-20 left-0 right-0 z-40 bg-gradient-to-r from-teal-600/10 via-cyan-600/10 to-teal-600/90 backdrop-blur-sm border-b border-teal-400/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3 flex-1">
            <Lightbulb className="w-5 h-5 text-yellow-300 hidden sm:block" />
            
            <p className="text-white text-sm md:text-base font-medium">
              <span className=" sm:inline text-teal-100">Idea Submission Portal is now open! </span>
              
              <span className="hidden sm:inline  ">Submit your problem statement for UDBHAV 2K26</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/idea-submission')}
              className="flex items-center gap-1 px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-white text-sm font-medium transition-all"
            >
              Submit Now
              <ArrowRight className="w-4 h-4" />
            </button>
            
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
