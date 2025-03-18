import { useEffect, useMemo, useState } from "react";
import TableChart from "../charts/TableChart";
import { FRCTeamList } from "../../utils/Utils";
import { TeamData } from "../../TeamData";
import React from "react";
import { fetchMatchesByCriteria } from "../../utils/Fetches";
import { GridCellParams, GridTreeNode } from "@mui/x-data-grid";
import "../general-tab/GeneralTable.css";
import { matchFieldNames } from "../../utils/Match";
import { mergeSimilarMatches } from "../../components/TeamPicker";
import { useRecent } from "../../components/TeamPicker";

interface Abilities {
  Team: number;
  Deep: number;
  Net: number;
  Processor: number;
  L1: number;
  L2: number;
  L3: number;
  L4: number;
}

function processTeamData(teamNumber: number, data: TeamData): Abilities {
  return {
    Team: teamNumber,
    Deep: data
      .getClimbPercentage("Deep Cage").value
      + data.getClimbPercentage("Shallow Cage").value,
    Net: data.getReefPickPercentage(["algea", "netScore"]).value,
    Processor: data.getReefPickPercentage(["algea", "processor"]).value,
    L4: data.getReefPickPercentage(["levels", "L4", "score"]).value,
    L3: data.getReefPickPercentage(["levels", "L3", "score"]).value,
    L2: data.getReefPickPercentage(["levels", "L2", "score"]).value,
    L1: data.getReefPickPercentage(["levels", "L1", "score"]).value,
  };
}

function getCellClassName(
  params: GridCellParams<
    Abilities,
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
    return (strength === -1 ? strengthValues.length : strength) + 2;
  }
  const numberedValue = typeof params.value === "number" ? params.value : 0;
  const field = params.field as keyof Abilities;

  if (field === "Team") {
    return "";
  }

  const getBGColor = () => {
    if (field === "L4") {
      return `bg-purple-${getStrength(
        [10, 30, 50, 70, 90],
        numberedValue
      )}`;
    }

    if (field === "L3") {
      return `bg-yellow-${getStrength(
        [10, 30, 50, 70, 90],
        numberedValue
      )}`;
    }

    if (field === "L2") {
      return `bg-red-${getStrength([10, 30, 50, 70, 90], numberedValue)}`;
    }

    if (field === "L1") {
      return `bg-green-${getStrength(
        [10, 30, 50, 70, 90],
        numberedValue
      )}`;
    }

    if (field === "Net") {
      return `bg-green-${getStrength(
        [10, 30, 50, 70, 90],
        numberedValue
      )}`;
    }

    if (field === "Processor") {
      return `bg-red-${getStrength([10, 30, 50, 70, 90], numberedValue)}`;
    }

    if (field === "Deep") {
      return `bg-green-${getStrength(
        [10, 30, 50, 70, 90],
        numberedValue
      )}`;
    }

    return "text-white";
  };
  return `text-black  ${getBGColor()}`;
}

const AbilityTab: React.FC = () => {
  const [teamTable, setTeamTable] = useState<Abilities[]>([]);
  const [recency, setRecency] = useState<number>(0);

  //bruh this is kinda deep
  useEffect(() => {
    async function getGridItems(teamNumber: number) {
      return processTeamData(
        teamNumber,
        new TeamData(
          useRecent(
            mergeSimilarMatches(
              await fetchMatchesByCriteria(
                matchFieldNames.teamNumber,
                teamNumber.toString()
              )
            ),
            recency
          )
        )
      );
    }
    async function updateTeamTable() {
      setTeamTable(
        await Promise.all(
          Object.keys(FRCTeamList).map((key) => getGridItems(parseInt(key)))
        )
      );
    }
    updateTeamTable();
  }, [recency]);

  return (
    <>
      <label htmlFor="recency">Recency</label>
      <input
        type="number"
        id="recency"
        name="recency"
        onChange={(event) => setRecency(parseInt(event.target.value))}
        min={1}
      />

      <div className="section">
        <TableChart
          tableData={teamTable}
          idName={"Team"}
          height={540}
          widthOfItem={130}
          getCellClassName={getCellClassName}
        />
      </div>
    </>
  );
};
export default AbilityTab;
