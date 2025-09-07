import { GridItems } from "../general-tab/GeneralTab";
import { FRCTeamList } from "../../utils/Utils";
import LineChart from "../charts/LineChart";
import { TeamInfo } from "./Tinder";
import { reefColorsScore } from "../team-tab/sections/StrategyTeleoperated";
import { matchFieldNames } from "../../utils/Match";
import { Levels } from "../../scouter/input-types/reef-levels/ReefPickInput";

interface TeamCardProps {
  teamInfo: TeamInfo;
  onSwipe: () => void;
  max?: number;
}

const roundToDecimals = (x: number, decimals: number = 0) => {
  const powered = Math.pow(10, decimals);
  return Math.round(x * powered) / powered;
};

const TeamCard: React.FC<TeamCardProps> = ({
  teamInfo: { stats, data },
  onSwipe,
  max,
}) => {
  return (
    <div className="mx-auto p-5 mt-10 rounded-xl bg-green-800 w-96">
      <h1 className="font-bold text-3xl">
        {(FRCTeamList[stats.Team] || "").slice(0, 13)}
      </h1>
      <h2 className="font-semibold text-2xl">{stats.Team}</h2>
      <h3 className="text-xl">
        Average Points: {roundToDecimals(stats.Points, 2)}
      </h3>
      <h3 className="text-lg">
        Average Corals: {roundToDecimals(stats.Corals, 2)}
      </h3>
      <h3 className="text-lg">
        Average Algea: {roundToDecimals(stats.Net + stats.Processor, 2)}
      </h3>
      <div className="bg-green-900 mx-auto">
        <LineChart
          max={max}
          dataSets={{
            ...Object.fromEntries(
              Object.entries(reefColorsScore).map(([key, value]) => [
                key,
                {
                  color: value,
                  data: data.getCoralLevelAsLine(key as keyof Levels),
                },
              ])
            ),
            Net: {
              color: "#172db8",
              data: data.getTotalAlgeaDataAsLine("netScore"),
            },
            Processor: {
              color: "#8fb4ff",
              data: data.getTotalAlgeaDataAsLine("processor"),
            },
          }}
        />
      </div>
      <button className="p-4 bg-green-950" onClick={onSwipe}>
        Choose
      </button>
    </div>
  );
};

export default TeamCard;
