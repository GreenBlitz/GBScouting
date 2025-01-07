import React from "react";
import ScouterInput, { InputProps } from "../ScouterInput";
import { Slider } from "@mui/material";

class CheckBoxedSliderInput extends ScouterInput<
  number | undefined,
  { defaultChecked?: boolean; min: number; max: number },
  { isEnabled: boolean }
> {
  getStartingState(
    props: InputProps<number | undefined> & { defaultChecked?: boolean }
  ): { isEnabled: boolean } | undefined {
    return { isEnabled: props.defaultChecked || false };
  }

  create(): React.JSX.Element {
    return <CheckBoxedSliderInput {...this.props} />;
  }
  renderInput(): React.ReactNode {
    const updateSliderStorage = (target: EventTarget | null) => {
      const actualEvent = target as EventTarget & { value: number };
      this.storage.set(actualEvent.value);
    };

    const updateCheckbox = () => {
      if (this.state.isEnabled) {
        this.storage.set(undefined);
      } else {
        this.storage.set(this.props.min);
      }
      this.setState({ isEnabled: !this.state.isEnabled });
    };

    const checkbox = (
      <input
        type="checkbox"
        id={this.storage.name}
        name={this.storage.name}
        required={this.props.required}
        onClick={updateCheckbox}
        defaultChecked={this.props.defaultChecked}
      />
    );

    const slider = (
      <Slider
        step={1}
        defaultValue={this.props.min}
        marks
        valueLabelDisplay="auto"
        min={this.props.min}
        max={this.props.max}
        onChange={(event) => updateSliderStorage(event.target)}
      />
    );

    return (
      <>
        {checkbox}
        {this.state.isEnabled && slider }
      </>
    );
  }

  initialValue(): number | undefined {
    return undefined;
  }
}

export default CheckBoxedSliderInput;
