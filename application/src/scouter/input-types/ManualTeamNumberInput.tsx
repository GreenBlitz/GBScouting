import React from "react";
import ScouterInput, { InputProps } from "../ScouterInput";
import { fetchAllAwaitingMatches } from "../../utils/Fetches";

// Interfaces for the component's data structure
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

// Define state interface
interface ManualTeamNumberInputState {
    isDisabled: boolean;
    manualTeamNumber: number;
}

// Function to fetch the team number based on criteria
const getTeamNumberByCriteria = async <Option extends string>(
    qualNumber: number,
    option1: Option,
    option2: Option
) => {
    const allMatches = await fetchAllAwaitingMatches();
    if (!allMatches || !allMatches[qualNumber - 1]) {
        console.error("Match data is unavailable");
        return -1;
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
            return -1;
    }
};

class ManualTeamNumberInput<
    Option extends string,
    Options extends Option[]
> extends ScouterInput<
    TwoOptionAndTeamNumber<Option>,
    { twoOptions: TwoOptions<Option, Options> },
    ManualTeamNumberInputState
> {
    create(): React.JSX.Element {
        return <ManualTeamNumberInput {...this.props}/>
    }
    constructor(props: any) {
        super(props);
        this.state = {
            isDisabled: false,
            manualTeamNumber: this.getValue()?.teamNumber ?? 9999,
        };
    }

    handleTeamNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!this.state.isDisabled) {
            const newTeamNumber = Number(event.target.value);
            this.setState({ manualTeamNumber: newTeamNumber });

            let storedTwoOptionAndNumber = this.storage.get();
            if (storedTwoOptionAndNumber) {
                storedTwoOptionAndNumber.teamNumber = newTeamNumber;
                this.storage.set(storedTwoOptionAndNumber);
            }
        }
    };

    toggleDisable = () => {
        this.setState((prevState) => ({
            isDisabled: !prevState.isDisabled,
        }));
    };

    handleSelectionChange = async (
        field: "qualNumber" | "option1" | "option2",
        value: string | number
    ) => {
        let storedTwoOptionAndNumber = this.storage.get();
        if (storedTwoOptionAndNumber) {
            storedTwoOptionAndNumber = {
                ...storedTwoOptionAndNumber,
                [field]: value,
                teamNumber: -1,
            };

            const updatedTeamNumber = await getTeamNumberByCriteria(
                storedTwoOptionAndNumber.qualNumber,
                storedTwoOptionAndNumber.option1,
                storedTwoOptionAndNumber.option2
            );

            this.storage.set({
                ...storedTwoOptionAndNumber,
                teamNumber: updatedTeamNumber,
            });

            this.setState({ manualTeamNumber: updatedTeamNumber });
        }
    };

    renderInput(): React.ReactNode {
        return (
            <div style={{ width: "80%" }}>
                {/* Qual Number Input */}
                <div>
                    <h3>Qual Number</h3>
                    <input
                        type="number"
                        required={this.props.required}
                        defaultValue={this.getValue()?.qualNumber ?? 9999}
                        onChange={(event) =>
                            this.handleSelectionChange("qualNumber", Number(event.target.value))
                        }
                        className="w-full p-2 bg-dark-bg text-dark-text border border-dark-border rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>

                {/* Starting Position Select */}
                <div>
                    <h3>Starting Position</h3>
                    <select
                        required={this.props.required}
                        value={this.getValue()?.option1 ?? ""}
                        onChange={(event) =>
                            this.handleSelectionChange("option1", event.target.value)
                        }
                        className="w-full p-2 bg-dark-bg text-dark-text border border-dark-border rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                        {this.props.twoOptions.options1.map((item, index) => (
                            <option value={item} key={index} className="bg-dark-bg text-dark-text">
                                {item}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Alliance Color Select */}
                <div>
                    <h3>Alliance Color</h3>
                    <select
                        required={this.props.required}
                        value={this.getValue()?.option2 ?? ""}
                        onChange={(event) =>
                            this.handleSelectionChange("option2", event.target.value)
                        }
                        className="w-full p-2 bg-dark-bg text-dark-text border border-dark-border rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                        {this.props.twoOptions.options2.map((item, index) => (
                            <option value={item} key={index} className="bg-dark-bg text-dark-text">
                                {item}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Team Number Input */}
                <div>
                    <h3>Team Number</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <input
                            type="number"
                            required={this.props.required}
                            value={this.state.manualTeamNumber}
                            onChange={this.handleTeamNumberChange}
                            disabled={this.state.isDisabled}
                            className="w-full p-2 bg-dark-bg text-dark-text border border-dark-border rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <button
                            type="button"
                            onClick={this.toggleDisable}
                            className={`p-2 text-white rounded shadow ${
                                this.state.isDisabled ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                            }`}
                        >
                            {this.state.isDisabled ? "Enable" : "Disable"}
                        </button>
                    </div>
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
            qualNumber: 9999,
            teamNumber: 9999,
        };
    }
}

export default ManualTeamNumberInput;
