import React from "react";
import { useLocation } from "react-router-dom";
import { TeamData } from "../../../TeamData";

const exampleData: TeamData = new TeamData([
  {
    scouterName: "",
    qual: 0,
    teamNumber: 0,
    gameSide: "",
    startingPosition: "",
    noShow: false,
    defense: undefined,
    climb: "",
    comment: "",
    autoMap: {
      Sushi1: {
        HasSeeded: false,
        HasHarvested: false,
      },
      Sushi2: {
        HasSeeded: false,
        HasHarvested: false,
      },
      Sushi3: {
        HasSeeded: false,
        HasHarvested: false,
      },
    },
    autoCollect: 0,
    autoReef: {
      L1: { score: 0, miss: 0 },
      L2: { score: 0, miss: 0 },
      L3: { score: 0, miss: 0 },
      L4: { score: 0, miss: 1 },
    },
  },
  {
    scouterName: "",
    qual: 1,
    teamNumber: 0,
    gameSide: "",
    startingPosition: "",
    noShow: false,
    defense: undefined,
    climb: "",
    comment: "",
    autoMap: {
      Sushi1: {
        HasSeeded: false,
        HasHarvested: false,
      },
      Sushi2: {
        HasSeeded: false,
        HasHarvested: false,
      },
      Sushi3: {
        HasSeeded: false,
        HasHarvested: false,
      },
    },
    autoCollect: 0,
    autoReef: {
      L1: { score: 0, miss: 0 },
      L2: { score: 0, miss: 0 },
      L3: { score: 0, miss: 0 },
      L4: { score: 0, miss: 1 },
    },
  },
]);
const StrategyAutonomous: React.FC = () => {
  const location = useLocation();
  const teamData: TeamData | undefined = location.state;
  console.log(exampleData.getAutos());
  return <></>;
};

export default StrategyAutonomous;
