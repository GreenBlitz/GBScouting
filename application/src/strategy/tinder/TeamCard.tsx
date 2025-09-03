import { GridItems } from "../general-tab/GeneralTab";
import { FRCTeamList } from "../../utils/Utils";
import LineChart from "../charts/LineChart";

interface TeamCardProps {
  stats: GridItems;
  onSwipe: () => void;
}

const roundToDecimals = (x: number, decimals: number = 0) => {
  const powered = Math.pow(10, decimals);
  return Math.round(x * powered) / powered;
};

const TeamCard: React.FC<TeamCardProps> = ({ stats, onSwipe }) => {
  return (
    <div className="mx-auto p-5 m-10 rounded-xl bg-green-800">
      <h1 className="font-bold text-3xl">{FRCTeamList[stats.Team]}</h1>
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
      {/* <div className="bg-green-900">
        <LineChart
          dataSets={{
            Points: {
              color: "cyan",
              data: {},
            },
          }}
        />
      </div> */}
      <button className="p-4 bg-green-950" onClick={onSwipe}>
        Choose
      </button>
    </div>
  );
};

export default TeamCard;
