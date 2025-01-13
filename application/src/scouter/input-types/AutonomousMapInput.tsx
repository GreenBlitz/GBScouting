import React from "react";
import ScouterInput, { InputProps } from "../ScouterInput";
import AutonomousForm from "../AutonomousForm";

export interface Sushi{
    HasSeeded: boolean
    HasHarvested: boolean
}

export interface AllSushis{
    Sushi1: Sushi
    Sushi2: Sushi
    Sushi3: Sushi
}

export enum ShusiToBeChanged{
    SUSHI1,
    SUSHI2,
    SUSHI3
}

export interface ValuesToBePassed{
    sushies: AllSushis, 
    sushiToBeChanged: ShusiToBeChanged,
    valueToBeChanged: Sushi
  }

class AutonomousMapInput extends ScouterInput<AllSushis>{
    renderInput(): React.ReactNode {
        return <AutonomousForm Sushi1={{HasSeeded: false, HasHarvested: false}} 
        Sushi2={{HasSeeded:false, HasHarvested: false}} Sushi3={{HasSeeded:false, HasHarvested:false}} />
    }
    create(): React.JSX.Element {
        return <AutonomousMapInput {...this.props} />
    }
    protected initialValue(props: InputProps<AllSushis>): AllSushis {
        return {
            Sushi1: {HasSeeded: false, HasHarvested: false}, 
                Sushi2: {HasSeeded: false, HasHarvested: false},
                Sushi3: {HasSeeded: false, HasHarvested: false}
            }
    }

    
}