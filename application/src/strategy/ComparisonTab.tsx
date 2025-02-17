import React, { useEffect, useMemo, useState } from "react";
import TeamPicker from "../components/TeamPicker";
import { TeamData } from "../TeamData";
import { renderStrategyNavBar } from "../App";
import BoxChart from "./charts/BoxChart";
import { Match } from "../utils/Match";
import { rangeArr } from "../utils/Utils";

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
      match.teleopReefLevels.L1.score + match.autoReefLevels.L1.score,
  },
  {
    name: "L2",
    getData: (match) =>
      match.teleopReefLevels.L2.score + match.autoReefLevels.L2.score,
  },
  {
    name: "L3",
    getData: (match) =>
      match.teleopReefLevels.L3.score + match.autoReefLevels.L3.score,
  },
  {
    name: "L4",
    getData: (match) =>
      match.teleopReefLevels.L4.score + match.autoReefLevels.L4.score,
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
  const [teamNumber, setTeamNumber] = useState<number>(3);

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
    <div className="flex flex-col items-center">
      {renderStrategyNavBar()}
      <br />

      {rangeArr(0, teamNumber).map((index) => (
        <div className="rower my-5">
          <TeamPicker
            setTeamData={(team) => {
              const newTeams = [...(teams || [])];
              newTeams[index] = team;
              setTeams(newTeams);
            }}
            defaultRecency={0}
          />
          <button
            onClick={() => {
              const newTeams = [...(teams || [])];
              newTeams.splice(index, 1);
              setTeamNumber(teamNumber - 1);
              setTeams(newTeams);
            }}
            className="ml-5 bg-red-700 w-10 h-10 text-2xl "
          >
            -
          </button>
        </div>
      ))}

      <button
        onClick={() => {
          setTeamNumber(teamNumber + 1);
        }}
        className="ml-5 bg-green-700 w-10 h-10 text-2xl "
      >
        +
      </button>
      <select
        className="my-5"
        onChange={(event) => setField(event.currentTarget.value as keyof Match)}
      >
        {fieldOptions.map((option) => (
          <option>{option.name}</option>
        ))}
      </select>
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
  );
};

export default ComparisonTab;
