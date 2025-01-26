import React from "react"
import AmpMissComparison from "../comparing_between_teams/AmpMissComparison"
import SpeakerMissComparison from "./SpeakerMissComparison";

const ComparisonPage : React.FC = ()=>{
   return<>
   <AmpMissComparison />
   <SpeakerMissComparison />
   </> 
}
export default ComparisonPage;