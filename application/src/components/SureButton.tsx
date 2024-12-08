import React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Check, X } from "lucide-react";
// הי יוני מה קורה
interface SureButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
  className?: string;
}

const SureButton: React.FC<SureButtonProps> = ({ onClick, children, className }) => {
  const [areYouSure, setAreYouSure] = useState<boolean>(false);

  return (
    <div className="relative inline-block">
      <AnimatePresence>
        {areYouSure ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute bottom-full mb-2 right-0 bg-white rounded-lg shadow-lg p-4 min-w-[200px] dark:bg-dark-card dark:border dark:border-dark-border"
          >
            <div className="flex items-center gap-2 text-amber-600 mb-3 dark:text-amber-500">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium dark:text-dark-text">Are you sure?</span>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAreYouSure(false)}
                className="btn btn-secondary flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                No
              </button>
              <button
                type="button"
                onClick={onClick}
                className="btn btn-primary flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Yes
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setAreYouSure(true)}
        className={className}
      >
        {children}
      </button>
    </div>
  );
};

export default SureButton;
