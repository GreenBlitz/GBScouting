import { useEffect, useState } from "react";
import TableChart from "./charts/TableChart";
import { FRCTeamList } from "../utils/Utils";
import { TeamData } from "../TeamData";
import React from "react";
import { renderStrategyNavBar } from "../App";
import { fetchMatchesByCriteria } from "../utils/Fetches";
import { GridCellParams, GridTreeNode } from "@mui/x-data-grid";

interface GeneralTabProps {}

function processTeamData(data: TeamData): Record<string, number> {
  const table: Record<string, number> = {
    "Team Number": data.matches[0].teamNumber,
  };
  return table;
}
const GeneralTab: React.FC<GeneralTabProps> = () => {
  const [teamTable, setTeamTable] = useState<Record<string, number>[]>([
    { TeamNumber: 1, Sigma: 2 },
  ]);

  //bruh this is kinda deep
  useEffect(() => {
    async function updateTeamTable() {
      setTeamTable(
        await Promise.all(
          FRCTeamList.map(async (team) => {
            const teamNumber = team.slice(0, team.indexOf(`\t`));
            return processTeamData(
              new TeamData(
                await fetchMatchesByCriteria("TeamNumber", teamNumber)
              )
            );
          })
        )
      );
    }
    updateTeamTable();
  }, []);

  const getCellClassName = (
    params: GridCellParams<any, any, number, GridTreeNode>
  ) => {
    return "";
  };

  return (
    <>
      {renderStrategyNavBar()}
      <div className="section">
        <h2>Table</h2>
        <TableChart
          tableData={teamTable}
          idName={"TeamNumber"}
          height={540}
          widthOfItem={130}
          getCellClassName={getCellClassName}
        />
      </div>
    </>
  );
};
export default GeneralTab;
