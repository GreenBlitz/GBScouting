
export const matchTypes = ["practice", "qual", "playoff"] as const;
export type MatchType = typeof matchTypes[number];

