import React from 'react';
import { Download, ArrowRight, X } from 'lucide-react';

export default function NotificationBanner({ onClose }) {
  const downloadPPT = () => {
    const link = document.createElement("a");
    link.href = "/ppt_template/udbhav_ppt_1.pptx";
    link.download = "udbhav_ppt_1.pptx";
    link.click();
  };

  return (
    <div className="fixed top-16 md:top-20 left-0 right-0 z-40 bg-gradient-to-r from-teal-600/10 via-cyan-600/10 to-teal-600/90 backdrop-blur-sm border-b border-teal-400/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3 flex-1">
            <Download className="w-5 h-5 text-yellow-300 hidden sm:block" />

            <p className="text-[#b7f803] text-sm md:text-base font-medium">
              <span className=" sm:inline">PPT Template is now available! </span>

              <span className="hidden sm:inline  ">Download the presentation template for UDBHAV 2K26</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={downloadPPT}
              className="flex items-center gap-1 px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-white text-sm font-medium transition-all"
            >
              Download Now
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
