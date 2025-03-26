import { useEffect, useMemo, useState } from "react";
import TableChart from "../charts/TableChart";
import { FRCTeamList } from "../../utils/Utils";
import { TeamData } from "../../TeamData";
import React from "react";
import { fetchTeams } from "../../utils/Fetches";
import { GridCellParams, GridTreeNode } from "@mui/x-data-grid";
import "../general-tab/GeneralTable.css";
import { mergeSimilarMatches } from "../../components/TeamPicker";
import { useRecent } from "../../components/TeamPicker";

interface AbstractAbilities<T> {
  Team: T;
  Deep: T;
  "Algea Collected": T;
  "Algea Dropped": T;
  "Algea Ground": T;
  "Coral Feeder": T;
  "Coral Ground": T;
  Net: T;
  Processor: T;
}

type Abilities = AbstractAbilities<number>;
type AbilitiesFilter = AbstractAbilities<boolean>;

function processTeamData(teamNumber: number, data: TeamData): Abilities {
  return {
    Team: teamNumber,
    Deep:
      data.getClimbPercentage("Deep Cage").value +
      data.getClimbPercentage("Shallow Cage").value,
    "Algea Collected": data.getCollectionPercentage("algeaReefCollected").value,
    "Algea Dropped": data.getCollectionPercentage("algeaReefDropped").value,
    "Algea Ground": data.getCollectionPercentage("algeaGroundCollected").value,
    "Coral Feeder": data.getCollectionPercentage("coralFeederCollected").value,
    "Coral Ground": data.getCollectionPercentage("coralGroundCollected").value,
    Net: data.getReefPickPercentage(["algea", "netScore"]).value,
    Processor: data.getReefPickPercentage(["algea", "processor"]).value,
    
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
    if (field === "Algea Collected") {
      return `bg-purple-${getStrength(
        [10, 10, 10, 10, 10, 10, 100],
        numberedValue
      )}`;
    }

    if (field === "Coral Ground") {
      return `bg-purple-${getStrength(
        [10, 10, 10, 10, 10, 10, 100],
        numberedValue
      )}`;
    }

    if (field === "Coral Feeder") {
      return `bg-yellow-${getStrength(
        [10, 10, 10, 10, 10, 10, 100],
        numberedValue
      )}`;
    }

    if (field === "Algea Ground") {
      return `bg-red-${getStrength(
        [10, 10, 10, 10, 10, 10, 100],
        numberedValue
      )}`;
    }

    if (field === "Algea Dropped") {
      return `bg-green-${getStrength(
        [10, 10, 10, 10, 10, 10, 100],
        numberedValue
      )}`;
    }

    if (field === "Net") {
      return `bg-green-${getStrength(
        [10, 10, 10, 10, 10, 10, 100],
        numberedValue
      )}`;
    }

    if (field === "Processor") {
      return `bg-red-${getStrength(
        [10, 10, 10, 10, 10, 10, 100],
        numberedValue
      )}`;
    }

    if (field === "Deep") {
      return `bg-green-${getStrength(
        [10, 10, 10, 10, 10, 10, 100],
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
    async function getGridItems() {
      return Object.entries(
        await fetchTeams(Object.keys(FRCTeamList).map((key) => parseInt(key)))
      ).map(([team, matches]) =>
        processTeamData(
          parseInt(team),
          new TeamData(useRecent(mergeSimilarMatches(matches), recency))
        )
      );
    }
    async function updateTeamTable() {
      setTeamTable(await getGridItems());
    }
    updateTeamTable();
  }, [recency]);

  const [filters, setFilters] = useState<AbilitiesFilter>({
    Team: false,
    Deep: false,
    "Algea Collected": false,
    "Algea Dropped": false,
    "Algea Ground": false,
    "Coral Feeder": false,
    "Coral Ground": false,
    Net: false,
    Processor: false,
  });

  const filteredTeamTable = useMemo(() => {
    return teamTable.filter((team) =>
      Object.entries(filters).every(([key, value]) => !value || team[key] > 10)
    );
  }, [teamTable, filters]);

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
      <ul className="rower">
        {Object.keys(teamTable[0] || {})
          .filter((field) => field !== "Team")
          .map((field) => (
            <li className="mx-5 text-xl" key={field}>
              <label>
                {field}
                <input
                  className="w-4 h-4"
                  type="checkbox"
                  onChange={(event) => {
                    setFilters((prevFilters) => ({
                      ...prevFilters,
                      [field]: event.target.checked,
                    }));
                  }}
                />
              </label>
            </li>
          ))}
      </ul>

      <div className="section">
        <TableChart
          tableData={filteredTeamTable}
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
