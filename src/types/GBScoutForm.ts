export interface GBScoutForm {
  deviceInfo: DeviceInfo;
  preMatch: PreMatch;
  generalRobotInfo: GeneralInfo;
  eventInfo: EventInfo;
  goodAt: GoodAt;
  auto: Auto;
  teleop: Teleop;
}

export interface AutoCoralBranch {
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
  processor: number;
  net: number;
  leave: boolean;
}

interface GoodAt {
  coralL1: boolean;
  coralL2: boolean;
  coralL3: boolean;
  coralL4: boolean;
  algaeNet: boolean;
  algaeProcessor: boolean;
  climb: boolean;
  defense: boolean;
  workingWithAlliance: boolean;
  driving: boolean;
  auto: boolean;
}

interface Teleop {
  L1: number;
  L2: number;
  L3: number;
  L4: number;
  processor: number;
  net: number;
  attemptedPark: boolean;
  attemptedShallow: boolean;
  attemptedDeep: boolean;
}

interface PreMatch {
  flag: string;
  noShow: boolean;
  startingLocation: "A" | "B" | "C";
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
