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
  "Average Score": number;
  "Defense Score": number;
}

function processTeamData(data: TeamData): GridItems {
  return {
    "Team Number": data.matches[0].teamNumber,
    "Average Score": data.getAverageScore(),
    "Defense Score": data.getAverage("defense"),
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
  if (params.field === "Average Score") {
    return `bg-red-${getStrength([20, 40, 60, 80], numberedValue)}`;
  }

  if (params.field === "Defense Score") {
    return `bg-blue-${getStrength([1, 2, 3, 4, 5], numberedValue)}`;
  }

  return "";
}
const GeneralTab: React.FC = () => {
  const [teamTable, setTeamTable] = useState<GridItems[]>([]);

  //bruh this is kinda deep
  useEffect(() => {
    async function getGridItems(teamName: string) {
      return processTeamData(
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
