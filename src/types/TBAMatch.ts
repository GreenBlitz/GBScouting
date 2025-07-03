export interface TBAMatch {
  actual_time: number;
  alliances: Alliancize<AllianceData>;
  comp_level: string;
  event_key: string;
  key: string;
  match_number: number;
  post_result_time: number;
  predicted_time: number;
  score_breakdown: Alliancize<AllianceBreakdown>;
  set_number: number;
  time: number;
  videos: {
    key: string;
    type: string;
  }[];
  winning_alliance: string;
}

interface ReefRow {
  nodeA: boolean;
  nodeB: boolean;
  nodeC: boolean;
  nodeD: boolean;
  nodeE: boolean;
  nodeF: boolean;
  nodeG: boolean;
  nodeH: boolean;
  nodeI: boolean;
  nodeJ: boolean;
  nodeK: boolean;
  nodeL: boolean;
}

interface Reef {
  botRow: ReefRow;
  midRow: ReefRow;
  tba_botRowCount: number;
  tba_midRowCount: number;
  tba_topRowCount: number;
  topRow: ReefRow;
  trough: number;
}

interface AllianceBreakdown {
  adjustPoints: number;
  algaePoints: number;
  autoBonusAchieved: boolean;
  autoCoralCount: number;
  autoCoralPoints: number;
  autoLineRobot1: YesNo;
  autoLineRobot2: YesNo;
  autoLineRobot3: YesNo;
  autoMobilityPoints: number;
  autoPoints: number;
  autoReef: Reef;
  bargeBonusAchieved: boolean;
  coopertitionCriteriaMet: boolean;
  coralBonusAchieved: boolean;
  endGameBargePoints: number;
  endGameRobot1: EndgameRobot;
  endGameRobot2: EndgameRobot;
  endGameRobot3: EndgameRobot;
  foulCount: number;
  foulPoints: number;
  g206Penalty: boolean;
  g410Penalty: boolean;
  g418Penalty: boolean;
  g428Penalty: boolean;
  netAlgaeCount: number;
  rp: number;
  techFoulCount: number;
  teleopCoralCount: number;
  teleopCoralPoints: number;
  teleopPoints: number;
  teleopReef: Reef;
  totalPoints: number;
  wallAlgaeCount: number;
}

interface Alliancize<T> {
  blue: T;
  red: T;
}

interface AllianceData {
  dq_team_keys: [];
  score: number;
  surrogate_team_keys: [];
  team_keys: string[];
}

type EndgameRobot = "None" | "Parked" | "DeepCage" | "ShallowCage";
type YesNo = "Yes" | "No";