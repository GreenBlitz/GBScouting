import { useLocation, useNavigate } from "react-router-dom";
import Collapsible from "react-collapsible";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Send, ChevronDown } from "lucide-react";
import QRCodeGenerator from "../components/QRCode-Generator";
import { fetchData } from "../Utils";
import { renderScouterNavBar } from "../App";
import { matchFolder as matchesFolder } from "../utils/FolderStorage";

export const matchName = "Qual";

const MatchList: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [matches, setMatches] = useState<Record<string, string>[]>(
    matchesFolder.keys()
      .map((matchName) => JSON.parse(matchesFolder.getItem(matchName) || "{}"))
  );

  const latestMatch: Record<string,string> | undefined = location.state;
  location.state = {};

  if (latestMatch?.[matchName]) {
    matches.push(latestMatch);
    matchesFolder.setItem(
      latestMatch[matchName],
      JSON.stringify(latestMatch)
    );
  }

  function removeMatch(qualNumber: string, index: number) {
    matchesFolder.removeItem(qualNumber);
    const filtered = [...matches];
    filtered.splice(index, 1);
    setMatches(filtered);
    navigate("/");
  }

  function sendMatch(match: Record<string, string>, index: number) {
    fetchData("Match")
      .then(() => {
        alert("Successfully Sent Match✅");
        removeMatch(match?.[matchName], index);
      })
      .catch(() => {
        alert("Unable To Send Match.");
      });
  }

  return (
    <div className="w-full">
      {renderScouterNavBar()}
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 mt-8 dark:bg-dark-card dark:border dark:border-dark-border"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-6 dark:text-dark-text text-center">Match List</h1>
          {matches.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500 text-center py-8 dark:text-dark-text-secondary"
            >
              No Matches Saved
            </motion.p>
          )}
          <AnimatePresence>
            {matches.map((match, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-4"
              >
                <Collapsible
                  trigger={
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer dark:bg-dark-card dark:hover:bg-gray-800">
                      <span className="text-gray-900 font-medium dark:text-dark-text">
                        {match["Team Number"]} {matchName} {match[matchName]}
                      </span>
                      <ChevronDown className="w-5 h-5 text-gray-500 dark:text-dark-text-secondary" />
                    </div>
                  }
                  triggerClassName="w-full"
                  transitionTime={200}
                >
                  <div className="p-4 space-y-4 dark:bg-dark-card dark:border-t dark:border-dark-border">
                    <div className="flex justify-center">
                      <QRCodeGenerator text={JSON.stringify(match)} />
                    </div>
                    <div className="flex justify-center gap-4">
                      <button
                        type="button"
                        onClick={() => removeMatch(match?.[matchName], index)}
                        className="btn btn-secondary flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => sendMatch(match, index)}
                        className="btn btn-primary flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Send
                      </button>
                    </div>
                  </div>
                </Collapsible>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default MatchList;
