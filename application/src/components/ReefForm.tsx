import React, { useEffect, useState } from "react";
import { StorageBackedInput } from "../utils/FolderStorage";
import ScouterInput from "../scouter/ScouterInput";
import { InputProps } from "../scouter/ScouterInput";

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


class ReefScoring extends ScouterInput <Levels, {}, {levels: Levels, undoStack: string[]}> {
  create(): React.JSX.Element {
    return <ReefScoring {...this.props} />;

  }

  initialValue(): Levels {
    return {
      level1: { S: 0, F: 0 },
      level2: { S: 0, F: 0 },
      level3: { S: 0, F: 0 },
      level4: { S: 0, F: 0 },
    };
  }
  getStartingState(props: InputProps<Levels>): { levels: Levels; undoStack: string[]; } | undefined {
    return { levels:  {level1: { S: 0, F: 0 },
    level2: { S: 0, F: 0 },
    level3: { S: 0, F: 0 },
    level4: { S: 0, F: 0 },}, undoStack: []}
    
  }

  renderInput(): React.ReactNode {
    
  
    //useEffect(() => {this.storage.set(this.state.levels)}, [this.state.levels]);
   
  
    const handleClick = (e: React.FormEvent, level: number, point: string) => {
      e.preventDefault();

      const updated = {...this.state.levels}
      updated[`level${level}`][point]+= 1
    
      this.setState({levels: updated})

      this.setState({undoStack: [...this.state.undoStack, `level${level}-${point}`]})
      this.storage.set(this.state.levels)
  
    };
  
    const handleUndo = () => {

      if (this.state.undoStack.length === 0) return;
      const lastAction = this.state.undoStack[this.state.undoStack.length - 1];
      
      const [levelKey, point] = lastAction.split("-");

      const updated = {...this.state.levels}
      updated[levelKey][point]-= 1

      this.setState({levels: updated})
      this.setState({undoStack: this.state.undoStack.slice(0, -1)})
      this.storage.set(this.state.levels)
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
       
        
        <button onClick={handleUndo} disabled={this.state.undoStack.length === 0}>
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
                <button style={styles.buttonS} onClick={(e) => handleClick(e, 4, "S")}>{this.state.levels.level4.S}</button>
              </td>
              <td>
                <button style={styles.buttonF} onClick={(e) => handleClick(e, 4, "F")}>{this.state.levels.level4.F}</button>
              </td>
            </tr>
            <tr>
              <td>Level 3</td>
              <td>
                <button style={styles.buttonS} onClick={(e) => handleClick(e, 3, "S")}>{this.state.levels.level3.S}</button>
              </td>
              <td>
                <button style={styles.buttonF} onClick={(e) => handleClick(e, 3, "F")}>{this.state.levels.level3.F}</button>
              </td>
            </tr>
            <tr>
              <td>Level 2</td>
              <td>
                <button style={styles.buttonS} onClick={(e) => handleClick(e, 2, "S")}>{this.state.levels.level2.S}</button>
              </td>
              <td>
                <button style={styles.buttonF}onClick={(e) => handleClick(e, 2, "F")}>{this.state.levels.level2.F}</button>
              </td>
            </tr> 
            <tr>
              <td>Level 1</td>
              <td>
                <button style={styles.buttonS} onClick={(e) => handleClick(e, 1, "S")}>{this.state.levels.level1.S}</button>
              </td>
              <td>
                <button style={styles.buttonF} onClick={(e) => handleClick(e, 1, "F")}>{this.state.levels.level1.F}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };
}
export default ReefScoring;
