import React from "react";
import ScouterInput, { InputProps } from "../ScouterInput";

interface ReefSide {
  side: "left" | "right";
  proximity: "far" | "middle" | "close";
}
const [width, height] = [400, 400];
const imagePath = "/src/assets/reef.png";

class ReefPickInput extends ScouterInput<
  ReefSide[],
  { setUndo: (undo: () => void) => void }
> {
  create(): React.JSX.Element {
    return <ReefPickInput {...this.props} />;
  }
  initialValue(props: InputProps<ReefSide[]>): ReefSide[] {
    return [];
  }

  undo() {
    const previous = this.getValue();
    previous.splice(previous.length - 1, 1);
    this.storage.set(previous);
  }

  componentDidMount(): void {
    this.props.setUndo(this.undo);
  }

  addSide(side: ReefSide) {
    const previous = this.getValue();
    this.storage.set([...previous, side]);
  }

  renderInput(): React.ReactNode {
    return (
      <div
        style={{
          backgroundImage: 'url("' + imagePath + '")',
          backgroundSize: "100% 100%",
          width: width,
          height: height,
          position: "relative",
        }}
      >
        <button
          className="px-16 py-8 text-white bg-yellow-500 border-none rounded-lg transform rotate-90"
          style={{
            position: "absolute",
            top: 165,
            right: 280,
          }}
          onClick={() => this.addSide({ side: "left", proximity: "middle" })}
        />
        <button
          className="px-16 py-8 text-white bg-yellow-500 border-none rounded-lg transform rotate-90"
          style={{
            position: "absolute",
            top: 165,
            right: -25,
          }}
          onClick={() => this.addSide({ side: "right", proximity: "middle" })}
        />
        <button
          className="px-16 py-8 text-white bg-yellow-500 border-none rounded-lg thirty-degrees"
          style={{
            position: "absolute",
            top: 35,
            right: 50,
          }}
          onClick={() => this.addSide({ side: "right", proximity: "far" })}
        />
        <button
          className="px-16 py-8 text-white bg-yellow-500 border-none rounded-lg minus-thirty-degrees"
          style={{
            position: "absolute",
            top: 35,
            right: 205,
          }}
          onClick={() => this.addSide({ side: "left", proximity: "far" })}
        />
        <button
          className="px-16 py-8 text-white bg-yellow-500 border-none rounded-lg minus-thirty-degrees"
          style={{
            position: "absolute",
            top: 300,
            right: 50,
          }}
          onClick={() => this.addSide({ side: "right", proximity: "close" })}
        />
        <button
          className="px-16 py-8 text-white bg-yellow-500 border-none rounded-lg thirty-degrees"
          style={{
            position: "absolute",
            top: 300,
            right: 205,
          }}
          onClick={() => this.addSide({ side: "left", proximity: "close" })}
        />
      </div>
    );
  }
}
export default ReefPickInput;
