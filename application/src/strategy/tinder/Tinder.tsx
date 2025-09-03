import { forwardRef, useEffect, useRef, useState } from "react";
import { GridItems, processTeamData } from "../general-tab/GeneralTab";
import { useRecent, mergeSimilarMatches } from "../../components/TeamPicker";
import { TeamData } from "../../TeamData";
import { fetchTeams } from "../../utils/Fetches";
import { FRCTeamList } from "../../utils/Utils";
import TeamCard from "./TeamCard";

export interface TeamInfo {
  stats: GridItems;
  data: TeamData;
}

const tinderStorageKey = "tinder";

const defaultTeam: TeamInfo = {
  stats: {
    Team: 0,
    Points: 0,
    Corals: 0,
    Objects: 0,
    Net: 0,
    Processor: 0,
    Auto: 0,
    L1: 0,
    L2: 0,
    L3: 0,
    L4: 0,
    Defense: 0,
    Evasion: 0,
    Climb: 0,
    "Middle Auto": 0,
  },
  data: new TeamData([]),
};

const defaultSort = (team1: TeamInfo, team2: TeamInfo): number => {
  return team2.stats.Points - team1.stats.Points;
}; // sorts from best to worst points

const Tinder: React.FC = () => {
  const getTeamsStorage = (): number[] =>
    JSON.parse(localStorage.getItem(tinderStorageKey) || "[]");

  const [ranking, setRanking] = useState<TeamInfo[]>([]);
  const [recency, setRecency] = useState<number>(5);
  const [currentID, setID] = useState(0);
  const [showRanking, setShowing] = useState(false);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    fetchTeams(Object.keys(FRCTeamList).map((key) => parseInt(key)))
      .then((teams) =>
        Object.entries(teams).map(([team, matches]) => {
          const teamData = new TeamData(
            useRecent(mergeSimilarMatches(matches), recency)
          );
          return {
            stats: processTeamData(parseInt(team), teamData),
            data: teamData,
          };
        })
      )
      .then((data) => {
        const storedOrder = getTeamsStorage();
        if (storedOrder.length > 0) {
          return storedOrder.map(
            (teamNumber) =>
              data.find((item) => item.stats.Team === teamNumber) || defaultTeam
          );
        }
        return data.sort(defaultSort);
      })
      .then(setRanking);
  }, [recency]);

  const updateStorage = (newRanking: TeamInfo[]) =>
    localStorage.setItem(
      tinderStorageKey,
      JSON.stringify(newRanking.map((rank) => rank.stats.Team))
    );

  const choose = (index: number) => {
    if (index !== currentID) {
      const temp = ranking[currentID];
      ranking[currentID] = ranking[currentID + 1];
      ranking[currentID + 1] = temp;
      updateStorage(ranking);
      setRanking(ranking);
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
        {showRanking ? (
          <div className="w-full md:w-80 mt-5 mx-auto">
            <div className="bg-green-700 rounded-lg shadow-md p-4 w-full max-h-72 overflow-y-auto">
              <div className="space-y-2">
                {ranking.map((item, index) => (
                  <TeamListItem
                    key={item.stats.Team}
                    ref={(el) => (itemRefs.current[index] = el)}
                    team={item.stats.Team}
                    index={index}
                    isHighlited={index === currentID || index === currentID + 1}
                    goToItem={() => setID(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 min-w-0">
              <TeamCard
                teamInfo={ranking[currentID] || defaultTeam}
                onSwipe={() => choose(currentID)}
              />
            </div>
            <div className="flex-1 min-w-0">
              <TeamCard
                teamInfo={ranking[currentID + 1] || defaultTeam}
                onSwipe={() => choose(currentID + 1)}
              />
            </div>
          </>
        )}
      </div>
      <button className="p-4" onClick={() => setShowing((prev) => !prev)}>
        Show
      </button>
      <button className="p-4" onClick={() => setID(0)}>
        Go To Start
      </button>
    </div>
  );
};

interface TeamListItemProps {
  team: number;
  index: number;
  isHighlited: boolean;
  goToItem: () => void;
}
const TeamListItem = forwardRef<HTMLDivElement, TeamListItemProps>(
  ({ team, index, isHighlited, goToItem }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex items-center justify-between p-2 rounded-md transition-colors ${
          isHighlited
            ? "bg-blue-400 border-l-4 border-blue-500"
            : "hover:bg-gray-50"
        }`}
        onClick={goToItem}
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
