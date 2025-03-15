import React from "react";
import ScouterInput, { InputProps } from "../ScouterInput";
interface TwoOptions<T, P extends T[]> {
    map(arg0: (item: any, index: any) => React.JSX.Element): React.ReactNode;
    options1: P;
    options2: P;
}

class TeamNumberInput<Option extends string, Options extends Option[]> extends ScouterInput<number ,{options: TwoOptions<Option,Options>}> {
    create(): React.JSX.Element {
        return <TeamNumberInput {...this.props}/>;
    }
    renderInput(): React.ReactNode {
        let item1 ="";
        let item2 ="";
        return (
        <div>
            <select
            name={this.storage.name}
            id={this.storage.name}
            required={this.props.required}
            defaultValue={this.getValue()}
            onChange={(event) => {
                item1 = event.target.value
                this.storage.set()
            }}
            className="w-full p-2 bg-dark-bg text-dark-text border border-dark-border rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {this.props.options.map((item, index) => (
              <option value={item} key={index} className="bg-dark-bg text-dark-text">
                {item}
              </option>
            ))}
          </select>

          <select
            name={this.storage.name}
            id={this.storage.name}
            required={this.props.required}
            defaultValue={this.getValue()}
            onChange={(event) => {
                item2 = event.target.value
                this.storage.set()
            }}
            className="w-full p-2 bg-dark-bg text-dark-text border border-dark-border rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {this.props.options.map((item, index) => (
              <option value={item} key={index} className="bg-dark-bg text-dark-text">
                {item}
              </option>
            ))}
          </select>
        </div>
        );
      }
    initialValue(props: InputProps<number> & { options: TwoOptions<Option, Options>; }): number {
        return 0;
    }

}

export default TeamNumberInput;
