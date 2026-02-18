import { motion, AnimatePresence } from "framer-motion";
import { Users, User, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RegistrationModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleSelect = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-lg bg-[#0a0f1a]/95 border border-teal-500/20 rounded-2xl p-8 shadow-2xl shadow-teal-500/10"
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Choose Registration Type</h2>
              <p className="text-gray-400 text-sm">Select how you want to participate in UDBHAV 2K26</p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Single Registration */}
              <motion.button
                onClick={() => handleSelect("/single-Reg")}
                className="group relative flex flex-col items-center gap-4 p-6 rounded-xl border border-white/10 bg-white/5 hover:border-teal-500/50 hover:bg-teal-500/10 transition-all duration-300 text-left"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="w-14 h-14 rounded-full bg-teal-500/20 flex items-center justify-center group-hover:bg-teal-500/30 transition-colors">
                  <User className="w-7 h-7 text-teal-400" />
                </div>
                <div className="text-center">
                  <h3 className="text-white font-semibold text-lg mb-1">Individual</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">Register as a solo participant</p>
                </div>
                <ArrowRight className="w-4 h-4 text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-4 right-4" />
              </motion.button>

              {/* Team Registration */}
              <motion.button
                onClick={() => handleSelect("/registration")}
                className="group relative flex flex-col items-center gap-4 p-6 rounded-xl border border-white/10 bg-white/5 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-300 text-left"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="w-14 h-14 rounded-full bg-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
                  <Users className="w-7 h-7 text-cyan-400" />
                </div>
                <div className="text-center">
                  <h3 className="text-white font-semibold text-lg mb-1">Team</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">Register with a team of up to 6</p>
                </div>
                <ArrowRight className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-4 right-4" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RegistrationModal;
