import React, { useEffect, useRef } from "react";
import { Auto } from "../../utils/SeasonUI";
import { Levels } from "../../components/TeleopForm";
import BranchSVG from "../../assets/branch-right.svg";

interface AutoProps {
  auto: Auto;
}

const AutoChart: React.FC<AutoProps> = ({ auto }) => {
  const corals = (
    <div className="flex flex-row">
      <div>
        {Object.keys(auto.corals).map((levelKey) => {
          if (levelKey === "algea") {
            return;
          }
          const level = levelKey as keyof Levels;
          const scoreButton = (
            <button className="buttonS mr-2 items-center flex flex-col justify-center">
              <h2 className="text-3xl font-extrabold">{level}</h2>
              <h3 className="text-4xl">
                {auto.corals[level].score !== 0 && auto.corals[level].score}
              </h3>
            </button>
          );
          const missButton = (
            <button className="buttonF">
              <h3 className="text-4xl">
                {auto.corals[level].miss !== 0 && auto.corals[level].miss}
              </h3>
            </button>
          );

          return (
            <div className="flex" key={level}>
              {scoreButton}
              {missButton}
            </div>
          );
        })}
      </div>
      <img className="mt-6" src={BranchSVG} width={60} alt="Branch Icon" />
    </div>
  );

  const algeaScoring = (
    <div className="flex flex-col items-center ml-20">
      <div className="rower">
        <button className="buttonS mr-2 items-center flex flex-col justify-center">
          <h2 className="text-3xl font-extrabold">Net</h2>
          <h3 className="text-4xl">
            {auto.algeaScoring.netScore !== 0 && auto.algeaScoring.netScore}
          </h3>
        </button>
        <button className="buttonF">
          <h3 className="text-4xl">
            {auto.algeaScoring.netMiss !== 0 && auto.algeaScoring.netMiss}
          </h3>
        </button>
      </div>
      <button className="buttonS mr-2 items-center flex flex-col justify-center">
        <h2 className="text-3xl font-extrabold">Processor</h2>
        <h3 className="text-4xl">
          {auto.algeaScoring.processor !== 0 && auto.algeaScoring.processor}
        </h3>
      </button>
    </div>
  );

  return (
    <div className="rower">
      {corals}
      {algeaScoring}
    </div>
  );
};

export default AutoChart;
