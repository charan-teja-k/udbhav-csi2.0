import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import RegistrationModal from "@/components/RegistrationModal";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isRegModalOpen, setIsRegModalOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const isHomePage = location.pathname === "/";

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { label: "About", href: "#about" },
        { label: "Tracks", href: "#tracks" },
        { label: "Timeline", href: "#timeline" },
    ];

    const handleRegistration = () => {
        setIsRegModalOpen(true);
    };
    const downloadPPT = () => {
        const link = document.createElement("a");
        link.href = "/ppt_template/udbhav_ppt_1.pptx";
        link.download = "udbhav_ppt_1.pptx";
        link.click();
    };


    return (
        <>
            <motion.nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? "bg-background/80 backdrop-blur-lg border-b border-border/50"
                    : "bg-transparent"
                    }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Logo */}
                        <a 
                            href={isHomePage ? "#" : "/"} 
                            onClick={(e) => {
                                if (!isHomePage) {
                                    e.preventDefault();
                                    navigate('/');
                                }
                            }}
                            className="font-display text-xl md:text-2xl font-bold gradient-text"
                        >
                            UDBHAV 2K26
                        </a>

                        {/* Desktop Nav */}
                        <div className=" hidden md:flex items-center gap-8">
                            


                            {navLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={isHomePage ? link.href : '/' + link.href}
                                    onClick={(e) => {
                                        if (!isHomePage) {
                                            e.preventDefault();
                                            navigate('/' + link.href);
                                        }
                                    }}
                                    className="relative text-sm md:text-base font-semibold text-white/80 hover:text-teal-300 tracking-wide transition-colors drop-shadow-[0_0_10px_rgba(20,184,166,0.35)] after:content-[''] after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-gradient-to-r after:from-teal-400 after:via-cyan-400 after:to-teal-300 after:transition-transform after:duration-300 hover:after:scale-x-100"
                                >
                                    {link.label}
                                </a>
                            ))}
                            <Button size="sm" className="font-display btn-yellow-blink px-6 py-2 rounded-full"
                            onClick={downloadPPT}>
                                PPT TEMPLATE
                            </Button>
                            
                            <Button size="sm" className="font-display relative overflow-hidden border-0 px-6 py-2 rounded-full text-teal-200 bg-gradient-to-r from-teal-500/30 via-emerald-400/40 to-cyan-500/30 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:text-white"
                            onClick={handleRegistration}>
                                Register
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="font-display relative overflow-hidden border-0 px-6 py-2 rounded-full text-teal-200 bg-gradient-to-r from-teal-500/20 via-emerald-400/30 to-cyan-500/20 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:text-white"
                                onClick={() => navigate('/idea-submission')}
                            >
                                <span className="relative z-10">Submit Idea →</span>
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="font-display relative overflow-hidden border-0 px-6 py-2 rounded-full text-cyan-200 bg-gradient-to-r from-cyan-500/20 via-blue-400/30 to-cyan-500/20 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:text-white"
                                onClick={() => navigate('/ppt-submission')}
                            >
                                <span className="relative z-10">Submit PPT →</span>
                            </Button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-teal-400"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className="fixed inset-0 z-40 md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div
                            className="absolute inset-0 bg-background/95 backdrop-blur-lg"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.div
                            className="absolute top-20 left-0 right-0 p-6"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                        >
                            <div className="flex flex-col gap-4">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.label}
                                        href={isHomePage ? link.href : '/' + link.href}
                                        className="text-lg text-white/90 font-semibold py-3 border-b border-teal-500/20 tracking-wide"
                                        onClick={(e) => {
                                            setIsMobileMenuOpen(false);
                                            if (!isHomePage) {
                                                e.preventDefault();
                                                navigate('/' + link.href);
                                            }
                                        }}
                                    >
                                        {link.label}
                                    </a>
                                ))}
                                
                                <Button
                                    className="font-display mt-2 relative overflow-hidden border-0 px-6 py-2 rounded-full text-teal-200 bg-gradient-to-r from-teal-500/30 via-emerald-400/40 to-cyan-500/30 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:text-white"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        handleRegistration();
                                    }}
                                >
                                    Register Now
                                </Button>
                                <Button
                                    className="font-display mt-2 btn-yellow-blink px-6 py-2 rounded-full"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        downloadPPT();
                                    }}
                                >
                                    PPT TEMPLATE
                                </Button>
                                <Button
                                    variant="outline"
                                    className="font-display mt-2 relative overflow-hidden border-0 px-6 py-2 rounded-full text-teal-200 bg-gradient-to-r from-teal-500/20 via-emerald-400/30 to-cyan-500/20 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:text-white"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        navigate('/idea-submission');
                                    }}
                                >
                                    <span className="relative z-10">Submit Idea →</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="font-display mt-2 relative overflow-hidden border-0 px-6 py-2 rounded-full text-cyan-200 bg-gradient-to-r from-cyan-500/20 via-blue-400/30 to-cyan-500/20 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:text-white"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        navigate('/ppt-submission');
                                    }}
                                >
                                    <span className="relative z-10">Submit PPT →</span>
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <RegistrationModal isOpen={isRegModalOpen} onClose={() => setIsRegModalOpen(false)} />
        </>
    );
};

export default Navbar;
