import React, { useState } from "react";

const ReefScoring: React.FC = () => {
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [levels, setLevels] = useState({
    lvl1: { S: 0, F: 0 },
    lvl2: { S: 0, F: 0 },
    lvl3: { S: 0, F: 0 },
    lvl4: { S: 0, F: 0 },
  });

  const handleClick = (e: React.FormEvent, level: number, point: string) => {
    e.preventDefault();
    setLevels((prevLevels) => {
      const updatedLevel = { ...prevLevels[`lvl${level}`], [point]: prevLevels[`lvl${level}`][point] + 1 };
      return {
        ...prevLevels,
        [`lvl${level}`]: updatedLevel,
      };
    });
    setUndoStack((prevStack) => [...prevStack, `lvl${level}-${point}`]);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const lastAction = undoStack[undoStack.length - 1];
    const [levelKey, point] = lastAction.split("-");
    setLevels((prevLevels) => {
      const updatedLevel = { ...prevLevels[levelKey] };
      if (updatedLevel[point] > 0) {
        updatedLevel[point] -= 1;
      }
      return {
        ...prevLevels,
        [levelKey]: updatedLevel,
      };
    });
    setUndoStack((prevStack) => prevStack.slice(0, -1));
  };

  return (
    <div>
      <h1>Reef Scoring</h1>
      
      <button onClick={handleUndo} disabled={undoStack.length === 0}>
        Undo
      </button>
      <table>
        <tbody>
          <tr>
            <td>Level 4</td>
            <td>
              <button onClick={(e) => handleClick(e, 4, "S")}>S ({levels.lvl4.S})</button>
            </td>
            <td>
              <button onClick={(e) => handleClick(e, 4, "F")}>F ({levels.lvl4.F})</button>
            </td>
          </tr>
          <tr>
            <td>Level 3</td>
            <td>
              <button onClick={(e) => handleClick(e, 3, "S")}>S ({levels.lvl3.S})</button>
            </td>
            <td>
              <button onClick={(e) => handleClick(e, 3, "F")}>F ({levels.lvl3.F})</button>
            </td>
          </tr>
          <tr>
            <td>Level 2</td>
            <td>
              <button onClick={(e) => handleClick(e, 2, "S")}>S ({levels.lvl2.S})</button>
            </td>
            <td>
              <button onClick={(e) => handleClick(e, 2, "F")}>F ({levels.lvl2.F})</button>
            </td>
          </tr>
          <tr>
            <td>Level 1</td>
            <td>
              <button onClick={(e) => handleClick(e, 1, "S")}>S ({levels.lvl1.S})</button>
            </td>
            <td>
              <button onClick={(e) => handleClick(e, 1, "F")}>F ({levels.lvl1.F})</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ReefScoring;
