import { useEffect, useMemo, useState } from "react";
import TableChart from "../charts/TableChart";
import { FRCTeamList } from "../../utils/Utils";
import { TeamData } from "../../TeamData";
import React from "react";
import { renderStrategyNavBar } from "../../App";
import { fetchMatchesByCriteria } from "../../utils/Fetches";
import { GridCellParams, GridTreeNode } from "@mui/x-data-grid";
import "./GeneralTable.css";
import { matchFieldNames } from "../../utils/Match";

interface GridItems {
  Team: number;
  Points: number;
  Corals: number;
  Objects: number;
  Net: number;
  Processor: number;
  Auto: number;
  L1: number;
  L2: number;
  L3: number;
  L4: number;
  Defense: number;
  Evasion: number;
}

interface PickArea {
  name: string;
  predicate: (team: GridItems) => number;
}

interface Pick {
  name: string;
  team: GridItems;
}

const pickList: PickArea[] = [
  {
    name: "Best Coral",
    predicate: (team) => team.Corals,
  },
  {
    name: "Best Overall",
    predicate: (team) => team.Objects,
  },
  {
    name: "Best Defense",
    predicate: (team) => team.Defense,
  },

  {
    name: "Best Defensive Evasion",
    predicate: (team) => team.Evasion,
  },
  {
    name: "Best Algea",
    predicate: (team) => team.Net + team.Processor,
  },

  {
    name: "Best Auto",
    predicate: (team) => team.Auto,
  },
];

function processTeamData(teamNumber: string, data: TeamData): GridItems {
  return {
    Team: parseInt(teamNumber),
    Points: data.getAverageScore(),
    Corals: data.getAverageCoralAmount(),
    Objects: data.getAverageObjectAmount(),
    Net: data.getAverageReefPickData(matchFieldNames.teleReefPick, "netScore"),
    Processor: data.getAverageReefPickData(
      matchFieldNames.teleReefPick,
      "processor"
    ),
    Auto: data.getAverageAutoScore(),
    L4: data.getAverage(matchFieldNames.teleopReefLevels, ["L4", "score"]),
    L3: data.getAverage(matchFieldNames.teleopReefLevels, ["L3", "score"]),
    L2: data.getAverage(matchFieldNames.teleopReefLevels, ["L2", "score"]),
    L1: data.getAverage(matchFieldNames.teleopReefLevels, ["L1", "score"]),
    Defense: data.getAverage(matchFieldNames.defense),
    Evasion: data.getAverage(matchFieldNames.defensiveEvasion),
  };
}

function getCellClassName(
  params: GridCellParams<
    GridItems,
    string | number,
    string | number,
    GridTreeNode
  >
) {
  if (params.value == null) {
    return "";
  }

  function getStrength(strengthValues: number[], value: number) {
    const strength = strengthValues.findIndex((strength) => value < strength);
    return (strength === -1 ? strengthValues.length : strength) + 1;
  }
  const numberedValue = typeof params.value === "number" ? params.value : 0;
  const field = params.field as keyof GridItems;

  if (field === "Team") {
    return "";
  }

  const getBGColor = () => {
    if (field === "Points") {
      return `bg-red-${getStrength([20, 40, 60, 80], numberedValue)}`;
    }

    if (field == "Corals") {
      return `bg-purple-${getStrength(
        [1, 5, 7, 9, 11, 13, 15],
        numberedValue
      )}`;
    }

    if (field === "Defense") {
      return `bg-blue-${getStrength([1, 2, 3, 4, 5], numberedValue)}`;
    }

    if (field === "Evasion") {
      return `bg-purple-${getStrength([1, 2, 3, 4, 5], numberedValue)}`;
    }

    if (field === "Objects") {
      return `bg-blue-${getStrength([1, 6, 9, 12, 14, 16, 20], numberedValue)}`;
    }

    if (field === "L4") {
      return `bg-purple-${getStrength([1, 3, 5, 7, 9], numberedValue)}`;
    }

    if (field === "L3") {
      return `bg-yellow-${getStrength([1, 3, 5, 7, 9], numberedValue)}`;
    }

    if (field === "L2") {
      return `bg-red-${getStrength([1, 3, 5, 7, 9], numberedValue)}`;
    }

    if (field === "L1") {
      return `bg-green-${getStrength([1, 3, 5, 7, 9], numberedValue)}`;
    }

    if (field === "Net") {
      return `bg-green-${getStrength([1, 2, 3, 4, 5], numberedValue)}`;
    }

    if (field === "Processor") {
      return `bg-red-${getStrength([1, 2, 3, 4, 5], numberedValue)}`;
    }

    if (field === "Auto") {
      return `bg-blue-${getStrength([1, 5, 10, 15, 20], numberedValue)}`;
    }

    return "";
  };
  return getBGColor();
}

const GeneralTab: React.FC = () => {
  const [teamTable, setTeamTable] = useState<GridItems[]>([]);

  //bruh this is kinda deep
  useEffect(() => {
    async function getGridItems(teamName: string) {
      return processTeamData(
        teamName,
        new TeamData(
          await fetchMatchesByCriteria(
            matchFieldNames.teamNumber,
            teamName.slice(0, teamName.indexOf(`\t`))
          )
        )
      );
    }
    async function updateTeamTable() {
      setTeamTable(await Promise.all(FRCTeamList.map(getGridItems)));
    }
    updateTeamTable();
  }, []);

  const [teamExclusions, setTeamExclusions] = useState<number[]>([]);

  const getBestTeam = (predicate: (team: GridItems) => number) => {
    return teamTable.reduce((bestTeam, currentTeam) => {
      if (teamExclusions.includes(currentTeam.Team)) {
        return bestTeam;
      }
      return predicate(currentTeam) > predicate(bestTeam)
        ? currentTeam
        : bestTeam;
    }, teamTable.find((team) => !teamExclusions.includes(team.Team)) || teamTable[0]);
  };

  const picks: Pick[] = useMemo(() => {
    if (teamTable.length === 0) {
      return [];
    }
    return pickList.map((pick) => {
      return { name: pick.name, team: getBestTeam(pick.predicate) };
    });
  }, [teamExclusions, teamTable]);

  return (
    <>
      {renderStrategyNavBar()}
      <table className="mx-auto">
        <thead>
          <tr>
            {picks.map((pick) => (
              <th key={pick.name} className="border text-xl border-white">
                {pick.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {picks.map((pick) => (
              <td key={pick.name} className="border text-2xl border-white">
                {pick.team.Team}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <div className="section">
        <TableChart
          tableData={teamTable}
          idName={"Team"}
          height={540}
          widthOfItem={130}
          getCellClassName={getCellClassName}
          onRowSelectionChange={(model) => setTeamExclusions(model as number[])}
        />
      </div>
    </>
  );
};
export default GeneralTab;
