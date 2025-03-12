"use client"
import { motion } from "motion/react";


const letterVariants = {
  initial: { opacity: 0, y: -20, rotate: -10 },
  animate: {
    opacity: 1,
    y: 0,
    rotate: 0,
    textShadow: [
      "0px 0px 10px #00FF00",
      "0px 0px 30px #00FF00",
      "0px 0px 10px #00FF00"
    ],
    transition: {
      textShadow: {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      },
      default: { type: "spring", stiffness: 300, damping: 20 }
    }
  },
  hover: {
    rotate: 5,
    scale: 1.05,
    textShadow: "0px 0px 20px #00FF00"
  }
};

const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2
    }
  }
};

const RibbitLogo = () => {
  return (
    <motion.h1
      className="text-4xl font-extrabold text-green-400 cursor-pointer"
      initial="initial"
      animate="animate"
      variants={containerVariants}
      whileHover="hover"
      // style={{ textShadow: "0px 0px 10px #00FF00" }}
    >
      {"Ribbit".split("").map((letter, index) => (
        <motion.span key={index} variants={letterVariants}>
          {letter}
        </motion.span>
      ))}
    </motion.h1>
  );
};

export default RibbitLogo;