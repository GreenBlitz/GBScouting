export interface GBScoutForm {
  deviceInfo: DeviceInfo;
  preMatch: PreMatch;
  generalRobotInfo: GeneralInfo;
  eventInfo: EventInfo;
  goodAt: GoodAt;
  autoCoral: Auto;
  teleop: Teleop;
}

interface AutoCoralBranch {
  L2: boolean;
  L3: boolean;
  L4: boolean;
}

interface AutoCoralBranches {
  A: AutoCoralBranch;
  B: AutoCoralBranch;
  C: AutoCoralBranch;
  D: AutoCoralBranch;
  E: AutoCoralBranch;
  F: AutoCoralBranch;
  G: AutoCoralBranch;
  H: AutoCoralBranch;
  I: AutoCoralBranch;
  J: AutoCoralBranch;
  K: AutoCoralBranch;
  L: AutoCoralBranch;
}

interface AutoCoralL1 {
  AB: number;
  CD: number;
  EF: number;
  GH: number;
  IJ: number;
  KL: number;
}

interface Auto {
  branches: AutoCoralBranches;
  L1: AutoCoralL1;
  autoProcessor: number;
  autoNet: number;
  leave: boolean;
}

interface GoodAt {
  goodAtCoralL1: number;
  goodAtCoralL2: number;
  goodAtCoralL3: number;
  goodAtCoralL4: number;
  goodAtAlgaeNet: number;
  goodAtAlgaeProcessor: number;
  goodAtClimb: number;
  goodAtDefense: number;
  goodAtWorkingWithAlliance: number;
  goodAtDriving: number;
  goodAtAuto: number;
}

interface Teleop {
  L1: number;
  L2: number;
  L3: number;
  L4: number;
  Processor: number;
  Net: number;
  Park: boolean;
  AttemptedShallow: boolean;
  AttemptedDeep: boolean;
  SuccessfulShallow: boolean;
  SuccessfulDeep: boolean;
}

interface PreMatch {
  flag: string;
  noShow: boolean;
  startingLocation: "A" | "B" | "C"
  died: boolean;
  matchNumber: number;
  teamNumber: number;
  alliance: "Red" | "Blue";
  robotNumber: number;
}

interface DeviceInfo {
  teamNumber: number;
  id: string;
  scoutTeamNumber: number;
  scoutName: string;
}

interface GeneralInfo {
  playedDefense: boolean;
  removedAlgaeFromReef: boolean;
  comments: string;
}

interface EventInfo {
  eventKey: string;
  matchLevel: string;
}
