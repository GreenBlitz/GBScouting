import React, { useEffect, useMemo, useState } from "react";
import { TeamData } from "../TeamData";
import BoxChart from "./charts/BoxChart";
import { Match } from "../utils/Match";
import { fetchAllTeamMatches } from "../utils/Fetches";
import { useRecent } from "../components/TeamPicker";

interface FieldOption {
  name: string;
  getData: (match: Match) => number | undefined;
}

const fieldOptions: FieldOption[] = [
  {
    name: "Score",
    getData: TeamData.matchScore,
  },
  {
    name: "Objects",
    getData: TeamData.matchObjects,
  },
  {
    name: "L1",
    getData: (match) =>
      match.teleReefPick.levels.L1.score + match.autoReefPick.levels.L1.score,
  },
  {
    name: "L2",
    getData: (match) =>
      match.teleReefPick.levels.L2.score + match.autoReefPick.levels.L2.score,
  },
  {
    name: "L3",
    getData: (match) =>
      match.teleReefPick.levels.L3.score + match.autoReefPick.levels.L3.score,
  },
  {
    name: "L4",
    getData: (match) =>
      match.teleReefPick.levels.L4.score + match.autoReefPick.levels.L4.score,
  },
  {
    name: "Net",
    getData: (match) =>
      match.teleReefPick.algea.netScore + match.autoReefPick.algea.netScore,
  },

  {
    name: "Processor",
    getData: (match) =>
      match.teleReefPick.algea.processor + match.autoReefPick.algea.processor,
  },

  { name: "Team Number", getData: (match) => match.teamNumber },
  { name: "Qual", getData: (match) => match.qual },
];

const ComparisonTab: React.FC = () => {
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [recency, setRecency] = useState<number>(0);

  useEffect(() => {
    async function updateTeams() {
      setTeams(
        Object.values(await fetchAllTeamMatches()).map(
          (teamMatches) => new TeamData(useRecent(teamMatches, recency))
        )
      );
    }
    updateTeams();
  });

  const [field, setField] = useState<string>(fieldOptions[0].name);

  const getBoxData = (team: TeamData | undefined) => {
    if (!team) {
      return {};
    }
    const chosenOption =
      fieldOptions.find((option) => option.name === field) || fieldOptions[0];
    return {
      [team.getTeamNumber() || 0]: team.getAsBox(chosenOption.getData) || [],
    };
  };

  const teamsData = useMemo(() => {
    return teams.map((team) => getBoxData(team)) || [];
  }, [teams, field]);

  return (
    <>
      <div className="flex flex-col items-center">
        <br />

        <select
          className="my-5"
          onChange={(event) => setField(event.currentTarget.value)}
        >
          {fieldOptions.map((option) => (
            <option>{option.name}</option>
          ))}
        </select>
        <label htmlFor="recency">Recency</label>
        <input
          type="number"
          id="recency"
          name="recency"
          onChange={(event) => setRecency(parseInt(event.target.value))}
          min={1}
        />
        <div className="w-96 ">
          <BoxChart
            data={Object.assign({}, ...teamsData)}
            xName={"Team"}
            yName={field}
            title="Comparison"
            subtitle="Between FRC Teams"
          />
        </div>
      </div>
    </>
  );
};

export default ComparisonTab;
