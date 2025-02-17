import React, { useMemo, useState } from "react";
import TeamPicker from "../components/TeamPicker";
import { TeamData } from "../TeamData";
import { renderStrategyNavBar } from "../App";
import BoxChart from "./charts/BoxChart";
import { Match } from "../utils/Match";

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
  const [team1, setTeam1] = useState<TeamData>();
  const [team2, setTeam2] = useState<TeamData>();

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

  const team1Data = useMemo(() => {
    return getBoxData(team1);
  }, [team1, field]);
  const team2Data = useMemo(() => {
    return getBoxData(team2);
  }, [team2, field]);

  return (
    <div className="flex flex-col items-center">
      {renderStrategyNavBar()}
      <br />
      <TeamPicker setTeamData={setTeam1} defaultRecency={5} />
      <br />
      <TeamPicker setTeamData={setTeam2} defaultRecency={5} />
      <br />

      <select
        onChange={(event) => setField(event.currentTarget.value as keyof Match)}
      >
        {fieldOptions.map((option) => (
          <option>{option.name}</option>
        ))}
      </select>
      <div className="w-96 ">
        <BoxChart
          data={Object.assign({}, ...[team1Data, team2Data])}
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
