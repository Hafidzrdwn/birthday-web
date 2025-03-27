"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Gift,
  Camera,
  Music,
  ChevronDown,
  X,
  Calendar,
  MessageCircle,
  Star,
  Sparkles,
  Play,
  Pause,
} from "lucide-react";
import Image from "next/image";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/use-window-size";
import { cn } from "@/lib/utils";

export default function BirthdayPage() {
  const [activeSection, setActiveSection] = useState("greeting");
  const [showConfetti, setShowConfetti] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  interface ImageProps {
    src: string;
    alt?: string;
    caption?: string;
    bottom?: boolean;
  }

  const [selectedImage, setSelectedImage] = useState<ImageProps | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const { width, height } = useWindowSize();
  const sectionsRef = useRef<Record<string, HTMLElement | null>>({});
  const mainRef = useRef(null);

  // Stop confetti after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  // Handle scroll to section
  const scrollToSection = (section: string) => {
    setActiveSection(section);
    setMenuOpen(false);
    if (sectionsRef.current[section]) {
      sectionsRef.current[section].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Register section ref
  const registerSection = (section: string, ref: HTMLElement | null) => {
    if (ref) {
      sectionsRef.current[section] = ref;
    }
  };

  // Observe which section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = entry.target.getAttribute("data-section");
            if (section) setActiveSection(section);
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = Object.values(sectionsRef.current);

    sections.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      sections.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  // Image modal
  const ImageModal = ({
    image,
    onClose,
  }: {
    image: ImageProps | null;
    onClose: () => void;
  }) => {
    if (!image) return null;

    return (
      <motion.div
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative max-w-4xl max-h-[75vh] sm:max-h-[90vh] bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20"
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-black p-2 rounded-full bg-white/30 hover:bg-white cursor-pointer transition-colors z-10"
          >
            <X size={24} />
          </button>
          <div className="p-1 w-[400px] h-[900px]">
            <Image
              src={image.src || "https://placehold.co/600x400"}
              alt={image.alt || "Birthday image"}
              fill
              className={`object-cover rounded-xl
                  ${image.bottom ? "object-bottom" : "object-center"}
                `}
            />
          </div>
          {image.caption && (
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <p className="text-white text-center text-lg font-medium">
                {image.caption}
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    );
  };

  // Memory gallery images
  const memories = [
    {
      src: "/images/photo1.jpg",
      alt: "UPGRADING24",
      caption: "Our 1st moment together",
      bottom: true,
    },
    {
      src: "/images/photo2.jpg",
      alt: "DIMENSI24",
      caption: "Our 1st photo together",
      bottom: true,
    },
    {
      src: "/images/photo3.jpg",
      alt: "ISMURF24",
      caption: "Unexpected Photobooth!",
      bottom: true,
    },
    {
      src: "/images/photo4.jpg",
      alt: "PENSI24",
      caption: "Finally, Official!",
      bottom: false,
    },
    {
      src: "/images/photo5.jpg",
      alt: "Photobooth",
      caption: "Cutest Photobox Ever!",
      bottom: false,
    },
    {
      src: "/images/photo6.webp",
      alt: "Selfies",
      caption: "Selfies After Mie Ayam Date",
      bottom: true,
    },
    {
      src: "/images/photo7.jpg",
      alt: "GrandHarvest",
      caption: "Grand Harvest Date",
      bottom: true,
    },
    {
      src: "/images/photo8.jpg",
      alt: "DIKSI25",
      caption: "2-period Synergy",
      bottom: true,
    },
    {
      src: "/images/photo9.jpg",
      alt: "HIBUR25",
      caption: "Iftar with Pretty Girl!",
      bottom: true,
    },
  ];

  // Birthday wishes
  const wishes = [
    {
      icon: <Heart className="w-5 h-5 text-pink-500" />,
      title: "Love",
      text: "May our love continue to grow stronger with each passing day.",
    },
    {
      icon: <Gift className="w-5 h-5 text-purple-500" />,
      title: "Joy",
      text: "Wishing you a year filled with moments that make your heart smile.",
    },
    {
      icon: <Music className="w-5 h-5 text-blue-500" />,
      title: "Happiness",
      text: "May your days be filled with laughter, music, and all the things you love.",
    },
    {
      icon: <Calendar className="w-5 h-5 text-green-500" />,
      title: "Adventure",
      text: "Here&apos;s to a year of new experiences and exciting adventures together.",
    },
  ];

  // Mobile menu
  const MobileMenu = () => (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="h-full flex flex-col items-center justify-center gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {["greeting", "gallery", "message", "wishes"].map(
              (section, index) => (
                <motion.button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={cn(
                    "text-xl font-medium transition-colors",
                    activeSection === section ? "text-pink-400" : "text-white"
                  )}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.1 * index },
                  }}
                >
                  <span className="capitalize">{section}</span>
                </motion.button>
              )
            )}

            <motion.button
              className="mt-4 text-white/80 border border-white/20 rounded-full p-3"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: { delay: 0.5 },
              }}
            >
              <X size={24} />
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Autoplay audio
  useEffect(() => {
    // Create audio element
    if (!audioRef.current) {
      audioRef.current = new Audio("/songs.mp3");
      audioRef.current.loop = true;

      // Try to autoplay (may be blocked by browser)
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.log("Autoplay prevented by browser:", error);
          setIsPlaying(false);
        });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Function to toggle audio playback
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 overflow-hidden">
      {showConfetti && (
        <Confetti width={width} height={height} recycle={false} />
      )}

      {/* Mobile Menu */}
      <MobileMenu />

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <motion.div
              className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Andeen&apos;s Birthday
            </motion.div>

            <nav className="hidden md:flex items-center space-x-8">
              {["greeting", "gallery", "message", "wishes"].map(
                (section, index) => (
                  <motion.button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className={cn(
                      "text-sm font-medium transition-colors relative",
                      activeSection === section
                        ? "text-pink-500"
                        : "text-gray-600"
                    )}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="capitalize cursor-pointer">{section}</span>
                    {activeSection === section && (
                      <motion.div
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-pink-500 rounded-full"
                        layoutId="activeSection"
                      />
                    )}
                  </motion.button>
                )
              )}
            </nav>

            <motion.div
              className="md:hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <button
                className="text-gray-600 hover:text-pink-500 transition-colors"
                onClick={() => setMenuOpen(true)}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 6H20M4 12H20M4 18H20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Audio control button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.5, duration: 0.5 }}
        onClick={toggleAudio}
        className="fixed bottom-6 right-6 z-50 bg-white/20 backdrop-blur-md p-3 rounded-full shadow-lg border border-white/30 hover:bg-white/30 transition-colors"
      >
        {isPlaying ? (
          <Pause className="text-pink-500" size={24} />
        ) : (
          <Play className="text-pink-500" size={24} />
        )}
      </motion.button>

      <main ref={mainRef}>
        {/* Hero Section */}
        <section
          ref={(ref) => registerSection("greeting", ref)}
          data-section="greeting"
          className="min-h-[100vh] flex flex-col items-center justify-center relative px-4 pb-20 pt-28"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(255, 182, 193, 0.2) 0%, rgba(255, 255, 255, 0) 50%)",
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center max-w-3xl mx-auto relative z-10"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="absolute top-5 -right-20 text-pink-200 opacity-50 hidden md:block"
            >
              <Sparkles size={120} />
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">
                Happy Birthday,
              </span>
              <br />
              <motion.span
                className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
                style={{ backgroundSize: "200% 200%" }}
              >
                Pretty!
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Today is all about celebrating the amazing person you are and the
              joy you bring to my life.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="relative w-full md:max-w-2xl mx-auto min-h-[450px] sm:h-[680px] md:aspect-video rounded-2xl overflow-hidden"
              style={{
                boxShadow: "0 25px 50px -12px rgba(219, 39, 119, 0.25)",
                transform: "perspective(1000px) rotateX(5deg)",
              }}
            >
              <Image
                src="/images/hero.jpg"
                alt="Happy Birthday"
                fill
                className="object-cover"
              />

              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 to-purple-500/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
              />

              <motion.div
                className="absolute inset-0 border-2 border-white/30 rounded-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="mt-10"
            >
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(219, 39, 119, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                className="relative overflow-hidden cursor-pointer group bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-medium shadow-lg"
                onClick={() => scrollToSection("gallery")}
              >
                <span className="relative z-10">Explore Your Surprise Now</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.4 }}
                />
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <ChevronDown size={30} className="text-pink-500" />
            </motion.div>
          </motion.div>
        </section>

        {/* Calendar Section */}
        <section className="py-20 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-pink-50/80 backdrop-blur-sm -z-10" />

          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <motion.div
                className="inline-block mb-2"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <Calendar size={32} className="text-purple-500 mx-auto" />
              </motion.div>

              <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                Special Date
              </h2>

              <p className="text-gray-600 max-w-2xl mx-auto">
                The day a beautiful soul came into this world.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative max-w-3xl mx-auto"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl blur opacity-20" />

              <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 md:p-10 border border-white/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <motion.div
                      className="text-center md:text-left"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        March 28, 2004
                      </h3>
                      <p className="text-gray-600 mb-4">
                        The day you were born
                      </p>

                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                          <p className="text-gray-700">A Sunday</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                          <p className="text-gray-700">21 years ago</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <p className="text-gray-700">A Wonderful Day!</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="relative"
                  >
                    <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl p-6">
                      <div className="text-center mb-4">
                        <h4 className="font-bold text-purple-800 text-lg">
                          March 2004
                        </h4>
                      </div>

                      <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        <div className="text-xs font-medium text-gray-500">
                          Su
                        </div>
                        <div className="text-xs font-medium text-gray-500">
                          Mo
                        </div>
                        <div className="text-xs font-medium text-gray-500">
                          Tu
                        </div>
                        <div className="text-xs font-medium text-gray-500">
                          We
                        </div>
                        <div className="text-xs font-medium text-gray-500">
                          Th
                        </div>
                        <div className="text-xs font-medium text-gray-500">
                          Fr
                        </div>
                        <div className="text-xs font-medium text-gray-500">
                          Sa
                        </div>
                      </div>

                      <div className="grid grid-cols-7 gap-1 text-center">
                        {/* First week */}
                        <div className="text-gray-400 p-2 text-sm"></div>
                        <div className="text-gray-600 p-2 text-sm">1</div>
                        <div className="text-gray-600 p-2 text-sm">2</div>
                        <div className="text-gray-600 p-2 text-sm">3</div>
                        <div className="text-gray-600 p-2 text-sm">4</div>
                        <div className="text-gray-600 p-2 text-sm">5</div>
                        <div className="text-gray-600 p-2 text-sm">6</div>

                        {/* Second week */}
                        <div className="text-gray-600 p-2 text-sm">7</div>
                        <div className="text-gray-600 p-2 text-sm">8</div>
                        <div className="text-gray-600 p-2 text-sm">9</div>
                        <div className="text-gray-600 p-2 text-sm">10</div>
                        <div className="text-gray-600 p-2 text-sm">11</div>
                        <div className="text-gray-600 p-2 text-sm">12</div>
                        <div className="text-gray-600 p-2 text-sm">13</div>

                        {/* Third week */}
                        <div className="text-gray-600 p-2 text-sm">14</div>
                        <div className="text-gray-600 p-2 text-sm">15</div>
                        <div className="text-gray-600 p-2 text-sm">16</div>
                        <div className="text-gray-600 p-2 text-sm">17</div>
                        <div className="text-gray-600 p-2 text-sm">18</div>
                        <div className="text-gray-600 p-2 text-sm">19</div>
                        <div className="text-gray-600 p-2 text-sm">20</div>

                        {/* Fourth week */}
                        <div className="text-gray-600 p-2 text-sm">21</div>
                        <div className="text-gray-600 p-2 text-sm">22</div>
                        <div className="text-gray-600 p-2 text-sm">23</div>
                        <div className="text-gray-600 p-2 text-sm">24</div>
                        <div className="text-gray-600 p-2 text-sm">25</div>
                        <div className="text-gray-600 p-2 text-sm">26</div>
                        <div className="text-gray-600 p-2 text-sm">27</div>

                        {/* Fifth week - with highlighted birthday */}
                        <motion.div
                          className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-white p-2 text-sm font-bold"
                          animate={{
                            scale: [1, 1.15, 1],
                            boxShadow: [
                              "0 0 0 rgba(236, 72, 153, 0)",
                              "0 0 20px rgba(236, 72, 153, 0.7)",
                              "0 0 0 rgba(236, 72, 153, 0)",
                            ],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                          }}
                        >
                          28
                        </motion.div>
                        <div className="text-gray-600 p-2 text-sm">29</div>
                        <div className="text-gray-600 p-2 text-sm">30</div>
                        <div className="text-gray-600 p-2 text-sm">31</div>
                        <div className="text-gray-400 p-2 text-sm"></div>
                        <div className="text-gray-400 p-2 text-sm"></div>
                        <div className="text-gray-400 p-2 text-sm"></div>
                      </div>
                    </div>

                    <motion.div
                      className="absolute -bottom-4 -right-4"
                      animate={{
                        rotate: [0, 10, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                    >
                      <Sparkles size={40} className="text-pink-500" />
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Gallery Section */}
        <section
          ref={(ref) => registerSection("gallery", ref)}
          data-section="gallery"
          className="py-20 px-4 relative"
        >
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm -z-10" />

          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <motion.div
                className="inline-block mb-2"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <Camera size={32} className="text-pink-500 mx-auto" />
              </motion.div>

              <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">
                Our Beautiful Memories
              </h2>

              <p className="text-gray-600 max-w-2xl mx-auto">
                Every moment with you is a treasure. Here are some of my
                favorite memories that we&apos;ve shared together.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-center">
              {memories.map((memory, index) => {
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 150,
                      damping: 15,
                    }}
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                    className="group cursor-pointer"
                    onClick={() => {
                      setSelectedImage(memory);
                      setShowModal(true);
                    }}
                  >
                    <motion.div
                      animate={{
                        scale: hoverIndex === index ? 1.07 : 1,
                        y: hoverIndex === index ? -10 : 0,
                        boxShadow:
                          hoverIndex === index
                            ? "0px 15px 30px rgba(0,0,0,0.2)"
                            : "0px 5px 15px rgba(0,0,0,0.1)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 12,
                      }}
                      className="relative aspect-[4/3] rounded-xl overflow-hidden bg-white p-2"
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-pink-200/30 via-purple-200/30 to-blue-200/30 rounded-lg" />

                      <div className="relative h-full rounded-lg overflow-hidden">
                        <Image
                          src={memory.src || "/placeholder.svg"}
                          alt={memory.alt}
                          fill
                          className={`object-cover transition-transform duration-500 ease-in-out group-hover:scale-105
                              ${
                                index === 7 || index === 8
                                  ? "object-bottom"
                                  : "object-center"
                              }
                            `}
                        />

                        <motion.div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

                        <motion.div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-white font-medium text-lg">
                            {memory.caption}
                          </p>
                        </motion.div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Message Section */}
        <section
          ref={(ref) => registerSection("message", ref)}
          data-section="message"
          className="py-20 px-4 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-pink-50/80 to-purple-50/80 backdrop-blur-sm -z-10" />

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <motion.div
                className="inline-block mb-2"
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <MessageCircle size={32} className="text-purple-500 mx-auto" />
              </motion.div>

              <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                My Birthday Message
              </h2>

              <p className="text-gray-600">
                A few words from my heart to yours on your special day.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl blur opacity-20" />

              <div className="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 md:p-10 border border-white/50">
                <div className="absolute -top-5 -left-5">
                  <motion.div
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  >
                    <MessageCircle
                      size={40}
                      className="text-pink-500 fill-pink-100"
                    />
                  </motion.div>
                </div>

                <motion.p
                  className="text-gray-700 text-lg italic mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  &quot;To the most amazing person I know,
                </motion.p>

                <motion.p
                  className="text-gray-700 text-lg mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Happy Birthday! Today is all about celebrating you - your
                  kindness, your strength, your beauty, and everything that
                  makes you so special.
                </motion.p>

                <motion.p
                  className="text-gray-700 text-lg mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  Thank you for filling my days with joy and my heart with love.
                  I&apos;m so grateful to have you in my life.
                </motion.p>

                <motion.p
                  className="text-gray-700 text-lg mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  Here&apos;s to another year of adventures, laughter, and making
                  beautiful memories together.
                </motion.p>

                <motion.p
                  className="text-gray-700 text-lg italic mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  With all my love,&quot;
                </motion.p>

                <motion.p
                  className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  Hafidzrdwn, ilysm❤️.
                </motion.p>

                <motion.div
                  className="absolute -bottom-6 -right-6"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  <Heart size={50} className="text-pink-500 fill-pink-200" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Wishes Section */}
        <section
          ref={(ref) => registerSection("wishes", ref)}
          data-section="wishes"
          className="py-20 px-4 relative"
        >
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm -z-10" />

          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <motion.div
                className="inline-block mb-2"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 10,
                  delay: 0.2,
                }}
              >
                <Star size={32} className="text-purple-500 mx-auto" />
              </motion.div>

              <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                Birthday Wishes
              </h2>

              <p className="text-gray-600 max-w-2xl mx-auto">
                My wishes for you on your special day and for the year ahead.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {wishes.map((wish, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30, y: 20 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.15,
                    type: "spring",
                    stiffness: 100,
                  }}
                  whileHover={{
                    y: -10,
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

                  <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/50 h-full">
                    <div className="flex items-start gap-4">
                      <motion.div
                        className="bg-gradient-to-br from-pink-100 to-purple-100 p-3 rounded-full shadow-sm"
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        {wish.icon}
                      </motion.div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {wish.title}
                        </h3>
                        <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: wish.text }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-16 text-center"
            >
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(219, 39, 119, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                className="relative cursor-pointer overflow-hidden group bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-medium shadow-lg transition-all"
                onClick={() => {
                  setShowConfetti(true);
                  setTimeout(() => setShowConfetti(false), 10000);
                  window.scrollTo({ top: 0 });
                }}
              >
                <span className="relative z-10">Celebrate Again! 🎉</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.4 }}
                />
              </motion.button>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-white/10 backdrop-blur-md py-8 text-center text-gray-600 text-sm border-t border-white/20">
        <p>Made with ❤️ for your special day</p>
      </footer>

      {/* Image Modal */}
      <AnimatePresence>
        {showModal && selectedImage && (
          <ImageModal
            image={selectedImage}
            onClose={() => {
              setShowModal(false);
              setSelectedImage(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
