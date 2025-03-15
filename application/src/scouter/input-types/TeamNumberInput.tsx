import React from "react";
import ScouterInput, { InputProps } from "../ScouterInput";
import React from "react";

interface TwoOptions<T, P extends T[]> {
    options1: P;
    options2: P;
}
interface TwoOptionAndTeamNumber<T> {
    option1: T;
    option2: T;
    teamNumber: number;
}

class TeamNumberInput<
  Option extends string,
  Options extends Option[]
> extends ScouterInput<
  TwoOptionAndTeamNumber<Option>,
  { twoOptions: TwoOptions<Option, Options> }
> {
    create(): React.JSX.Element {
        return <TeamNumberInput {...this.props}/>; // Prevent infinite recursion
    }

    renderInput(): React.ReactNode {
        return (
            <div>
                <select
                name={this.storage.name}
                id={this.storage.name}
                required={this.props.required}
                defaultValue={this.getValue()?.option1 ?? ""}
                onChange={(event) => {
                    const storedTwoOptionAndNumber = this.storage.get();
                    if (storedTwoOptionAndNumber) {
                        this.storage.set({
                            ...storedTwoOptionAndNumber,
                            option1: event.target.value as Option,
                            teamNumber: 
                        });
                    }
                }}
                className="w-full p-2 bg-dark-bg text-dark-text border border-dark-border rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                {this.props.twoOptions.options1.map((item, index) => (
                    <option value={item} key={index} className="bg-dark-bg text-dark-text">
                    {item}
                    </option>
                ))}
                </select>


                
                <select
                name={this.storage.name}
                id={this.storage.name}
                required={this.props.required}
                defaultValue={this.getValue()?.option1 ?? ""}
                onChange={(event) => {
                    const storedTwoOptionAndNumber = this.storage.get();
                    if (storedTwoOptionAndNumber) {
                        this.storage.set({
                            ...storedTwoOptionAndNumber,
                            option1: event.target.value as Option,
                            teamNumber: 
                        });
                    }
                }}
                className="w-full p-2 bg-dark-bg text-dark-text border border-dark-border rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                {this.props.twoOptions.options1.map((item, index) => (
                    <option value={item} key={index} className="bg-dark-bg text-dark-text">
                    {item}
                    </option>
                ))}
                </select>
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
            teamNumber: 0, // Default value for team number
        };
    }
}

export default TeamNumberInput;
