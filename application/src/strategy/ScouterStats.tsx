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
      if (!data[match.qual]) {
        data[match.qual] = 0;
      }
      data[match.qual]++;
    });
    function getDataSetByPredicate(
      predicate: (value: number) => boolean
    ): Record<string, number> {
      return Object.entries(data)
        .filter(([key, value]) => predicate(value))
        .map(([key, value]) => {
          return { [key + ""]: value };
        })
        .reduce((acc, curr) => ({ ...acc, ...curr }), {});
    }

    const goodDataset: DataSet = {
      data: getDataSetByPredicate((value) => value >= 6),
      color: "green",
    };
    const okDataset: DataSet = {
      data: getDataSetByPredicate((value) => value >= 3 && value < 6),
      color: "yellow",
    };
    const badDataset: DataSet = {
      data: getDataSetByPredicate((value) => value < 3),
      color: "red",
    };
    return { Good: goodDataset, Ok: okDataset, Bad: badDataset };
  }, [stats]);

  return (
    <>
      {renderStrategyNavBar()}
      <h2>Scouter Scouting</h2>
      <PieChart pieData={pieData} />
      <h2>Quals Followed</h2>
      <BarChart dataSets={barData} />
    </>
  );
};

export default ScouterStats;
