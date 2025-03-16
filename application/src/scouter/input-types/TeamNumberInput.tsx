import React from "react";
import ScouterInput, { InputProps } from "../ScouterInput";

interface TwoOptions<T, P extends T[]> {
    options1: P;
    options2: P;
}
interface TwoOptionAndTeamNumber<T extends string> {
    option1: T;
    option2: T;
    qualNumber: number
    teamNumber: number;
}

class TeamNumberInput<Option extends string, Options extends Option[]> extends ScouterInput<TwoOptionAndTeamNumber<Option>,{ twoOptions: TwoOptions<Option, Options> }> {
    create(): React.JSX.Element {
        // console.log("is Storage defined?", this.storage)
        return <TeamNumberInput {...this.props}/>;
    }

    renderInput(): React.ReactNode {
        return (
        <div>
            <input
            type="number"
            id={this.storage.name}
            name={this.storage.name}
            required={this.props.required}
            defaultValue={this.getValue()?.teamNumber ?? (9999)}
            onChange={(event) => {
                let storedTwoOptionAndNumber = this.storage.get();
                    console.log(storedTwoOptionAndNumber)
                    if (storedTwoOptionAndNumber) {
                        this.storage.set({
                            option1: storedTwoOptionAndNumber.option1,
                            option2: storedTwoOptionAndNumber.option2,
                            teamNumber: 4590,
                            qualNumber: event.target.value as unknown as number
                        });
                    }
                    console.log(this.storage.get())
            }}
            className="w-full p-2 bg-dark-bg text-dark-text border border-dark-border rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
                <select
                name={this.storage.name}
                id={this.storage.name}
                required={this.props.required}
                value={this.getValue()?.option1 ?? "Ran 1"}
                onChange={(event) => {
                    let storedTwoOptionAndNumber = this.storage.get();
                    console.log(storedTwoOptionAndNumber)
                    if (storedTwoOptionAndNumber) {
                        this.storage.set({
                            option1: event.target.value as Option,
                            option2: storedTwoOptionAndNumber.option2,
                            teamNumber: 4590,
                            qualNumber: storedTwoOptionAndNumber.qualNumber
                        });
                    }
                    console.log(this.storage.get())
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
                value={this.getValue()?.option2 ?? "Ran 2"}
                onChange={(event) => {
                    let storedTwoOptionAndNumber = this.storage.get();
                    console.log(storedTwoOptionAndNumber?.option1, storedTwoOptionAndNumber?.option2, storedTwoOptionAndNumber?.teamNumber)
                    if (storedTwoOptionAndNumber) {
                        this.storage.set({
                            option1: storedTwoOptionAndNumber.option1,
                            option2: event.target.value as Option as Option,
                            teamNumber: 4590,
                            qualNumber: storedTwoOptionAndNumber.qualNumber
                        });
                    }
                    console.log(this.storage.get())
                }}
                className="w-full p-2 bg-dark-bg text-dark-text border border-dark-border rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                {this.props.twoOptions.options2.map((item, index) => (
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
            teamNumber: 4590, // Default value for team number
            qualNumber: 9999
        };
    }
}

export default TeamNumberInput;