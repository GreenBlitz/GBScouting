import React from "react";
import ScouterInput, { InputProps } from "../ScouterInput";
import {
  fetchAllAwaitingMatches,
  fetchAllTeamMatches,
} from "../../utils/Fetches";
import { Match } from "../../utils/Match";

interface TwoOptions<T, P extends T[]> {
  options1: P;
  options2: P;
}

interface TwoOptionAndTeamNumber<T extends string> {
  option1: T;
  option2: T;
  qualNumber: number;
  teamNumber: number;
}

const getTeamNumberByCretria = async <Option extends string>(
  qualNumber: number,
  option1: Option,
  option2: Option
) => {
  const allMatches = await fetchAllAwaitingMatches();
  if (!allMatches || !allMatches[qualNumber - 1]) {
    console.error("Match data is unavailable");
    return 4590;
  }

  const match = allMatches[qualNumber - 1];

  switch (option1) {
    case "Close":
      return option2 === "Blue" ? match.blueAlliance[0] : match.redAlliance[0];
    case "Middle":
      return option2 === "Blue" ? match.blueAlliance[1] : match.redAlliance[1];
    case "Far":
      return option2 === "Blue" ? match.blueAlliance[2] : match.redAlliance[2];
    default:
      return 4590;
  }
};

class TeamNumberInput<
  Option extends string,
  Options extends Option[]
> extends ScouterInput<
  TwoOptionAndTeamNumber<Option>,
  { twoOptions: TwoOptions<Option, Options> }
> {
  create(): React.JSX.Element {
    console.log(fetchAllAwaitingMatches());
    return <TeamNumberInput {...this.props} />;
  }

  renderInput(): React.ReactNode {
    return (
      <div style={{ width: "80%" }}>
        <div>
          <h3>Qual Number</h3>
          <input
            type="number"
            id={this.storage.name}
            name={this.storage.name}
            required={this.props.required}
            defaultValue={this.getValue()?.qualNumber ?? 0}
            onChange={async (event) => {
              let storedTwoOptionAndNumber = this.storage.get();
              if (storedTwoOptionAndNumber) {
                storedTwoOptionAndNumber = {
                  option1: storedTwoOptionAndNumber.option1,
                  option2: storedTwoOptionAndNumber.option2,
                  qualNumber: event.target.value as unknown as number,
                  teamNumber: 4590,
                };

                const updatedTeamNumber = await getTeamNumberByCretria(
                  storedTwoOptionAndNumber.qualNumber,
                  storedTwoOptionAndNumber.option1,
                  storedTwoOptionAndNumber.option2
                );

                this.storage.set({
                  ...storedTwoOptionAndNumber,
                  teamNumber: updatedTeamNumber,
                });
              }
              console.log(this.storage.get());
            }}
            className="w-full p-2 bg-dark-bg text-dark-text border border-dark-border rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <h3>Starting Position</h3>
          <select
            name={this.storage.name}
            id={this.storage.name}
            required={this.props.required}
            value={this.getValue()?.option1 ?? "Ran 1"}
            onChange={async (event) => {
              let storedTwoOptionAndNumber = this.storage.get();
              if (storedTwoOptionAndNumber) {
                storedTwoOptionAndNumber = {
                  option1: event.target.value as Option,
                  option2: storedTwoOptionAndNumber.option2,
                  qualNumber: storedTwoOptionAndNumber.qualNumber,
                  teamNumber: 4590,
                };

                const updatedTeamNumber = await getTeamNumberByCretria(
                  storedTwoOptionAndNumber.qualNumber,
                  storedTwoOptionAndNumber.option1,
                  storedTwoOptionAndNumber.option2
                );

                this.storage.set({
                  ...storedTwoOptionAndNumber,
                  teamNumber: updatedTeamNumber,
                });
              }
              this.forceUpdate(); // <---- Force component to re-render
              console.log(this.storage.get());
            }}
            className="w-full p-2 bg-dark-bg text-dark-text border border-dark-border rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {this.props.twoOptions.options1.map((item, index) => (
              <option
                value={item}
                key={index}
                className="bg-dark-bg text-dark-text"
              >
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h3>Alliance Color</h3>
          <select
            name={this.storage.name}
            id={this.storage.name}
            required={this.props.required}
            value={this.getValue()?.option2 ?? "Ran 2"}
            onChange={async (event) => {
              let storedTwoOptionAndNumber = this.storage.get();
              if (storedTwoOptionAndNumber) {
                const newStoredValue = {
                  ...storedTwoOptionAndNumber,
                  option2: event.target.value as Option,
                  teamNumber: 4590,
                };

                this.storage.set(newStoredValue);

                const updatedTeamNumber = await getTeamNumberByCretria(
                  newStoredValue.qualNumber,
                  newStoredValue.option1,
                  newStoredValue.option2
                );
                this.storage.set({
                  ...newStoredValue,
                  teamNumber: updatedTeamNumber,
                });
                this.forceUpdate();
              }
              console.log(this.storage.get());
            }}
            className="w-full p-2 bg-dark-bg text-dark-text border border-dark-border rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {this.props.twoOptions.options2.map((item, index) => (
              <option
                value={item}
                key={index}
                className="bg-dark-bg text-dark-text"
              >
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  initialValue(
    props: InputProps<TwoOptionAndTeamNumber<Option>> & {
      twoOptions: TwoOptions<Option, Options>;
    }
  ): TwoOptionAndTeamNumber<Option> {
    return {
      option1: props.twoOptions.options1[0] ?? ("" as Option),
      option2: props.twoOptions.options2[0] ?? ("" as Option),
      teamNumber: 0,
      qualNumber: 0,
    };
  }
}

export default TeamNumberInput;
