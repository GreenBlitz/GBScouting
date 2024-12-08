import React from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface PassQueryProps {
  name: string;
  label?: string;
}

const PassQuery: React.FC<PassQueryProps> = ({ name, label }) => {
  const [attempts, setAttempts] = React.useState<{ success: number; miss: number }>({
    success: 0,
    miss: 0,
  });

  return (
    <div className="space-y-4">
      {label && <h3 className="text-lg font-semibold">{label}</h3>}
      <div className="flex gap-4">
        {/* Success Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setAttempts(prev => ({ ...prev, success: prev.success + 1 }))}
          className="flex-1 flex items-center justify-center gap-2 btn btn-primary"
        >
          <Check className="w-5 h-5" />
          <span>Success ({attempts.success})</span>
        </motion.button>

        {/* Miss Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setAttempts(prev => ({ ...prev, miss: prev.miss + 1 }))}
          className="flex-1 flex items-center justify-center gap-2 btn btn-secondary"
        >
          <X className="w-5 h-5" />
          <span>Miss ({attempts.miss})</span>
        </motion.button>
      </div>
    </div>
  );
};

export default PassQuery;
