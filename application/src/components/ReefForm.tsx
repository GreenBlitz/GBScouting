import React, { useEffect, useState } from "react";
import { StorageBackedInput } from "../utils/FolderStorage";
import ScouterInput from "../scouter/ScouterInput";
import { InputProps } from "../scouter/ScouterInput";
import "./ReefScore.css";
interface Level {
  score: number;
  miss: number;
}
interface Levels{
  L1: Level;
  L2: Level;
  L3: Level;
  L4: Level;
}


class ReefScoring extends ScouterInput <Levels, {}, {levels: Levels, undoStack: string[]}> {
  create(): React.JSX.Element {
    return <ReefScoring {...this.props} />;

  }

  initialValue(): Levels {
    return {
      L1: { score: 0, miss: 0 },
      L2: { score: 0, miss: 0 },
      L3: { score: 0, miss: 0 },
      L4: { score: 0, miss: 0 },
    };
  }
  getStartingState(props: InputProps<Levels>): { levels: Levels; undoStack: string[]; } | undefined {
    return { levels:  {L1: { score: 0, miss: 0 },
    L2: { score: 0, miss: 0 },
    L3: { score: 0, miss: 0 },
    L4: { score: 0, miss: 0 },}, undoStack: []}
    
  }

  renderInput(): React.ReactNode {
    
  
 
   
  
    const handleClick = (level: number, point: string) => {
    

      const updated = {...this.state.levels}
      updated[`L${level}`][point]+= 1
    
      this.setState({levels: updated})

      this.setState({undoStack: [...this.state.undoStack, `L${level}-${point}`]})
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
    
  
    
  
    return (
      <div>
        <button onClick={handleUndo} disabled={this.state.undoStack.length === 0}>
          Undo
        </button>
        <br />
        <br />
        <br />
        <table>
          <tbody>
            <tr>
              <td>Level 4</td>
              <td>
                <button className="buttonS" onClick={(e) => handleClick(4, "score")}>
                  {this.state.levels.L4.score}
                </button>
              </td>
              <td>
                <button className="buttonF" onClick={(e) => handleClick(4, "miss")}>
                  {this.state.levels.L4.miss}
                </button>
              </td>
            </tr>
            <tr>
              <td>Level 3</td>
              <td>
                <button className="buttonS" onClick={(e) => handleClick(3, "score")}>
                  {this.state.levels.L3.score}
                </button>
              </td>
              <td>
                <button className="buttonF" onClick={(e) => handleClick(3, "miss")}>
                  {this.state.levels.L3.miss}
                </button>
              </td>
            </tr>
            <tr>
              <td>Level 2</td>
              <td>
                <button className="buttonS" onClick={(e) => handleClick(2, "score")}>
                  {this.state.levels.L2.score}
                </button>
              </td>
              <td>
                <button className="buttonF" onClick={(e) => handleClick(2, "miss")}>
                  {this.state.levels.L2.miss}
                </button>
              </td>
            </tr>
            <tr>
              <td>Level 1</td>
              <td>
                <button className="buttonS" onClick={(e) => handleClick(1, "score")}>
                  {this.state.levels.L1.score}
                </button>
              </td>
              <td>
                <button className="buttonF" onClick={(e) => handleClick(1, "miss")}>
                  {this.state.levels.L1.miss}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
export default ReefScoring;
