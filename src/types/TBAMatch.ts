export interface TBAMatch {
  actual_time: number;
  alliances: Alliancize<AllianceData>
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
  autoLineRobot1: string;
  autoLineRobot2: string;
  autoLineRobot3: string;
  autoMobilityPoints: number;
  autoPoints: number;
  autoReef: Reef;
  bargeBonusAchieved: boolean;
  coopertitionCriteriaMet: boolean;
  coralBonusAchieved: boolean;
  endGameBargePoints: number;
  endGameRobot1: string;
  endGameRobot2: string;
  endGameRobot3: string;
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
