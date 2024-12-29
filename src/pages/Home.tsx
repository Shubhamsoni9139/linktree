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
    <div className="min-h-screen w-full bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 overflow-hidden text-white">
      <Navbar />
      <motion.div
        className="flex flex-col lg:flex-row items-center justify-between max-w-6xl mx-auto px-4 mt-10 lg:mt-20 gap-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="max-w-xl" variants={itemVariants}>
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-purple-400"
            variants={itemVariants}
          >
            Everything you are. In one, simple link in bio.
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg text-purple-300/80 mb-8"
            variants={itemVariants}
          >
            Simplify your online presence with LinkMe. One link to share
            everything you create, showcase, and sell—perfect for Instagram,
            TikTok, Twitter, YouTube, and more!
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center"
            variants={itemVariants}
          >
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                placeholder="yourname"
                className="w-full px-4 py-3 rounded-full bg-zinc-800/50 border border-purple-500/20 focus:outline-none focus:border-purple-500 pr-32 text-white placeholder:text-zinc-500"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600">
                linkme/
              </span>
            </div>
            <button className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
              Claim your LinkMe
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative w-72 sm:w-80 lg:w-[400px] shrink-0"
          variants={phoneVariants}
          initial="hidden"
          animate={["visible", "float"]}
        >
          <div className="bg-zinc-800 rounded-3xl shadow-xl shadow-purple-500/10 p-4 transform rotate-6">
            <div className="bg-zinc-900 rounded-2xl p-4 aspect-[9/19]">
              <div className="w-16 h-16 rounded-full bg-purple-600/50 mx-auto mb-4" />
              <div className="w-32 h-4 bg-zinc-800 rounded-full mx-auto mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-full h-12 bg-zinc-800 rounded-lg" />
                ))}
              </div>
              <div className="flex space-x-3 mt-5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-12 h-12 bg-zinc-800 rounded-lg" />
                ))}
              </div>
              <div className="flex space-x-3 mt-5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-12 h-12 bg-zinc-800 rounded-lg" />
                ))}
              </div>
              <div className="space-y-3 mt-5">
                {[1].map((i) => (
                  <div key={i} className="w-full h-12 bg-zinc-800 rounded-lg" />
                ))}
              </div>
              <div className="space-y-3 mt-5">
                {[1].map((i) => (
                  <div key={i} className="w-full h-12 bg-zinc-800 rounded-lg" />
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
