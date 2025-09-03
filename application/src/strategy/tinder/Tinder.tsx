import { forwardRef, useEffect, useRef, useState } from "react";
import { GridItems, processTeamData } from "../general-tab/GeneralTab";
import { useRecent, mergeSimilarMatches } from "../../components/TeamPicker";
import { TeamData } from "../../TeamData";
import { fetchTeams } from "../../utils/Fetches";
import { FRCTeamList } from "../../utils/Utils";
import TeamCard from "./TeamCard";

const defaultSort = (team1: GridItems, team2: GridItems): number => {
  return team2.Points - team1.Points;
}; // sorts from best to worst points

const Tinder: React.FC = () => {
  const [ranking, setRanking] = useState<GridItems[]>([]);
  const [recency, setRecency] = useState<number>(5);
  const [currentID, setID] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    fetchTeams(Object.keys(FRCTeamList).map((key) => parseInt(key)))
      .then((teams) =>
        Object.entries(teams).map(([team, matches]) =>
          processTeamData(
            parseInt(team),
            new TeamData(useRecent(mergeSimilarMatches(matches), recency))
          )
        )
      )
      .then((data) => data.sort(defaultSort))
      .then(setRanking);
  }, [recency]);

  const choose = (index: number) => {
    if (index !== currentID) {
      const temp = ranking[currentID];
      ranking[currentID] = ranking[currentID + 1];
      ranking[currentID + 1] = temp;
    }

    setID((prevID) => prevID + 1);
  };

  console.log(ranking);

  useEffect(() => {
    const primary = itemRefs.current[currentID];
    const secondary = itemRefs.current[currentID + 1];
    if (primary) {
      primary.scrollIntoView({ block: "center" });
    } else if (secondary) {
      secondary.scrollIntoView({ block: "center" });
    }
  }, [currentID, ranking.length]);

  return (
    <div>
      <div className="flex flex-col md:flex-row items-stretch gap-4">
        <div className="flex-1 min-w-0">
          <TeamCard
            stats={ranking[currentID] || {}}
            onSwipe={() => choose(currentID)}
          />
        </div>
        <div className="w-full md:w-80 mt-5">
          <div className="bg-green-700 rounded-lg shadow-md p-4 w-full max-h-72 overflow-y-auto">
            <div className="space-y-2">
              {ranking.map((item, index) => (
                <TeamListItem
                  key={item.Team}
                  ref={(el) => (itemRefs.current[index] = el)}
                  team={item.Team}
                  index={index}
                  isHighlited={index === currentID || index === currentID + 1}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <TeamCard
            stats={ranking[currentID + 1] || {}}
            onSwipe={() => choose(currentID + 1)}
          />
        </div>
      </div>
    </div>
  );
};

interface TeamListItemProps {
  team: number;
  index: number;
  isHighlited: boolean;
}
const TeamListItem = forwardRef<HTMLDivElement, TeamListItemProps>(
  ({ team, index, isHighlited }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex items-center justify-between p-2 rounded-md transition-colors ${
          isHighlited
            ? "bg-blue-400 border-l-4 border-blue-500"
            : "hover:bg-gray-50"
        }`}
      >
        <div className="flex items-center space-x-3">
          <span
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              index < 3
                ? "bg-yellow-500 text-white"
                : index < 10
                ? "bg-gray-500 text-black"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {index + 1}
          </span>
          <span className="font-medium text-gray-900 text-sm md:text-base">
            {FRCTeamList[team] + " " + team}
          </span>
        </div>
      </div>
    );
  }
);

export default Tinder;
