import React, { useEffect } from "react";
import CheckboxQuery from "./querytypes/CheckboxQuery";
import CounterQuery from "./querytypes/CounterQuery";
import ListQuery from "./querytypes/ListQuery";
import RadioQuery from "./querytypes/RadioQuery";
interface ScouterQueryProps {
  name: string;
  queryType: "text" | "counter" | "checkbox" | "number" | "list" | "radio";
  required?: boolean | undefined;
  list?: string[];
}

export const localStorageTabName = "Queries/";

const ScouterQuery: React.FC<ScouterQueryProps> = ({
  name,
  queryType,
  required,
  list,
}) => {
  function renderInput() {
    switch (queryType) {
      case "counter":
        return <CounterQuery name={name} />;
      case "checkbox":
        return <CheckboxQuery name={name} required={required} />;
      case "list":
        return (
          <ListQuery name={name} required={required} list={list ? list : []} />
        );
      case "radio":
        return (
          <RadioQuery name={name} required={required} list={list ? list : []} />
        );
      default:
        const storageName = localStorageTabName + name;
        useEffect(() => {
          if (!localStorage.getItem(storageName))
            localStorage.setItem(storageName, "");
        });
        return (
          <input
            type={queryType}
            id={name}
            name={name}
            required={required}
            defaultValue={localStorage.getItem(storageName) || ""}
            onChange={(event) =>
              localStorage.setItem(storageName, event.target.value)
            }
          />
        );
    }
  }

  return (
    <div className="scouter-query">
      <h2>{name}</h2>
      {renderInput()}
    </div>
  );
};

export default ScouterQuery;
