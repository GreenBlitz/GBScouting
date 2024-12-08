import React from "react";
import { motion } from "framer-motion";
import MapQuery from "../querytypes/MapQuery";
import { queryFolder } from "../../utils/FolderStorage";

interface TeleoperatedProps {}

const Teleoperated: React.FC<TeleoperatedProps> = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 w-full max-w-lg mx-auto"
    >
      <div className="grid grid-cols-1 gap-8">
        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-dark-card rounded-xl p-6 shadow-lg border border-dark-border"
        >
          <MapQuery
            name={"CRESCENDO"}
            side={queryFolder.getItem("Game Side") === "Red" ? "red" : "blue"}
            width={540 * 0.8}
            height={240 * 0.8}
            imagePath={"./src/assets/Crescendo Map.png"}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Teleoperated;
