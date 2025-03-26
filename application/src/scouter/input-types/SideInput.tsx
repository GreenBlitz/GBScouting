import React from "react";
import ScouterInput, { InputProps } from "../ScouterInput";

export type SideSafe = "close" | "far" | "middle" | undefined;

class SideInput extends ScouterInput<SideSafe> {
  create(): React.JSX.Element {
    return <SideInput {...this.props} />;
  }
  renderInput(): React.ReactNode {
    return <></>;
  }

  initialValue(): SideSafe {
    return undefined;
  }
}

export default SideInput;
