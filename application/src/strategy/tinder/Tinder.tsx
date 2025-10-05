import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { GridItems, processTeamData } from "../general-tab/GeneralTab";
import { useRecent, mergeSimilarMatches } from "../../components/TeamPicker";
import { TeamData } from "../../TeamData";
import { fetchData, fetchNotes, fetchTeams } from "../../utils/Fetches";
import { FRCTeamList } from "../../utils/Utils";
import TeamCard from "./TeamCard";
import { QualNotes, TeamNotes } from "../../utils/SeasonUI";
import { InitialRanker } from "./InitialRanker";

export interface TeamInfo {
  stats: GridItems;
  data: TeamData;
  notes: TeamNotes;
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
  notes: {},
};

const extractTeamNotes = (team: string, qualNotes: QualNotes) =>
  Object.entries(qualNotes).reduce((acc, [key, note]) => {
    const teamMatch = key.includes(`frc${team} `);
    const qual = parseInt(key.match(/qual(\d+)/)?.[1] || "0");
    if (teamMatch) {
      acc[qual] = note;
    }
    return acc;
  }, {} as TeamNotes);

const defaultSort = (team1: TeamInfo, team2: TeamInfo): number => {
  return team2.stats.Points - team1.stats.Points;
}; // sorts from best to worst points

const getHighestCoral = (
  team1: TeamData | undefined,
  team2: TeamData | undefined
) => {
  return Math.max(
    team1 ? team1.getHighestObjects() : 0,
    team2 ? team2.getHighestObjects() : 0
  );
};

const Tinder: React.FC = () => {
  const getTeamsStorage = (): number[] =>
    JSON.parse(localStorage.getItem(tinderStorageKey) || "[]");

  const [ranking, setRanking] = useState<TeamInfo[]>([]);
  const [recency, setRecency] = useState<number>(5);
  const [currentID, setID] = useState(0);
  const [showRanking, setShowing] = useState(false);
  const [name, setName] = useState("");
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    Promise.all([
      fetchTeams(Object.keys(FRCTeamList).map((key) => parseInt(key))),
      fetchNotes(),
    ])
      .then(([teams, notes]) =>
        Object.entries(teams).map(([team, matches]) => {
          const teamData = new TeamData(
            useRecent(mergeSimilarMatches(matches), recency)
          );
          return {
            stats: processTeamData(parseInt(team), teamData),
            data: teamData,
            notes: extractTeamNotes(team, notes),
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

  useEffect(() => {
    updateStorage(ranking);
  }, [ranking]);

  const choose = (index: number) => {
    if (index !== currentID) {
      const temp = ranking[currentID];
      ranking[currentID] = ranking[currentID + 1];
      ranking[currentID + 1] = temp;
      setRanking(ranking);
    }
    if (currentID + 2 >= ranking.length) {
      setID(0);
    }
    setID((prevID) => prevID + 1);
  };

  useEffect(() => {
    const primary = itemRefs.current[currentID];
    const secondary = itemRefs.current[currentID + 1];
    if (primary) {
      primary.scrollIntoView({ block: "center" });
    } else if (secondary) {
      secondary.scrollIntoView({ block: "center" });
    }
  }, [currentID, ranking.length]);

  const maxObjects = useMemo(
    () =>
      getHighestCoral(ranking[currentID]?.data, ranking[currentID + 1]?.data),
    [currentID, ranking]
  );

  const [showInitialRanker, setShowInitialRanker] = useState(false);

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
                max={maxObjects}
              />
            </div>
            <div className="flex-1 min-w-0">
              <TeamCard
                teamInfo={ranking[currentID + 1] || defaultTeam}
                onSwipe={() => choose(currentID + 1)}
                max={maxObjects}
              />
            </div>
          </>
        )}
      </div>
      <button className="p-4" onClick={() => setShowing((prev) => !prev)}>
        Show
      </button>
      <button className="p-4" onClick={() => setShowInitialRanker(true)}>
        Open Initial Ranker
      </button>
      {showInitialRanker && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowInitialRanker(false)}
            >
              ✕
            </button>
            <InitialRanker ranking={ranking} setRanking={setRanking} />
          </div>
        </div>
      )}
      <button className="p-4" onClick={() => setID(0)}>
        Go To Start
      </button>
      <div>
        <input
          type="text"
          onChange={(event) => setName(event.currentTarget.value)}
        ></input>
        <button
          className="p-4"
          onClick={() =>
            fetchData(
              `Tinder/${name}`,
              "POST",
              JSON.stringify(ranking.map((team) => team.stats.Team))
            ).then((response: any) => alert(JSON.stringify(response)))
          }
        >
          Save
        </button>
      </div>
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
