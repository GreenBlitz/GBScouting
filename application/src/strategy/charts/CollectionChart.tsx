import React from "react";
import { NumberedCollection } from "../../utils/SeasonUI";
import AlgeaSVG from "../../assets/low-algea.svg";
import CoralSVG from "../../assets/low-coral.svg";

interface CollectionProps {
  collection: NumberedCollection;
}
const CollectionChart: React.FC<CollectionProps> = ({ collection }) => {

  return (
    <div className="rower mt-6">
      <button
        className={`${
          collection.coralFeederCollected ? "button-green" : "button-red"
        } big-button ml-0 text-xl`}
      >
        <h2 className="absolute mb-16 text-2xl font-extrabold">Feeder</h2>
        <img className="mt-5" src={CoralSVG} width={80} alt="Coral Icon" />
        {collection.coralFeederCollected}
      </button>
      <button
        className={`${
          collection.coralGroundCollected ? "button-green" : "button-red"
        } big-button ml-0 text-xl`}
      >
        <h2 className="absolute mb-16 text-2xl font-extrabold">Ground</h2>
        <img className="mt-5" src={CoralSVG} width={80} alt="Coral Icon" />
        {collection.coralGroundCollected}
      </button>
      <button
        className={`${
          collection.algeaGroundCollected ? "button-green" : "button-red"
        } big-button ml-0 text-xl`}
      >
        <h2 className="absolute mb-16 text-2xl font-extrabold">Ground</h2>
        <img className="mt-6" src={AlgeaSVG} width={40} alt="Algea Icon" />
        {collection.algeaGroundCollected}
      </button>
      <button
        className={`${
          collection.algeaReefCollected ? "button-green" : "button-red"
        } big-button ml-0 text-xl`}
      >
        <h2 className="absolute mb-16 text-2xl font-extrabold">Collected</h2>
        <img className="mt-6" src={AlgeaSVG} width={40} alt="Algea Icon" />
        {collection.algeaReefCollected}
      </button>
      <button
        className={`${
          collection.algeaReefDropped ? "button-green" : "button-red"
        } big-button ml-0 text-xl`}
      >
        <h2 className="absolute mb-16 text-2xl font-extrabold">Dropped</h2>
        <img className="mt-6" src={AlgeaSVG} width={40} alt="Algea Icon" />
        {collection.algeaReefDropped}
      </button>
    </div>
  );
};

export default CollectionChart;
