import React, { useEffect, useState } from "react";
import { FRCTeamList, getMatchesByCriteria, Match } from "../../Utils";
import LineChart from "../charts/LineChart";
import { TeamData } from "../../TeamData";
import { Checkbox, FormLabel } from "@mui/material";

export enum independentVariable {
  speakerMissed = "Speaker Miss",
  ampMissed = "Amp Miss",
}

const TestComparison: React.FC = () => {
  const [graphElement, setGraphElement] = useState<React.ReactNode>(null);

  useEffect(() => {
    const fetchData = async () => {
      const matches1 = await getMatchesByCriteria("Team Number", "1577");
      const teamData1 = new TeamData(matches1);
      const chartData1 = teamData1.getAsLine(independentVariable.ampMissed);

      const matches2 = await getMatchesByCriteria("Team Number", "1580");
      const teamData2 = new TeamData(matches2);
      const chartData2 = teamData2.getAsLine(independentVariable.ampMissed);


      setGraphElement(
        <><LineChart
              height={400}
              width={400}
              dataSets={{
                  Speaker1: ["blue", chartData1],
              }} /><LineChart
                  height={400}
                  width={400}
                  dataSets={{
                      Speaker1: ["red", chartData2],
                  }} /></>
      );
    };

    fetchData();
  }, []);

  return (
    <>
      {graphElement}
    </>
  );
};

export default TestComparison;
