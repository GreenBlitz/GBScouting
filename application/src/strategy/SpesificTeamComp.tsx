import React, { useEffect, useMemo, useState } from "react";
import { TeamData } from "../TeamData";
import BoxChart from "./charts/BoxChart";
import { Match } from "../utils/Match";
import { fetchAllTeamMatches, fetchPaticularTeamMatches } from "../utils/Fetches";
import { useRecent } from "../components/TeamPicker";
import { FRCTeamArray } from "../utils/Utils";

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
  {
    name: "Team Number",
    getData: (match) => match.teamNumber,
  },
  {
    name: "Qual",
    getData: (match) => match.qual,
  },
];

const teamNumbers = FRCTeamArray

const SpesificTeamComp: React.FC = () => {
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [recency, setRecency] = useState<number>(0);
  const [checkedList, setCheckedList] = useState<number[]>([]);
  console.log(teamNumbers)

  // ✅ Improved checkbox handler to ensure numbers are stored correctly
  const handleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    const isChecked = event.target.checked;

    setCheckedList((prevList) =>
      isChecked ? [...prevList, value] : prevList.filter((item) => item !== value)
    );
  };

  // ✅ Fetch data when checkedList or recency changes
  useEffect(() => {
    async function updateParticularTeams() {
      if (checkedList.length === 0) {
        setTeams([]); // Reset teams if no teams are selected
        return;
      }

      const fetchedTeams = await fetchPaticularTeamMatches(checkedList);
      const teamObjects = Object.values(fetchedTeams).map(
        (teamMatches) => new TeamData(useRecent(teamMatches, recency))
      );

      setTeams(teamObjects);
    }

    updateParticularTeams();
  }, [checkedList, recency]); // ✅ Now properly updates when checkedList changes

  const [field, setField] = useState<string>(fieldOptions[0].name);

  const getBoxData = (team: TeamData | undefined) => {
    if (!team) return {};
    const chosenOption =
      fieldOptions.find((option) => option.name === field) || fieldOptions[0];
    return {
      [team.getTeamNumber() || 0]: team.getAsBox(chosenOption.getData) || [],
    };
  };

  const teamsData = useMemo(() => teams.map((team) => getBoxData(team)) || [], [teams, field]);

  return (
    <>
      <div className="flex flex-col items-center">
        <br />

        {/* ✅ Added missing key prop for <option> elements */}
        <select className="my-5" onChange={(event) => setField(event.currentTarget.value)}>
          {fieldOptions.map((option) => (
            <option key={option.name}>{option.name}</option>
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

        <div className="w-96">
          <BoxChart
            data={Object.assign({}, ...teamsData)}
            xName={"Team"}
            yName={field}
            title="Comparison"
            subtitle="Between FRC Teams"
          />
        </div>
      </div>
      <div className="teams" style={{display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gridTemplateRows: "repeat(5, 1fr)",}}>
        {teamNumbers.map((item) => (
          <label className="containerComp" key={item.id} style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
            <input
              type="checkbox"
              name="team number"
              id={item.id}
              value={item.value}
              onChange={handleSelect}
              style={{
                width: "1.2em",
                height: "1.2em",
              }}
            />
            <span className="checkmarkComp"></span>
          {item.id}</label>
        ))}
        </div>
    </>
  );
};

export default SpesificTeamComp;
