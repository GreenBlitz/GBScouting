import React from "react";
import ScouterInput, { InputProps } from "../ScouterInput";
import AutonomousForm from "../AutonomousForm";
import { StorageBackedInput } from "../../utils/FolderStorage";

export interface Sushi{
    HasSeeded: boolean
    HasHarvested: boolean
}

export interface AllSushis{
    Sushi1: Sushi
    Sushi2: Sushi
    Sushi3: Sushi
}

export interface AllSushisAndStorage{
    allSushis: AllSushis
    storage: StorageBackedInput<AllSushis>
}

export enum ShusiToBeChanged{
    SUSHI1,
    SUSHI2,
    SUSHI3
}

export interface ValuesToBePassed{
    storage: StorageBackedInput<AllSushis>
    sushies: AllSushis, 
    sushiToBeChanged: ShusiToBeChanged
  }

class AutonomousMapInput extends ScouterInput<AllSushis>{
    renderInput(): React.ReactNode {
        const allSushis: AllSushis = {Sushi1:{HasSeeded: false, HasHarvested: false},
        Sushi2:{HasSeeded:false, HasHarvested: false}, Sushi3:{HasSeeded:false, HasHarvested:false}}
        const storage: StorageBackedInput<AllSushis> = this.storage
        const allSushisAndStorage = {allSushis, storage}
        return <AutonomousForm {...allSushisAndStorage} />
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