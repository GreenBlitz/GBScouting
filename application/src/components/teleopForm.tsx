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

interface NetScore {
  score: number;
  miss: number;
}

interface NetAction {
  type: keyof NetScore;
}
type FullAction = NetAction | CoralAction | AlgeaAction;

interface CoralAction {
  level: keyof Levels;
  point: keyof Level;
}
interface Algea {
  algea: number;
}
interface AlgeaAction {
  type: keyof Algea;
}

class TeleopForm extends ScouterInput<
  Levels & NetScore & Algea,
  {},
  {
    levels: Levels;
    undoStack: FullAction[];
    netScore: NetScore;
    algeaScore: Algea;
  }
> {
  create(): React.JSX.Element {
    return <TeleopForm {...this.props} />;
  }

  initialValue(): Levels & NetScore & Algea {
    return {
      L1: { score: 0, miss: 0 },
      L2: { score: 0, miss: 0 },
      L3: { score: 0, miss: 0 },
      L4: { score: 0, miss: 0 },
      score: 0,
      miss: 0,
      algea: 0,
    };
  }

  getStartingState(props: InputProps<Levels>): {
    levels: Levels;
    undoStack: FullAction[];
    netScore: NetScore;
    algeaScore: Algea;
  } {
    return {
      levels: this.initialValue(),
      undoStack: [],
      netScore: { score: 0, miss: 0 },
      algeaScore: { algea: 0 },
    };
  }

  renderInput(): React.ReactNode {
    const levelKeys: (keyof Levels)[] = ["L1", "L2", "L3", "L4"];

    const handleClick = (action: CoralAction) => {
      const updatedLevels = { ...this.state.levels };
      updatedLevels[action.level][action.point] += 1;
      this.setState({
        undoStack: [
          ...this.state.undoStack,
          { level: action.level, point: action.point },
        ],
      });
      this.storage.set({
        ...updatedLevels,
        score: this.state.netScore.score,
        miss: this.state.netScore.miss,
        ...this.state.algeaScore,
      });
    };

    const handleNet = (action: NetAction) => {
      const updatedNetScore = { ...this.state.netScore };
      updatedNetScore[action.type] += 1;
      this.setState({ undoStack: [...this.state.undoStack, action] });
      this.setState({ netScore: updatedNetScore });
      this.storage.set({
        ...this.state.levels,
        ...updatedNetScore,
        ...this.state.algeaScore,
      });
    };

    const handleAlgea = (action: AlgeaAction) => {
      const updatedAlgeaScore = { ...this.state.algeaScore };
      updatedAlgeaScore[action.type] += 1;
      this.setState({ undoStack: [...this.state.undoStack, action] });
      this.setState({ algeaScore: updatedAlgeaScore });
      this.storage.set({
        ...this.state.levels,
        ...this.state.netScore,
        ...updatedAlgeaScore,
      });
    };

    const handleUndo = () => {
      if (this.state.undoStack.length === 0) return;

      const lastAction = this.state.undoStack[this.state.undoStack.length - 1];
      const updatedNetScore = { ...this.state.netScore };
      const updatedLevels = { ...this.state.levels };
      const updatedAlgea = { ...this.state.algeaScore };

      if ("level" in lastAction) {
        updatedLevels[lastAction.level][lastAction.point] -= 1;
        this.setState({ levels: updatedLevels });
      } else if (
        ("type" in lastAction && lastAction.type === "score") ||
        lastAction.type === "miss"
      ) {
        updatedNetScore[lastAction.type] -= 1;
        this.setState({ netScore: updatedNetScore });
      } else if ("type" in lastAction && lastAction.type === "algea") {
        updatedAlgea.algea -= 1;
        this.setState({ algeaScore: updatedAlgea });
      }

      this.setState({
        undoStack: this.state.undoStack.slice(0, -1),
      });

      this.storage.set({
        ...updatedLevels,
        ...updatedNetScore,
        ...updatedAlgea,
      });
    };

    return (
      <div className="container">
        <table>
          <tr>
            <td>
              {levelKeys.map((levelKey) => {
                const level = levelKey as keyof Levels;
                return (
                  <div className="section" key={level}>
                    <h2>{level}</h2>
                    <button
                      className="buttonS"
                      onClick={() =>
                        handleClick({ level: level, point: "score" })
                      }
                    >
                      {this.state.levels[level].score}
                    </button>
                    <button
                      className="buttonF"
                      onClick={() =>
                        handleClick({ level: level, point: "miss" })
                      }
                    >
                      {this.state.levels[level].miss}
                    </button>
                  </div>
                );
              })}
            </td>
            <td>
              <div className="section">
                <h2>Net Score</h2>
                <button
                  className="buttonS"
                  onClick={() => handleNet({ type: "score" })}
                >
                  {this.state.netScore.score}
                </button>
                <button
                  className="buttonF"
                  onClick={() => handleNet({ type: "miss" })}
                >
                  {this.state.netScore.miss}
                </button>
              </div>

              <div className="section">
                <h2>Algae</h2>
                <button
                  className="buttonS"
                  onClick={() => handleAlgea({ type: "algea" })}
                >
                  {this.state.algeaScore.algea}
                </button>
              </div>
            </td>
          </tr>
        </table>
        <button className="buttonU" onClick={handleUndo}>
          Undo
        </button>
      </div>
    );
  }
}

export default TeleopForm;
