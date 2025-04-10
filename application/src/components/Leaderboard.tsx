import { useEffect, useState } from "react";
import React from "react";
import { renderScouterNavBar } from "../App.tsx";

const Leaderboard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<
    { name: string; count: number }[]
  >([]);

  useEffect(() => {
    fetch("/ScouterNames")
      .then((response) => response.json())
      .then(setLeaderboardData)
      .catch(() => setLeaderboardData([]));
  }, []);

  return (
    <>
      {renderScouterNavBar()}
      <div className="flex flex-col items-center h-full p-4">
        <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
        <ul className="w-full max-w-md bg-white shadow-lg rounded-lg p-4">
          {leaderboardData.map((entry, index) => (
            <li
              key={index}
              className="flex justify-between py-2 border-b last:border-b-0"
            >
              <span className="font-semibold text-black">{entry.name}</span>
              <span className="text-black">{entry.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Leaderboard;
