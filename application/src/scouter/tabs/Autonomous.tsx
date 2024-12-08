import React from "react";
import { motion } from "framer-motion";
import { Target, XCircle } from "lucide-react";
import CounterQuery from "../querytypes/CounterQuery";

interface AutonomousProps {}

const Autonomous: React.FC<AutonomousProps> = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 w-full max-w-lg mx-auto"
    >
      <div className="grid grid-cols-1 gap-8">
        {/* Score Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0 }}
          className="bg-dark-card rounded-xl p-6 shadow-lg border border-dark-border"
        >
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-emerald-500" />
            <h3 className="text-xl font-semibold text-dark-text">Speaker Score</h3>
          </div>
          <div className="flex justify-center">
            <CounterQuery name={"Speaker/Auto/Score"} color="#059669" />
          </div>
        </motion.div>

        {/* Miss Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-dark-card rounded-xl p-6 shadow-lg border border-dark-border"
        >
          <div className="flex items-center gap-3 mb-6">
            <XCircle className="w-6 h-6 text-red-500" />
            <h3 className="text-xl font-semibold text-dark-text">Speaker Miss</h3>
          </div>
          <div className="flex justify-center">
            <CounterQuery name={"Speaker/Auto/Miss"} color="#dc2626" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Autonomous;
