import React, { useEffect, useState } from "react";
import { StorageBackedInput } from "../utils/FolderStorage";

interface ReefFormProps {
  storageName: string
}

interface Level {
  S: number;
  F: number;
}
interface Levels{
  level1: Level;
  level2: Level;
  level3: Level;
  level4: Level;
}

const ReefScoring: React.FC<ReefFormProps> = ({storageName}) => {
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [levels, setLevels] = useState<Levels>({
    level1: { S: 0, F: 0 },
    level2: { S: 0, F: 0 },
    level3: { S: 0, F: 0 },
    level4: { S: 0, F: 0 },
  });

  const storage = new StorageBackedInput<Levels>(storageName);
  useEffect(() => {storage.set(levels)}, [levels]);
 

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
  

  const styles = {
    buttonS: {
      backgroundColor: "lightgreen",
      color: "black",
      border: "1px solid green",
      padding: "10px 15px", // Standard padding
      margin: "5px",
      cursor: "pointer",
      minWidth: "70px", // Ensures the button can fit a double-digit number
      height: "50px", // Ensures consistent button height
      fontSize: "18px", // Adjust text size to ensure readability
     
    },
    buttonF: {
      backgroundColor: "lightcoral",
      color: "black",
      border: "1px solid red",
      padding: "10px 15px", // Standard padding
      margin: "5px",
      cursor: "pointer",
      minWidth: "70px", // Ensures the button can fit a double-digit number
      height: "50px", // Ensures consistent button height
      fontSize: "18px", // Adjust text size to ensure readability
     
    },
    buttonDisabled: {
      opacity: 0.5,
      cursor: "not-allowed",
    },
    container: {
      
      justifyContent: "center", // Centers horizontally
      alignItems: "center", // Centers vertically
      height: "100vh", // Makes the container take the full viewport height
      margin: 0, // Removes any default margins
      marginTop: "20px", // Adds a bit of space at the top
      
     
    }
  };

  return (
    <div style={styles.container}> 
     
      
      <button onClick={handleUndo} disabled={undoStack.length === 0}>
        Undo
      </button>
      <br/>
      <br/>
      <br/>
      <table  style={{ alignContent: "center" }}>
        <tbody>
          <tr>
            <td>Level 4</td>
            <td>
              <button style={styles.buttonS} onClick={(e) => handleClick(e, 4, "S")}>{levels.level4.S}</button>
            </td>
            <td>
              <button style={styles.buttonF} onClick={(e) => handleClick(e, 4, "F")}>{levels.level4.F}</button>
            </td>
          </tr>
          <tr>
            <td>Level 3</td>
            <td>
              <button style={styles.buttonS} onClick={(e) => handleClick(e, 3, "S")}>{levels.level3.S}</button>
            </td>
            <td>
              <button style={styles.buttonF} onClick={(e) => handleClick(e, 3, "F")}>{levels.level3.F}</button>
            </td>
          </tr>
          <tr>
            <td>Level 2</td>
            <td>
              <button style={styles.buttonS} onClick={(e) => handleClick(e, 2, "S")}>{levels.level2.S}</button>
            </td>
            <td>
              <button style={styles.buttonF}onClick={(e) => handleClick(e, 2, "F")}>{levels.level2.F}</button>
            </td>
          </tr> 
          <tr>
            <td>Level 1</td>
            <td>
              <button style={styles.buttonS} onClick={(e) => handleClick(e, 1, "S")}>{levels.level1.S}</button>
            </td>
            <td>
              <button style={styles.buttonF} onClick={(e) => handleClick(e, 1, "F")}>{levels.level1.F}</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ReefScoring;
