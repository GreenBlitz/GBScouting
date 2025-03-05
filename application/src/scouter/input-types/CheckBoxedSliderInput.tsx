import React from "react";
import ScouterInput, { InputProps } from "../ScouterInput";
import { Slider } from "@mui/material";

interface CheckBoxedSliderProps {
  min: number;
  max: number;
  step?: number;
  defaultChecked?: boolean;
}

class CheckboxedSliderInput extends ScouterInput<
  number | undefined,
  CheckBoxedSliderProps,
  { isEnabled: boolean }
> {
  getStartingState(
    props: InputProps<number | undefined> & CheckBoxedSliderProps
  ): { isEnabled: boolean } | undefined {
    return { isEnabled: props.defaultChecked || false };
  }

  create(): React.JSX.Element {
    return <CheckboxedSliderInput {...this.props} />;
  }
  renderInput(): React.ReactNode {
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
        className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-offset-2 dark:border-dark-border dark:bg-dark-card dark:checked:bg-primary-500 dark:focus:ring-offset-dark-bg transition-colors duration-200"
        type="checkbox"
        id={this.storage.name}
        name={this.storage.name}
        required={this.props.required}
        onClick={updateCheckbox}
        defaultChecked={this.props.defaultChecked}
      />
    );

    return <div>{checkbox}</div>;
  }

  renderBelow(): React.ReactNode {
    const updateSliderStorage = (target: EventTarget | null) => {
      const actualTarget = target as EventTarget & { value: number };
      this.storage.set(actualTarget.value);
    };

    const slider = (
      <Slider
        step={this.props.step}
        defaultValue={this.props.min}
        marks
        valueLabelDisplay="auto"
        min={this.props.min}
        max={this.props.max}
        onChange={(event) => updateSliderStorage(event.target)}
      />
    );
    return this.state.isEnabled && slider;
  }

  initialValue(): number | undefined {
    return undefined;
  }
}

export default CheckboxedSliderInput;
