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

const useRecentNotes = (notes: TeamNotes, recency: number): TeamNotes =>
  Object.fromEntries(
    Object.entries(notes).filter(([qual]) =>
      Object.keys(notes)
        .map(Number)
        .sort((a, b) => b - a)
        .slice(0, recency)
        .includes(Number(qual))
    )
  );

const Tinder: React.FC = () => {
  const getTeamsStorage = (): number[] =>
    JSON.parse(localStorage.getItem(tinderStorageKey) || "[]");

  const [ranking, setRanking] = useState<TeamInfo[]>([]);
  const [recency, setRecency] = useState<number>(5);
  const [currentID, setID] = useState(0);
  const [name, setName] = useState("");
  const [saveNames, setSaveNames] = useState<string[]>([]);
  const [masterRanking, setMasterRanking] = useState<number[]>([]);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const rankingDiff = useMemo(() =>
    ranking.map(
      (value, index) =>
        masterRanking.findIndex((team) => team === value.stats.Team) - index
    )
  , [ranking, masterRanking]);

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
            notes: useRecentNotes(extractTeamNotes(team, notes), recency),
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

  useEffect(() => {
    fetchData("Tinder/master", "GET").then(setMasterRanking);
    fetchData("TinderSaves", "GET").then(setSaveNames);
  }, []);

  const updateStorage = (newRanking: TeamInfo[]) =>
    localStorage.setItem(
      tinderStorageKey,
      JSON.stringify(newRanking.map((rank) => rank.stats.Team))
    );

  useEffect(() => {
    ranking.length > 0 && updateStorage(ranking);
  }, [ranking]);

  const choose = (index: number) => {
    if (index !== currentID) {
      setRanking((prev) => {
        const newRanking = [...prev];
        const temp = newRanking[currentID];
        newRanking[currentID] = newRanking[currentID + 1];
        newRanking[currentID + 1] = temp;
        return newRanking;
      });
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

  const loadSave = (name: string) => {
    fetchData(`Tinder/${name}`, "GET")
      .then((response: number[]) =>
        setRanking((prev) =>
          response.map(
            (teamNumber: number) =>
              prev.find((item) => item.stats.Team === teamNumber) || defaultTeam
          )
        )
      )
      .then(() => alert("loaded!"));
  };

  const maxObjects = useMemo(
    () =>
      getHighestCoral(ranking[currentID]?.data, ranking[currentID + 1]?.data),
    [currentID, ranking]
  );

  const [showInitialRanker, setShowInitialRanker] = useState(false);

  return (
    <div>
      <div className="flex flex-col md:flex-row items-stretch gap-4">
        <>
          <div className="flex-1 min-w-0">
            <TeamCard
              teamInfo={ranking[currentID] || defaultTeam}
              onSwipe={() => choose(currentID)}
              max={maxObjects}
            />
          </div>
          <div className="w-full md:w-80 my-auto mx-auto">
            <div className="bg-green-700 rounded-lg shadow-md p-4 w-full max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {ranking.map((item, index) => (
                  <TeamListItem
                    key={item.stats.Team}
                    ref={(el) => (itemRefs.current[index] = el)}
                    team={item.stats.Team}
                    index={index}
                    isHighlited={index === currentID || index === currentID + 1}
                    goToItem={() => setID(index)}
                    diffOffset={rankingDiff[index]}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <TeamCard
              teamInfo={ranking[currentID + 1] || defaultTeam}
              onSwipe={() => choose(currentID + 1)}
              max={maxObjects}
            />
          </div>
        </>
      </div>
      <div className="flex gap-4 justify-center mt-6">
        <button
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow transition duration-150 ease-in-out"
          onClick={() => setShowInitialRanker(true)}
        >
          Slider Picker
        </button>
        <button
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition duration-150 ease-in-out"
          onClick={() => setID(0)}
        >
          Go To #1
        </button>
      </div>
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

      <div className="flex flex-col md:flex-row items-center gap-4 mt-8 justify-center">
        <input
          type="text"
          placeholder="Enter save name"
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm w-64"
        />
        <button
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow transition duration-150 ease-in-out"
          onClick={() =>
            fetchData(
              `Tinder/${name}`,
              "POST",
              JSON.stringify(ranking.map((team) => team.stats.Team))
            ).then(() => alert("saved!"))
          }
          disabled={!name.trim()}
        >
          Save
        </button>
        <button
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition duration-150 ease-in-out"
          onClick={() => loadSave(name)}
          disabled={!name.trim()}
        >
          Load
        </button>
      </div>
      <div className="flex flex-col items-center mt-6">
        <div className="font-semibold mb-2">Saved Rankings:</div>
        <div className="flex flex-wrap gap-2">
          {saveNames.length === 0 ? (
            <span className="text-gray-500">No saves yet.</span>
          ) : (
            saveNames.map((save) => (
              <button
                key={save}
                className="px-4 py-1 bg-orange-600 hover:bg-orange-700 rounded shadow text-sm"
                onClick={() => loadSave(save)}
              >
                {save}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

interface TeamListItemProps {
  team: number;
  index: number;
  isHighlited: boolean;
  goToItem: () => void;
  diffOffset: number;
}
const TeamListItem = forwardRef<HTMLDivElement, TeamListItemProps>(
  ({ team, index, isHighlited, goToItem, diffOffset }, ref) => {
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
          <span className="text-blue-800 text-red-800 w-0 h-0"></span>
          <span className="font-medium text-gray-900 text-sm md:text-base">
            {FRCTeamList[team] + " " + team}{" "}
            <span
              className={`text-${
                diffOffset > 0 ? "blue" : diffOffset < 0 ? "red" : "black"
              }-800 font-semibold`}
            >
              ({diffOffset > 0 ? "+" + diffOffset : diffOffset})
            </span>
          </span>
        </div>
      </div>
    );
  }
);

export default Tinder;
