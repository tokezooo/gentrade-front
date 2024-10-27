import { motion } from "framer-motion";
import Link from "next/link";

import { LogoOpenAI, MessageIcon, VercelIcon } from "./icons";

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-[500px] mt-1 mx-4 md:mx-0"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="border rounded-xl p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
        <div className="flex flex-row justify-center gap-4 items-center text-zinc-900 dark:text-zinc-50">
          <h1 className="text-2xl font-bold">GenTrade</h1>
        </div>
        <p className="text-center">
          GenTrade is a platform for generating and testing crypto trading bots.
          Create your own trading bot army within a friendly chat interface.
        </p>
      </div>
    </motion.div>
  );
};
