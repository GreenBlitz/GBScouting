import { useEffect, useState } from "react";
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
  "Team Number": number;
  Points: number;
  L1: number;
  L2: number;
  L3: number;
  L4: number;
  Net: number;
  Processor: number;
  Auto: number;
}

function processTeamData(teamNumber: string, data: TeamData): GridItems {
  return {
    "Team Number": parseInt(teamNumber),
    Points: data.getAverageScore() || 0,
    L4: data.getAverage(matchFieldNames.teleopReefLevels, ["L4", "score"]),
    L3: data.getAverage(matchFieldNames.teleopReefLevels, ["L3", "score"]),
    L2: data.getAverage(matchFieldNames.teleopReefLevels, ["L2", "score"]),
    L1: data.getAverage(matchFieldNames.teleopReefLevels, ["L1", "score"]),
    Net: data.getAverageReefPickData(matchFieldNames.teleReefPick, "netScore"),
    Processor: data.getAverageReefPickData(
      matchFieldNames.teleReefPick,
      "processor"
    ),
    Auto: data.getAverageAutoScore(),
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
  const numberedValue =
    typeof params.value === "number" ? (params.value as number) : 0;
  if (params.field === "Points") {
    return `bg-red-${getStrength([20, 40, 60, 80], numberedValue)}`;
  }

  if (params.field === "L4") {
    return `bg-purple-${getStrength([1, 3, 5, 7, 9], numberedValue)}`;
  }

  if (params.field === "L3") {
    return `bg-blue-${getStrength([1, 3, 5, 7, 9], numberedValue)}`;
  }

  if (params.field === "L2") {
    return `bg-red-${getStrength([1, 3, 5, 7, 9], numberedValue)}`;
  }

  if (params.field === "L1") {
    return `bg-yellow-${getStrength([1, 3, 5, 7, 9], numberedValue)}`;
  }

  if (params.field === "Net") {
    return `bg-green-${getStrength([1, 2, 3, 4, 5], numberedValue)}`;
  }

  if (params.field === "Processor") {
    return `bg-red-${getStrength([1, 2, 3, 4, 5], numberedValue)}`;
  }

  if (params.field === "Auto") {
    return `bg-blue-${getStrength([1, 5, 10, 15, 20], numberedValue)}`;
  }

  return "";
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

  return (
    <>
      {renderStrategyNavBar()}
      <div className="section">
        <h2>Table</h2>
        <TableChart
          tableData={teamTable}
          idName={"Team Number"}
          height={540}
          widthOfItem={130}
          getCellClassName={getCellClassName}
        />
      </div>
    </>
  );
};
export default GeneralTab;
