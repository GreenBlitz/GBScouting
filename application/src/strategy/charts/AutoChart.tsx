import React from "react";
import { Auto } from "../../utils/SeasonUI";

interface AutoProps {
  auto: Auto;
}

const AutoChart: React.FC<AutoProps> = ({ auto }) => {
  return (
    <div>
      <canvas />
    </div>
  );
};
