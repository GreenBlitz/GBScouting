import React from "react";
import ScouterInput, { InputProps } from "../ScouterInput";
import { fetchAllAwaitingMatches, fetchAllTeamMatches } from "../../utils/Fetches";
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

const allMatches = await fetchAllAwaitingMatches();
console.log(allMatches); 

const getTeamNumberByCretria = async <Option extends string>(qualNumber: number, option1: Option, option2: Option) => {
    const allMatches = await fetchAllAwaitingMatches();  // Fetch all matches inside the function to ensure it's up-to-date
    if (!allMatches || !allMatches[qualNumber - 1]) {
        console.error('Match data is unavailable');
        return 4590;  // Return default value in case of failure
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
}

class TeamNumberInput<Option extends string, Options extends Option[]> extends ScouterInput<TwoOptionAndTeamNumber<Option>, { twoOptions: TwoOptions<Option, Options> }> {

    create(): React.JSX.Element {
        console.log(fetchAllAwaitingMatches());
        return <TeamNumberInput {...this.props} />;
    }

    renderInput(): React.ReactNode {
        return (
            <div>
                <input
                    type="number"
                    id={this.storage.name}
                    name={this.storage.name}
                    required={this.props.required}
                    defaultValue={this.getValue()?.qualNumber ?? 9999}
                    onChange={async (event) => {
                        let storedTwoOptionAndNumber = this.storage.get();
                        if (storedTwoOptionAndNumber) {
                            storedTwoOptionAndNumber = {
                                option1: storedTwoOptionAndNumber.option1,
                                option2: storedTwoOptionAndNumber.option2,
                                qualNumber: event.target.value as unknown as number,
                                teamNumber: 4590, // Temporary value before update
                            };

                            // Await the resolved team number
                            const updatedTeamNumber = await getTeamNumberByCretria(
                                storedTwoOptionAndNumber.qualNumber,
                                storedTwoOptionAndNumber.option1,
                                storedTwoOptionAndNumber.option2
                            );

                            this.storage.set({
                                ...storedTwoOptionAndNumber,
                                teamNumber: updatedTeamNumber, // Set the resolved team number
                            });
                        }
                        console.log(this.storage.get());
                    }}
                    className="w-full p-2 bg-dark-bg text-dark-text border border-dark-border rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                
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
                                teamNumber: 4590, // Temporary value before update
                            };

                            // Await the resolved team number
                            const updatedTeamNumber = await getTeamNumberByCretria(
                                storedTwoOptionAndNumber.qualNumber,
                                storedTwoOptionAndNumber.option1,
                                storedTwoOptionAndNumber.option2
                            );

                            this.storage.set({
                                ...storedTwoOptionAndNumber,
                                teamNumber: updatedTeamNumber, // Set the resolved team number
                            });
                        }
                        console.log(this.storage.get());
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
                    onChange={async (event) => {
                        let storedTwoOptionAndNumber = this.storage.get();
                        if (storedTwoOptionAndNumber) {
                            storedTwoOptionAndNumber = {
                                option1: storedTwoOptionAndNumber.option1,
                                option2: event.target.value as Option,
                                qualNumber: storedTwoOptionAndNumber.qualNumber,
                                teamNumber: 4590, // Temporary value before update
                            };

                            // Await the resolved team number
                            const updatedTeamNumber = await getTeamNumberByCretria(
                                storedTwoOptionAndNumber.qualNumber,
                                storedTwoOptionAndNumber.option1,
                                storedTwoOptionAndNumber.option2
                            );

                            this.storage.set({
                                ...storedTwoOptionAndNumber,
                                teamNumber: updatedTeamNumber, // Set the resolved team number
                            });
                        }
                        console.log(this.storage.get());
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