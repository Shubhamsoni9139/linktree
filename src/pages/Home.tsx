import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Navbar } from "../components/Navbar";
const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const phoneVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    float: {
      y: [0, -5, 0, 5, 0],
      transition: {
        repeat: Infinity,
        repeatType: "reverse" as const,
        duration: 3,
      },
    },
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#F5EFFF] to-[#E5D9F2] overflow-hidden">
      <Navbar />
      <motion.div
        className="flex items-center justify-between max-w-6xl mx-auto px-4 mt-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="max-w-xl" variants={itemVariants}>
          <motion.h1
            className="text-6xl font-bold mb-6 text-[#A294F9]"
            variants={itemVariants}
          >
            Everything you are. In one, simple link in bio.
          </motion.h1>
          <motion.p
            className="text-lg text-[#A294F9]/80 mb-8"
            variants={itemVariants}
          >
            Join 50M+ people using Linktree for their link in bio. One link to
            help you share everything you create, curate and sell from your
            Instagram, TikTok, Twitter, YouTube and other social media profiles.
          </motion.p>

          <motion.div
            className="flex gap-4 items-center"
            variants={itemVariants}
          >
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                placeholder="yourname"
                className="w-full px-4 py-3 rounded-full bg-white/50 border border-[#CDC1FF] focus:outline-none focus:border-[#A294F9] pr-32"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A294F9]/50">
                linktree/
              </span>
            </div>
            <button className="px-6 py-3 bg-[#CDC1FF] text-white rounded-full hover:bg-[#A294F9] transition-colors flex items-center gap-2">
              Claim your Linktree
              <ArrowRight size={16} />
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative w-80"
          variants={phoneVariants}
          initial="hidden"
          animate={["visible", "float"]}
        >
          <div className="bg-white rounded-3xl shadow-xl p-4 transform rotate-6">
            <div className="bg-[#F5EFFF] rounded-2xl p-4 aspect-[9/19]">
              <div className="w-16 h-16 rounded-full bg-[#CDC1FF] mx-auto mb-4" />
              <div className="w-32 h-4 bg-[#E5D9F2] rounded-full mx-auto mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-full h-12 bg-[#E5D9F2] rounded-lg"
                  />
                ))}
              </div>
              <div className="flex space-x-3 mt-5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-12 h-12 bg-[#E5D9F2] rounded-lg" />
                ))}
              </div>
              <div className="flex space-x-3 mt-5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-12 h-12 bg-[#E5D9F2] rounded-lg" />
                ))}
              </div>
              <div className="space-y-3 mt-5">
                {[1].map((i) => (
                  <div
                    key={i}
                    className="w-full h-12 bg-[#E5D9F2] rounded-lg"
                  />
                ))}
              </div>
              <div className="mt-5">
                {[1].map((i) => (
                  <div
                    key={i}
                    className="w-full h-12 bg-[#E5D9F2] text-white font-semibold rounded-lg flex items-center justify-center cursor-pointer hover:bg-purple-700"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
