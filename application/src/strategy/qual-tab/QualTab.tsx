import { useEffect, useMemo, useState } from "react";
import { useRecent } from "../../components/TeamPicker";
import { TeamData } from "../../TeamData";
import {
  fetchTeams,
  fetchNotes,
  MatchTeams,
  fetchAllAwaitingMatches,
  fetchClimbs,
} from "../../utils/Fetches";
import { FRCTeamList } from "../../utils/Utils";
import { GridItems, processTeamData } from "../general-tab/GeneralTab";
import { useRecentNotes, extractTeamNotes } from "../tinder/Tinder";
import { DCMPMatches, defaultMatch, TeamNotes } from "../../utils/SeasonUI";
import { Levels } from "../../scouter/input-types/reef-levels/ReefPickInput";
import LineChart from "../charts/LineChart";
import { reefColorsScore } from "../team-tab/sections/StrategyTeleoperated";
import BarChart from "../charts/BarChart";
import { compileNotes } from "../tinder/InitialRanker";

interface TeamInfo {
  stats: GridItems;
  data: TeamData;
  notes: TeamNotes;
}
const getHighestCoral = (
  team1: TeamData | undefined,
  team2: TeamData | undefined
) => {
  return Math.max(
    team1 ? team1.getHighestObjects() : 0,
    team2 ? team2.getHighestObjects() : 0
  );
};
export type Mode = "tele" | "auto" | "misc" | "history";

const QualTab: React.FC = () => {
  const [recency, setRecency] = useState(5);
  const [teamsInfo, setTeamsInfo] = useState<TeamInfo[]>();
  const [currentQual, setQual] = useState(1);
  const [mode, setMode] = useState<Mode>("tele");

  const [allMatches, setAllMatches] = useState<MatchTeams[]>([defaultMatch]);

  const currentTeams = useMemo(
    () => allMatches[currentQual - 1],
    [allMatches, currentQual]
  );
  useEffect(() => {
    fetchAllAwaitingMatches().then((matches) => setAllMatches(matches || []));
  }, []);

  const max = useMemo(
    () =>
      teamsInfo?.reduce(
        (acc, team) => Math.max(team.data.getHighestObjects(), acc),
        1
      ) || 1,
    [teamsInfo]
  );

  useEffect(() => {
    Promise.all([
      fetchTeams(currentTeams.blueAlliance.concat(currentTeams.redAlliance)),
      fetchNotes(),
      fetchClimbs()
    ])
      .then(([teams, notes, climbs]) =>
        Object.entries(teams).map(([team, matches]) => {
          const teamData = new TeamData(useRecent(matches, recency),TeamData.extractClimbs(team,climbs));
          return {
            stats: processTeamData(parseInt(team), teamData),
            data: teamData,
            notes: useRecentNotes(extractTeamNotes(team, notes), recency),
          };
        })
      )
      .then(setTeamsInfo);
  }, [recency, currentQual, allMatches]);

  return (
    <>
      {/* Controls */}

      <div className="flex">
        <div className="h-max-min ml-auto my-20">
          {teamsInfo
            ?.filter((teamInfo) =>
              currentTeams.blueAlliance.some(
                (team) => team === teamInfo.stats.Team
              )
            )
            .map((teamInfo) => (
              <TeamCard
                key={teamInfo.stats.Team}
                mode={mode}
                side="blue"
                teamInfo={teamInfo}
                max={max}
              />
            ))}
        </div>
        <div className="h-max-min mr-auto my-20">
          {teamsInfo
            ?.filter((teamInfo) =>
              currentTeams.redAlliance.some(
                (team) => team === teamInfo.stats.Team
              )
            )
            .map((teamInfo) => (
              <TeamCard
                key={teamInfo.stats.Team}
                mode={mode}
                side="red"
                teamInfo={teamInfo}
                max={max}
              />
            ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 p-4 rounded-lg shadow-sm">
        {/* Qual Select */}
        <div className="flex items-center space-x-2">
          <label className="font-semibold text-white">Qual:</label>
          <select
            value={currentQual}
            onChange={(e) => setQual(parseInt(e.target.value))}
            className="border border-gray-300 rounded-md p-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {Object.keys(allMatches).map((qual) => (
              <option key={parseInt(qual) + 1} value={parseInt(qual) + 1}>
                {parseInt(qual) + 1}
              </option>
            ))}
          </select>
        </div>

        {/* Recency Number Picker */}
        <div className="flex items-center space-x-2">
          <label className="font-semibold text-white">Recency:</label>
          <input
            type="number"
            value={recency}
            min={1}
            max={50}
            onChange={(e) => setRecency(parseInt(e.target.value))}
            className="w-16 border border-gray-300 rounded-md p-1 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Mode Select */}
        <div className="flex items-center space-x-2">
          <label className="font-semibold text-white">Mode:</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as Mode)}
            className="border border-gray-300 rounded-md p-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="tele">Tele</option>
            <option value="auto">Auto</option>
            <option value="misc">Misc</option>
          </select>
        </div>
      </div>
    </>
  );
};

interface TeamCardProps {
  side: "blue" | "red";
  teamInfo: TeamInfo;
  mode: Mode;
  max: number;
}
export const TeamCard: React.FC<TeamCardProps> = ({
  side,
  teamInfo,
  mode,
  max,
}) => {
  const trim = (value: number | string) => value.toString().slice(0, 5);

  const stats = useMemo(
    () =>
      mode === "auto"
        ? teamInfo.data.getAutoStats()
        : teamInfo.data.getTeleopStats(),
    [mode, teamInfo]
  );
  const getBestLevel = (reef: Levels) =>
    Object.entries(reef).reduce(
      (acc, entry) => (entry[1].score > acc[1].score ? entry : acc),
      [
        "L0",
        {
          score: 0,
          miss: 0,
        },
      ]
    );

  const textStyle = "text-l my-2";
  return (
    <div
      className={`bg-${side}-400 m-2 w-${mode === "history" ? "60" : "40"} h-${
        mode === "history" ? "96" : "60"
      } p-2 rounded-xl`}
    >
      <h1 className="font-bold text-xl">
        {teamInfo.stats.Team.toString() +
          " " +
          (FRCTeamList[teamInfo.stats.Team] || "").slice(0, 13)}
      </h1>
      {mode === "auto" && (
        <>
          <h2 className={textStyle}>Coral Avg: {trim(stats.Coral)}</h2>
          <h2 className={textStyle}>
            Best Level: {getBestLevel(teamInfo.data.getAverageAutoCorals())[0]}{" "}
            -{" "}
            {trim(getBestLevel(teamInfo.data.getAverageAutoCorals())[1].score)}
          </h2>
          <h2 className={textStyle}>
            Algea Avg: {trim(teamInfo.data.getAverageAlgeaAuto())}
          </h2>
        </>
      )}
      {mode === "tele" && (
        <>
          <h2 className={textStyle}>Coral Avg: {trim(stats.Coral)}</h2>
          <h2 className={textStyle}>
            Best Level: {getBestLevel(teamInfo.data.getAverageTeleCorals())[0]}{" "}
            -{" "}
            {trim(getBestLevel(teamInfo.data.getAverageTeleCorals())[1].score)}
          </h2>
          <h2 className={textStyle}>Algea Avg: {trim(stats.Algea)}</h2>
          <h2 className={textStyle}>
            Times Defended: {teamInfo.data.getTimesDefended()}
          </h2>
        </>
      )}
      {mode === "misc" && (
        <>
          <h2 className={textStyle}>
            Climb Percent:{" "}
            {trim(teamInfo.data.getClimbPercentage("Deep Cage").value)}
          </h2>
          <h2 className={textStyle}>
            Avg Algea Stolen:{" "}
            {trim(teamInfo.data.getCollectionPercentage("algeaSteal").value)}
          </h2>
          <h2 className={textStyle}>
            Driving Score: {trim(compileNotes(teamInfo.notes).driving.score)}
          </h2>
        </>
      )}
      {mode === "history" && (
        <div className={`bg-${side}-900 mx-auto"`}>
          <LineChart
            max={max}
            height={600}
            width={400}
            dataSets={{
              ...Object.fromEntries(
                Object.entries(reefColorsScore).map(([key, value]) => [
                  key,
                  {
                    color: value,
                    data: teamInfo.data.getCoralLevelAsLine(
                      key as keyof Levels
                    ),
                  },
                ])
              ),
              Net: {
                color: "#172db8",
                data: teamInfo.data.getTotalAlgeaDataAsLine("netScore"),
              },
              Processor: {
                color: "#8fb4ff",
                data: teamInfo.data.getTotalAlgeaDataAsLine("processor"),
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default QualTab;
