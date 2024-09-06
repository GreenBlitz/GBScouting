import { useState } from "react";
import ScouterQuery from "./ScouterQuery";
import QRCodeGenerator from "../components/QRCode-Generator";
import MapQuery from "./querytypes/MapQuery";

function ScouterApp() {
  const [formData, setFormData] = useState<Record<string, string> | undefined>(
    undefined
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    event.preventDefault();
    let formValues: Record<string, string> = {};
    for (let [key, value] of formData.entries()) {
      formValues[key] = value.toString();
    }
    setFormData(formValues);
  }

  function handleReset() {
    localStorage.clear();
    window.location.reload();
  }

  if (formData) {
    return <QRCodeGenerator text={JSON.stringify(formData)} />;
  }

  return (
    <form onSubmit={handleSubmit} onReset={handleReset}>
      <h1 className="scouter-tab">Tests</h1>
      <ScouterQuery queryType="text" name="Test 1 " />
      <ScouterQuery queryType="checkbox" name="Test 2 " />
      <ScouterQuery queryType="counter" name="Test 3 " />
      <ScouterQuery queryType="number" name="Test 4 " />
      <ScouterQuery queryType="list" name="Test 5 " list={["1", "2", "3"]} />
      <ScouterQuery
        queryType="radio"
        name="Test 6 "
        list={["a", "b", "c", "d"]}
      />
      <MapQuery
        width={500}
        height={500}
        imagePath="./src/assets/Crescendo Map.png"
      />
      <button type="submit">Submit</button>
      <button type="reset">Reset</button>
    </form>
  );
}

export default ScouterApp;
