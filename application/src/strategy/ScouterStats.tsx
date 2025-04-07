import React, { useEffect, useMemo, useState } from "react";
import { Match } from "../utils/Match";
import PieChart from "./charts/PieChart";
import BarChart from "./charts/BarChart";
import { fetchMatchesByCriteria } from "../utils/Fetches";
import { Color, randomColor } from "../utils/Color";
import { DataSet } from "../utils/Utils";

function getDataSetByPredicate(
  predicate: (value: number) => boolean,
  data: Record<number, number>
): Record<string, number> {
  return Object.entries(data).reduce((acc, [key, value]) => {
    return { ...acc, [key]: predicate(value) ? value : undefined };
  }, {});
}

const ScouterStats: React.FC = () => {
  const [stats, setStats] = useState<Match[]>([]);

  useEffect(() => {
    async function updateStats() {
      setStats(await fetchMatchesByCriteria());
    }
    updateStats();
  }, []);

  const pieData = useMemo(() => {
    const data: Record<string, { color: Color; percentage: number }> = {};
    stats.forEach(({ scouterName }) => {
      data[scouterName] ??= { color: randomColor(), percentage: 0 };
      data[scouterName].percentage++;
    });

    return data;
  }, [stats]);

  const barData = useMemo(() => {
    const data: Record<number, number> = {};
    stats.forEach(({ qual }) => {
      data[qual] ??= 0;
      data[qual]++;
    });

    const amazingDataset: DataSet = {
      data: getDataSetByPredicate((value) => value >= 12, data),
      color: "cyan",
    };
    const goodDataset: DataSet = {
      data: getDataSetByPredicate((value) => value >= 6 && value < 12, data),
      color: "green",
    };
    const okDataset: DataSet = {
      data: getDataSetByPredicate((value) => value >= 3 && value < 6, data),
      color: "yellow",
    };
    const badDataset: DataSet = {
      data: getDataSetByPredicate((value) => value < 3, data),
      color: "red",
    };

    return {
      Amazing: amazingDataset,
      Good: goodDataset,
      Ok: okDataset,
      Bad: badDataset,
    };
  }, [stats]);

  return (
    <div className="flex flex-col items-center">
      <h2 className="mt-10">Scouter Scouting</h2>
      <PieChart width={500} pieData={pieData} />
      <h2 className="mt-10">Quals Followed</h2>
      <BarChart isStacked={true} dataSets={barData} />
    </div>
  );
};

export default ScouterStats;
