import { useEffect, useState } from "react";
import TableChart from "./charts/TableChart";
import { FRCTeamList } from "../utils/Utils";
import { TeamData } from "../TeamData";
import React from "react";
import { renderStrategyNavBar } from "../App";
import { fetchMatchesByCriteria } from "../utils/Fetches";

interface GeneralTabProps {}

function processTeamData(
  data: TeamData,
  teamNumber: string
): Record<string, string> {
  const table: Record<string, string> = {
    "Team Number": teamNumber,
    Amp: data.getAverage("ampScore").toString(),
    "Amp Miss": data.getAverage("ampMiss").toString(),
    Speaker: data.getAverage("speakerScore").toString(),
    "Speaker Miss": data.getAverage("speakerMiss").toString(),
    "Auto Speaker": data.getAverage("speakerAutoScore").toString(),
    "Auto Speaker Miss": data.getAverage("speakerAutoMiss").toString(),
  };
  return table;
}
const GeneralTab: React.FC<GeneralTabProps> = () => {
  const [teamTable, setTeamTable] = useState<Record<string, string>[]>([]);

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
              ),
              teamNumber
            );
          })
        )
      );
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
        />
      </div>
    </>
  );
};
export default GeneralTab;
