import React, { useEffect, useMemo, useState } from "react";
import { Match } from "../utils/Match";
import PieChart from "./charts/PieChart";
import BarChart from "./charts/BarChart";
import { fetchMatchesByCriteria } from "../utils/Fetches";
import { Color, randomColor } from "../utils/Color";
import { renderStrategyNavBar } from "../App";
import { DataSet } from "../utils/Utils";

const ScouterStats: React.FC = () => {
  const [stats, setStats] = useState<Match[]>([]);

  useEffect(() => {
    async function updateStats() {
      setStats((await fetchMatchesByCriteria()) as Match[]);
    }
    updateStats();
  }, []);

  const pieData = useMemo(() => {
    const data: Record<string, { color: Color; percentage: number }> = {};
    stats.forEach((match) => {
      if (!data[match.scouterName]) {
        data[match.scouterName] = { color: randomColor(), percentage: 0 };
      }
      data[match.scouterName].percentage++;
    });
    return data;
  }, [stats]);

  const barData = useMemo(() => {
    const data: Record<number, number> = {};
    stats.forEach((match) => {
      if (!data[match.scouterName]) {
        data[match.qual] = 0;
      }
      data[match.scouterName]++;
    });
    const goodDataset: DataSet = {
      data: Object.assign(
        {},
        Object.entries(data)
          .filter(([key, value]) => {
            return value >= 6;
          })
          .map(([key, value]) => {
            return { [key]: value } as Record<string, number>;
          })
      ),
      color: "green",
    };
    return data;
  }, [stats]);

  return (
    <>
      {renderStrategyNavBar()}
      <PieChart pieData={pieData} />
      <BarChart barData={barData} />
    </>
  );
};

export default ScouterStats;
