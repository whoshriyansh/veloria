"use client";

import { motion, useReducedMotion } from "framer-motion";

export function SplitHeading({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) {
    return <h1 className={className}>{text}</h1>;
  }

  return (
    <h1 className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom pr-[0.22em]">
          <motion.span
            className="inline-block"
            initial={{ y: "115%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.95, delay: 0.12 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}
