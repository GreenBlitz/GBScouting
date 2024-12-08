import React, { useEffect } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { motion } from "framer-motion";
import { ClipboardList, Users, Scan, ChevronRight, BarChart } from "lucide-react";
import ScouterTab from "./scouter/ScoutingTab";
import MatchList from "./scouter/MatchList";
import ScanningTab from "./scouter/scanner/ScanningTab";
import GeneralTab from "./strategy/GeneralTab";
import TeamTab from "./strategy/TeamTab";

function getHiddenImage(path: string) {
  return (
    <div className="hidden" style={{ backgroundImage: `url(${path})` }} />
  );
}

const NavLink = ({ to, children, icon: Icon }: { to: string; children: React.ReactNode; icon: React.ComponentType<any> }) => (
  <Link 
    to={to} 
    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-md transition-all dark:text-dark-text dark:hover:bg-dark-card dark:hover:text-primary-400"
  >
    <Icon className="w-5 h-5" />
    <span>{children}</span>
    <ChevronRight className="w-4 h-4 ml-auto" />
  </Link>
);

export function renderScouterNavBar() {
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto bg-white shadow-md rounded-lg p-4 m-4 dark:bg-dark-card dark:border dark:border-dark-border"
    >
      {getHiddenImage("./src/assets/Crescendo Map.png")}
      {getHiddenImage("./src/assets/Blue Auto Map.png")}
      {getHiddenImage("./src/assets/Red Auto Map.png")}
      <div className="space-y-2">
        <NavLink to="/" icon={ClipboardList}>Match List</NavLink>
        <NavLink to="/ScouterTab" icon={Users}>Scout Game</NavLink>
        <NavLink to="/ScannerTab" icon={Scan}>Scan Match</NavLink>
      </div>
    </motion.nav>
  );
}

export function renderStrategyNavBar() {
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto bg-white shadow-md rounded-lg p-4 m-4 dark:bg-dark-card dark:border dark:border-dark-border"
    >
      <div className="space-y-2">
        <NavLink to="/TeamTab" icon={BarChart}>Team Data</NavLink>
        <NavLink to="/GeneralTab" icon={BarChart}>General</NavLink>
      </div>
    </motion.nav>
  );
}

function App() {
  useEffect(() => {
    // Enable dark mode by default
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl mx-auto px-4">
          <Routes>
            <Route path="/" element={<MatchList />} />
            <Route path="/ScouterTab" element={<ScouterTab />} />
            <Route path="/ScannerTab" element={<ScanningTab />} />
            <Route path="/TeamTab" element={<TeamTab />} />
            <Route path="/GeneralTab" element={<GeneralTab />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
