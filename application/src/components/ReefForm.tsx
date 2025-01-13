import React from "react";
import ScouterInput from "../scouter/ScouterInput";
import { InputProps } from "../scouter/ScouterInput";
import "./reefScore.css";

interface Level {
  score: number;
  miss: number;
}

interface Levels {
  L1: Level;
  L2: Level;
  L3: Level;
  L4: Level;
}

class ReefScoring extends ScouterInput<Levels, {}, { levels: Levels; undoStack: { level: keyof Levels; point: keyof Level }[] }> {
  static handleUndo(): (value: string) => void {
    throw new Error("Method not implemented.");
  }
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

  getStartingState(props: InputProps<Levels>): { levels: Levels; undoStack: { level: keyof Levels; point: keyof Level }[] } {
    return {
      levels: this.initialValue(),
      undoStack: [],
    };
  
  }
  
  public handleUndo(level: keyof Levels, point: keyof Level): void {
    const updatedLevels = { ...this.state.levels };
    updatedLevels[level][point] += 1;
    this.setState({undoStack: [...this.state.undoStack, { level, point }]});
    this.storage.set(this.state.levels);

  }




  renderInput(): React.ReactNode {
    const handleClick = (level: keyof Levels, point: keyof Level) => {
      const updatedLevels = { ...this.state.levels };
      updatedLevels[level][point] += 1;
      this.setState({undoStack: [...this.state.undoStack, { level, point }]});
      this.storage.set(this.state.levels);
    };
    
  

   
   
    return (
      <div>
        <h1>Reef Scoring</h1>
        {Object.keys(this.state.levels).map((levelKey) => {
          const level = levelKey as keyof Levels;
          return (
            <div key={level}>
              <h2>{level}</h2>
              <button
                className="buttonS"
                onClick={() => handleClick(level, "score")}
              >
                {this.state.levels[level].score}
              </button>
              <button
                className="buttonF"
                onClick={() => handleClick(level, "miss")}
              >
                {this.state.levels[level].miss}
              </button>
            </div>
          );
        })}
     
      </div>
    );
  }
}

export default ReefScoring;
