import React from "react";
import { Collection } from "../../utils/SeasonUI";
import AlgeaSVG from "../../assets/low-algea.svg";
import CoralSVG from "../../assets/low-coral.svg";

interface CollectionProps {
  collection: Collection;
}
const CollectionChart: React.FC<CollectionProps> = ({ collection }) => {
  const algeaScoring = (
    <div className="flex flex-col items-center">
      <div className="rower">
        <button
          className={`${
            collection.algeaReefCollected ? "button-green" : "button-red"
          } big-button ml-0`}
        >
          <h2 className="absolute mb-16 text-2xl font-extrabold">Collected</h2>
          <img className="mt-6" src={AlgeaSVG} width={60} alt="Algea Icon" />
        </button>
        <button
          className={`${
            collection.algeaReefDropped ? "button-green" : "button-red"
          } big-button ml-0`}
        >
          <h2 className="absolute mb-16 text-2xl font-extrabold">Dropped</h2>
          <img className="mt-6" src={AlgeaSVG} width={60} alt="Algea Icon" />
        </button>
      </div>
      <button
        className={`${
          collection.algeaGroundCollected ? "button-green" : "button-red"
        } big-button ml-0`}
      >
        <h2 className="absolute mb-16 text-2xl font-extrabold">Ground</h2>
        <img className="mt-6" src={AlgeaSVG} width={60} alt="Algea Icon" />
      </button>
    </div>
  );

  const coralScoring = (
    <div className="rower mt-6">
      <button
        className={`${
          collection.coralFeederCollected ? "button-green" : "button-red"
        } big-button ml-0`}
      >
        <h2 className="absolute mb-16 text-2xl font-extrabold">Feeder</h2>
        <img className="mt-2" src={CoralSVG} width={80} alt="Coral Icon" />
      </button>
      <button
        className={`${
          collection.coralGroundCollected ? "button-green" : "button-red"
        } big-button ml-0`}
      >
        <h2 className="absolute mb-16 text-2xl font-extrabold">Ground</h2>
        <img className="mt-2" src={CoralSVG} width={80} alt="Coral Icon" />
      </button>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center">
      {algeaScoring}
      {coralScoring}
    </div>
  );
};

export default CollectionChart;
