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
class AutonomousMapInput extends ScouterInput<AllSushis>{
    renderInput(): React.ReactNode {
        return <AutonomousForm />
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